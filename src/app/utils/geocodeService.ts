export const geocodeAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string
) => {
  const fullAddress = `${street}, ${city}, ${state}, ${postalCode}, USA`;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocoding data");
    }

    const data = await response.json();

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Geocoding failed: " + data.status);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};
