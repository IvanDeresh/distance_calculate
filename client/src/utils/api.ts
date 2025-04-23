import { Point } from "../types/store";
import { Suggestion } from "../types/util";
import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const API_KEY = import.meta.env.VITE_API_KEY;

export const geocode = async (query: string) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        format: "json",
        q: query,
        limit: 1,
        addressdetails: 1,
      },
    });

    const data = response.data;
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
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        format: "json",
        q: query,
        limit: 5,
        addressdetails: 1,
      },
    });

    const data = response.data;
    console.log(data);
    return data as Suggestion[];
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

export async function getRoadRoute(p1: Point, p2: Point) {
  const res = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      coordinates: [
        [p1.lng, p1.lat],
        [p2.lng, p2.lat],
      ],
    },
    {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
