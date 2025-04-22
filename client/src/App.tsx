import { useEffect } from "react";
import MapComponent from "./components/Map";
import DistanceInfo from "./components/DistanceInfo";
import { useDispatch } from "react-redux";
import { clearPoints, setPoints } from "./store/features/mapSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "./store/store";

function parseUrlPath(path: string): { lat: number; lng: number }[] {
  return path
    .split("/")
    .filter(Boolean)
    .map((p) => {
      if (p.includes(",")) {
        const [lat, lng] = p.split(",");
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      }
      return null;
    })
    .filter((p): p is { lat: number; lng: number } => p !== null);
}

function buildUrl(points: { lat: number; lng: number }[]) {
  return "/" + points.map((p) => `${p.lat},${p.lng}`).join("/");
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const points = parseUrlPath(location.pathname);
    if (points.length > 0) {
      dispatch(setPoints(points));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const updateUrl = () => {
      const state = store.getState();
      const path = buildUrl(state.map.points);
      navigate(path, { replace: true });
    };
    const unsubscribe = store.subscribe(updateUrl);
    return unsubscribe;
  }, [navigate]);

  return (
    <div className="p-6 relative min-w-full flex">
      <div className="absolute z-100 bg-[#242424] top-10 left-20 p-10 rounded-lg">
        <h2 className="text-3xl font-bold mb-4 ">Distance Tool 🗺️⁀જ✈︎</h2>
        <DistanceInfo />
        <div className="mt-2">
          <button onClick={() => dispatch(clearPoints())}>Clear All</button>
        </div>
      </div>
      <div className="z-10">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
