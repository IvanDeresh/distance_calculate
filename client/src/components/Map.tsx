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
import { useEffect, useState } from "react";
import { getRoadRoute } from "../utils/api";

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
  const [geoJsonCoords, setGeoJsonCoords] = useState<LatLngExpression[]>([]);
  const customIcon = new Icon({
    iconUrl: "/assets/img/travel_15692756.png",
    iconSize: [25, 35],
    iconAnchor: [12.5, 35],
  });

  useEffect(() => {
    const fetchRoute = async () => {
      if (points.length >= 2) {
        let allCoords: LatLngExpression[] = [];
        for (let i = 0; i < points.length - 1; i++) {
          const route = await getRoadRoute(points[i], points[i + 1]);
          const coords = route.features[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as LatLngExpression
          );
          allCoords = [...allCoords, ...coords];
        }
        setGeoJsonCoords(allCoords);
      } else {
        setGeoJsonCoords([]);
      }
    };

    fetchRoute();
  }, [points]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={5}
      className="max-h-[90vh] map-wrapper max-ms:max-h-[65vh] w-[96.5vw] max-sm:w-[90vw] rounded-2xl"
      style={{ height: "90vh", width: "96.5vw" }}
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
      />

      <ClickHandler />

      {points.map((point, i) => (
        <Marker icon={customIcon} key={i} position={[point.lat, point.lng]}>
          <Popup>{`${point.lat}, ${point.lng}`}</Popup>
        </Marker>
      ))}

      {points.map((point, index) => {
        if (index < points.length - 1) {
          return (
            <Polyline
              key={`line-${index}`}
              positions={[
                [point.lat, point.lng],
                [points[index + 1].lat, points[index + 1].lng],
              ]}
              pathOptions={{ color: "black", weight: 2, opacity: 0.7 }}
            />
          );
        }
        return null;
      })}

      {geoJsonCoords.length > 0 && (
        <Polyline
          positions={geoJsonCoords}
          pathOptions={{ color: "blue", weight: 2, opacity: 0.7 }}
        />
      )}
    </MapContainer>
  );
}
