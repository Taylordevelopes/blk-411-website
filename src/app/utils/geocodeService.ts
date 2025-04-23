export const geocodeAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string
): Promise<{ latitude: number; longitude: number }> => {
  const fullAddress = `${street}, ${city}, ${state}, ${postalCode}, USA`;
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_KEY;

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        fullAddress
      )}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocoding data from OpenCage");
    }

    const data = await response.json();

    if (data.results.length === 0) {
      throw new Error("No location found for this address.");
    }

    const { lat, lng } = data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error("Error fetching coordinates from OpenCage:", error);
    throw error;
  }
};
