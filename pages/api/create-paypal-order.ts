import type { NextApiRequest, NextApiResponse } from "next";

const PAYPAL_API = "https://api-m.paypal.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log("Environment Variables in API Route:");
  console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
  console.log("PAYPAL_SECRET:", process.env.PAYPAL_SECRET);

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
    return res
      .status(500)
      .json({ error: "PayPal API credentials are missing" });
  }

  const { purchase_units } = req.body;

  try {
    // Get PayPal Access Token
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
        tokenData.error_description || "Failed to retrieve PayPal token"
      );
    }

    const accessToken = tokenData.access_token;

    // Create PayPal Order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: purchase_units,
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderResponse.ok) {
      console.error("❌ PayPal Order Error:", orderData);
      throw new Error(orderData.message || "Failed to create PayPal order");
    }

    // Return PayPal Order ID to Frontend
    res.status(200).json(orderData);
  } catch (err) {
    console.error("❌ PayPal Order Creation Failed:", err);
    return res.status(500).json({
      error: "Failed to create PayPal order",
      details: (err as Error).message,
    });
  }
}
