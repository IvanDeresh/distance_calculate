import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { addPoint } from "../store/features/mapSlice";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

const fetchRoute = async (points: { lat: number; lng: number }[]) => {
  const coordinates = points
    .map((point) => `${point.lng},${point.lat}`)
    .join(";");
  const response = await fetch(
    `http://localhost:3000/getRoute?coordinates=${coordinates}`
  );
  const data = await response.json();
  console.log("API Response:", data);
  if (data.routes && data.routes[0]) {
    return data.routes[0].geometry.coordinates;
  } else {
    console.error("Маршрут не знайдено");
    return [];
  }
};

function ClickHandler() {
  const dispatch = useDispatch();
  useMapEvents({
    click(e) {
      dispatch(addPoint({ lat: e.latlng.lat, lng: e.latlng.lng }));
    },
  });
  return null;
}

export default function MapComponent() {
  const points = useSelector((state: RootState) => state.map.points);
  const [route, setRoute] = useState<any[]>([]);

  useEffect(() => {
    const getRoute = async () => {
      if (points.length > 1) {
        const fetchedRoute = await fetchRoute(points);
        setRoute(fetchedRoute);
      }
    };
    getRoute();
  }, [points]);

  const mapCenter: LatLngExpression = [52, 19];

  return (
    <MapContainer
      center={mapCenter}
      zoom={5}
      className="max-h-[90vh] w-[95vw] rounded-2xl"
      style={{ height: "90vh", width: "95vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      <ClickHandler />

      {points.map((point, i) => (
        <Marker key={i} position={[point.lat, point.lng] as LatLngExpression} />
      ))}

      {points.map((point, index) => {
        if (index < points.length - 1) {
          return (
            <Polyline
              key={index}
              positions={
                [
                  [point.lat, point.lng],
                  [points[index + 1].lat, points[index + 1].lng],
                ] as LatLngExpression[]
              }
              pathOptions={{ color: "black", weight: 2, opacity: 0.5 }}
            />
          );
        }
        return null;
      })}

      {route.length > 0 && (
        <Polyline
          positions={
            route.map((coord: any) => [
              coord[1],
              coord[0],
            ]) as LatLngExpression[]
          }
          pathOptions={{ color: "blue", weight: 4 }}
        />
      )}
    </MapContainer>
  );
}
