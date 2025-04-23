import type { NextApiRequest, NextApiResponse } from "next";

const PAYPAL_API = "https://api-m.paypal.com"; // Live endpoint

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  console.log("🧪 ENV CHECK: PAYPAL_CLIENT_ID:", !!clientId);
  console.log("🧪 ENV CHECK: PAYPAL_SECRET:", !!clientSecret);

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: "PayPal API credentials are missing",
    });
  }

  const { purchase_units, application_context } = req.body;

  if (!purchase_units || !Array.isArray(purchase_units)) {
    return res.status(400).json({ error: "Missing or invalid purchase_units" });
  }

  try {
    // Step 1: Get access token from PayPal
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    console.log("🔐 Token Response:", tokenData);

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("❌ Failed to get token:", tokenData);
      throw new Error(tokenData.error_description || "Token request failed");
    }

    const accessToken = tokenData.access_token;

    // Step 2: Create PayPal order
    const orderBody = {
      intent: "CAPTURE",
      purchase_units,
      ...(application_context && { application_context }),
    };

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const orderData = await orderRes.json();
    console.log("🧾 Order Response:", orderData);

    if (!orderRes.ok || !orderData.id) {
      console.error("❌ Failed to create order:", orderData);
      throw new Error(orderData.message || "Order creation failed");
    }

    return res.status(200).json(orderData);
  } catch (err: unknown) {
    console.error("❌ PayPal Order Creation Failed:", err);
    return res.status(500).json({
      error: "PayPal order creation failed",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
