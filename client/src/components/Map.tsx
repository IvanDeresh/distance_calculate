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
import { Icon, LatLngExpression } from "leaflet";
import { RootState } from "../store/store";
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
  const points = useSelector((state: RootState) => state.map.points);
  const mapCenter: LatLngExpression = [52, 19];
  const customIcon = new Icon({
    iconUrl: "/assets/img/travel_15692756.png",
    iconSize: [25, 35],
    iconAnchor: [12.5, 35],
  });
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // english names
        // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        // attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'

        // noWrap={true} - no wrap and no repeat on map
      />
      <ClickHandler />

      {points.map((point: { lat: number; lng: number }, i: number) => (
        <Marker
          icon={customIcon}
          key={i}
          position={[point.lat, point.lng] as LatLngExpression}
        >
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
