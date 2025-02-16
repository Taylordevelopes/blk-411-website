import type { NextApiRequest, NextApiResponse } from "next";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

interface PurchaseUnit {
  amount: {
    currency_code: string;
    value: string;
  };
  reference_id?: string;
  description?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { purchase_units } = req.body;

  try {
    // Step 1: Get PayPal Access Token
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("❌ PayPal Token Error:", tokenData);
      throw new Error(
        `Failed to retrieve PayPal token: ${
          tokenData.error_description || tokenData.error
        }`
      );
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error("PayPal token is missing");
    }

    console.log("✅ PayPal Access Token received");

    // Step 2: Create PayPal Order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: purchase_units.map((unit: PurchaseUnit) => ({
          ...unit,
          amount: {
            currency_code: unit.amount.currency_code || "USD",
            value: unit.amount.value || "20.00",
          },
        })),
        application_context: {
          brand_name: "Black 411",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("❌ PayPal Order Error:", orderData);
      throw new Error(
        `Failed to create PayPal order: ${
          orderData.message || JSON.stringify(orderData)
        }`
      );
    }

    console.log("✅ PayPal Order Created:", orderData);
    return res.status(200).json(orderData);
  } catch (err) {
    console.error("❌ PayPal Order Creation Failed:", err);
    return res.status(500).json({
      error: "Failed to create PayPal order",
      details: (err as Error).message,
    });
  }
}
