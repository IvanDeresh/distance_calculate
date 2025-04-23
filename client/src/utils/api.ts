import { Suggestion } from "../types/util";

export const geocode = async (query: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1&addressdetails=1`
    );
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return null;
  } catch (error) {
    console.error("Geocode error:", error);
    return null;
  }
};

export const fetchSuggestions = async (
  query: string,
  retries: number = 3
): Promise<Suggestion[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`
    );
    const data = await response.json();
    console.log(data);
    if (response.ok && data) {
      return data as Suggestion[];
    } else {
      throw new Error("Failed to fetch suggestions");
    }
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    if (retries > 0) {
      console.log(`Retrying... attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchSuggestions(query, retries - 1);
    }
    return [];
  }
};

export const isCoordinates = (value: string) => {
  const regex = /^-?\d+(\.\d+)?,\s?-?\d+(\.\d+)?$/;
  return regex.test(value);
};
