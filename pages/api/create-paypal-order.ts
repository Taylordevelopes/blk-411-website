import type { NextApiRequest, NextApiResponse } from "next";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { purchase_units } = req.body;

    try {
      // Get Access Token
      const accessToken = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })
        .then((res) => res.json())
        .then((data) => data.access_token);

      if (!accessToken) {
        throw new Error("Failed to retrieve PayPal access token");
      }

      // Create Order with redirect URLs
      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: purchase_units.map((unit: any) => ({
            ...unit,
            amount: {
              currency_code: unit.amount.currency_code || "USD", // Default to USD
              value: unit.amount.value || "20.00", // Default value
            },
          })),
          application_context: {
            brand_name: "Your Business Name",
            landing_page: "BILLING", // Options: "NO_PREFERENCE", "LOGIN", "BILLING"
            user_action: "PAY_NOW", // Ensures PayPal button shows 'Pay Now'
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation`, // Redirect after success
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`, // Redirect if canceled
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      res.status(200).json(data);
    } catch (err) {
      console.error("PayPal order creation failed:", err);
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
