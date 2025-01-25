export const createPayPalOrder = async () => {
  const orderDetails = {
    purchase_units: [
      {
        reference_id: "example_ref_id",
        amount: {
          value: "75.00", // Amount to charge
          currency_code: "USD", // Specify currency
        },
      },
    ],
  };

  try {
    const response = await fetch("/api/create-paypal-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails),
    });

    const data = await response.json();

    if (data.id) {
      return data.id;
    } else {
      throw new Error("Failed to create PayPal order.");
    }
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
};
