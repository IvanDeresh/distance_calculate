import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setPoints, removePoint } from "../store/features/mapSlice";
import { getDistanceKm } from "../utils/haversine";
import { useEffect, useState } from "react";
import SuggestionsItem from "./SuggestionsItem";
import PointItem from "./PointItem";
import { fetchSuggestions, isCoordinates } from "../utils/api";

// const geocode = async (query: string) => {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//         query
//       )}&limit=1&addressdetails=1`
//     );
//     const data = await response.json();
//     if (data.length > 0) {
//       const { lat, lon } = data[0];
//       return { lat: parseFloat(lat), lng: parseFloat(lon) };
//     }
//     return null;
//   } catch (error) {
//     console.error("Geocode error:", error);
//     return null;
//   }
// };

export default function DistanceInfo() {
  const points = useSelector((state: RootState) => state.map.points);
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[][]>([]);

  useEffect(() => {
    setInputValues(points.map((p) => `${p.lat}, ${p.lng}`));
    setSuggestions(points.map(() => []));
  }, [points]);

  const handleInputChange = async (index: number, value: string) => {
    const updatedInputs = [...inputValues];
    updatedInputs[index] = value;
    setInputValues(updatedInputs);

    if (isCoordinates(value)) {
      const [lat, lng] = value.split(",").map((v) => parseFloat(v.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        const updatedPoints = [...points];
        updatedPoints[index] = { lat, lng };
        dispatch(setPoints(updatedPoints));
        setSuggestions((prev) => {
          const newS = [...prev];
          newS[index] = [];
          return newS;
        });
      }
    } else if (value.length > 2) {
      const results = await fetchSuggestions(value);
      const newSuggestions = [...suggestions];
      newSuggestions[index] = results;
      setSuggestions(newSuggestions);
    } else {
      const newSuggestions = [...suggestions];
      newSuggestions[index] = [];
      setSuggestions(newSuggestions);
    }
  };

  const handleRemovePoint = (index: number) => {
    if (points.length > 1) {
      dispatch(removePoint(index));

      const updatedInputs = [...inputValues];
      updatedInputs.splice(index, 1);
      setInputValues(updatedInputs);

      const updatedSuggestions = [...suggestions];
      updatedSuggestions.splice(index, 1);
      setSuggestions(updatedSuggestions);
    }
  };

  const handleSelectSuggestion = (index: number, suggestion: any) => {
    if (!suggestion || !suggestion.lat || !suggestion.lon) return;
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const updatedPoints = [...points];
    updatedPoints[index] = { lat, lng };
    dispatch(setPoints(updatedPoints));

    const updatedInputs = [...inputValues];
    updatedInputs[index] = suggestion.display_name;
    setInputValues(updatedInputs);

    const newSuggestions = [...suggestions];
    newSuggestions[index] = [];
    setSuggestions(newSuggestions);
  };

  const addNewInputAfter = (index: number) => {
    const updatedPoints = [
      ...points.slice(0, index + 1),
      { lat: 0, lng: 0 },
      ...points.slice(index + 1),
    ];
    dispatch(setPoints(updatedPoints));

    const updatedInputs = [...inputValues];
    updatedInputs.splice(index + 1, 0, "");
    setInputValues(updatedInputs);

    const updatedSuggestions = [...suggestions];
    updatedSuggestions.splice(index + 1, 0, []);
    setSuggestions(updatedSuggestions);
  };

  useEffect(() => {
    if (points.length === 0) {
      dispatch(setPoints([{ lat: 50, lng: 30 }]));
    }
  }, [points.length, dispatch]);

  const total = points.reduce((sum, point, i, arr) => {
    if (i === 0) return 0;
    return sum + getDistanceKm(arr[i - 1], point);
  }, 0);

  return (
    <div className="mt-4 text-lg max-h-[60vh] overflow-y-scroll">
      <ul>
        {points.map((_, index) => (
          <div key={index} className="mb-4 relative">
            <PointItem
              index={index}
              addNewInputAfter={addNewInputAfter}
              handleInputChange={handleInputChange}
              handleRemovePoint={handleRemovePoint}
              inputValues={inputValues}
            />
            {suggestions[index] && suggestions[index].length > 0 && (
              <ul className="absolute bg-[#1a1a1a] border rounded-md w-full z-10 mt-1 shadow">
                {suggestions[index].map((sugg: any, i: number) => (
                  <SuggestionsItem
                    sugg={sugg}
                    i={i}
                    index={index}
                    handleSelectSuggestion={handleSelectSuggestion}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>

      <div className="mt-4">
        Distance: <span className="font-bold">{total.toFixed(2)}</span> km
        between <span className="font-bold">{points.length}</span> points 📌
      </div>
    </div>
  );
}
