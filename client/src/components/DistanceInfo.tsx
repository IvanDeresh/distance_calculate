import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setPoints, removePoint } from "../store/features/mapSlice";
import { JSX, useEffect, useState } from "react";
import SuggestionsItem from "./SuggestionsItem";
import PointItem from "./PointItem";
import { fetchSuggestions, isCoordinates } from "../utils/api";
import { Suggestion } from "../types/util";
import SuggestionsPortal from "./SuggestionsPortal";

export default function DistanceInfo({
  inputRefs,
}: {
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) {
  const points = useSelector((state: RootState) => state.map.points);
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [portalData, setPortalData] = useState<{
    visible: boolean;
    top: number;
    left: number;
    width: number;
    suggestions: JSX.Element[];
  }>({
    visible: false,
    top: 0,
    left: 0,
    width: 0,
    suggestions: [],
  });

  useEffect(() => {
    setInputValues(points.map((p) => `${p.lat}, ${p.lng}`));
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
        setPortalData((prev) => ({ ...prev, visible: false }));
      }
    } else if (value.length > 2) {
      const results = await fetchSuggestions(value);
      const rect = inputRefs.current[index]?.getBoundingClientRect();
      if (rect) {
        const suggestionsJSX = results.map((sugg, i) => (
          <SuggestionsItem
            key={i}
            sugg={sugg}
            i={i}
            index={index}
            handleSelectSuggestion={handleSelectSuggestion}
          />
        ));

        setPortalData({
          visible: true,
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          suggestions: suggestionsJSX,
        });
      }
    } else {
      setPortalData((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleRemovePoint = (index: number) => {
    if (points.length > 1) {
      dispatch(removePoint(index));
      const updatedInputs = [...inputValues];
      updatedInputs.splice(index, 1);
      setInputValues(updatedInputs);
      setPortalData((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleSelectSuggestion = (index: number, suggestion: Suggestion) => {
    if (!suggestion || !suggestion.lat || !suggestion.lon) return;
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const updatedPoints = [...points];
    updatedPoints[index] = { lat, lng };
    dispatch(setPoints(updatedPoints));

    const updatedInputs = [...inputValues];
    updatedInputs[index] = suggestion.display_name;
    setInputValues(updatedInputs);

    setPortalData((prev) => ({ ...prev, visible: false }));
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
  };

  useEffect(() => {
    if (points.length === 0) {
      dispatch(setPoints([{ lat: 50, lng: 30 }]));
    }
  }, [points.length, dispatch]);

  return (
    <>
      <div className="mt-4 text-lg max-sm:max-h-[25vh] max-h-[60vh] overflow-y-scroll">
        <ul>
          {points.map((_, index) => (
            <div key={index} className="mb-4 relative">
              <PointItem
                index={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                addNewInputAfter={addNewInputAfter}
                handleInputChange={handleInputChange}
                handleRemovePoint={handleRemovePoint}
                inputValues={inputValues}
              />
            </div>
          ))}
        </ul>
      </div>
      <SuggestionsPortal {...portalData} />
    </>
  );
}
