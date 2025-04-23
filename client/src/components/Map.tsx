import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { addPoint } from "../store/features/mapSlice";
import { LatLngExpression } from "leaflet";

function normalizeLng(lng: number) {
  return ((((lng + 180) % 360) + 360) % 360) - 180;
}

function ClickHandler() {
  const dispatch = useDispatch();
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = normalizeLng(e.latlng.lng);
      dispatch(addPoint({ lat, lng }));
    },
  });
  return null;
}

export default function MapComponent() {
  const points = useSelector((state: any) => state.map.points);
  const mapCenter: LatLngExpression = [52, 19];

  return (
    <MapContainer
      center={mapCenter}
      zoom={5}
      className="max-h-[90vh] map-wrapper  max-ms:max-h-[65vh] w-[95vw] max-sm:w-[90vw] rounded-2xl"
      style={{ height: "90vh", width: "95vw" }}
      maxZoom={25}
      minZoom={2}
      maxBounds={[
        [90, -180],
        [-90, 180],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
        // noWrap={true}
      />
      <ClickHandler />

      {points.map((point: { lat: number; lng: number }, i: number) => (
        <Marker key={i} position={[point.lat, point.lng] as LatLngExpression}>
          <Popup>{`${point.lat}, ${point.lng}`}</Popup>
        </Marker>
      ))}

      {points.map((point: { lat: number; lng: number }, index: number) => {
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
    </MapContainer>
  );
}
