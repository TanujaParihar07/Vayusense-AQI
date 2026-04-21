"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { getAllCitiesAQI, CityMarker } from "@/services/api";
import "leaflet.heat";
import { triggerMapAQI } from "@/lib/events";

// marker fix
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// 🔁 recenter
const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 6);
  }, [lat, lon, map]);
  return null;
};

// 🎨 color
const getMarkerColor = (aqi: number) => {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  return "#7f1d1d";
};

// 🧠 AQI Category
const getCategory = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

// 🔥 HEATMAP
const HeatLayer = ({ data }: { data: CityMarker[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!data.length) return;

    const points = data.map((c) => [
      c.lat,
      c.lon,
      Math.min(c.aqi / 300, 1),
    ]);

    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [data, map]);

  return null;
};

export const AQIMap = ({
  userLat,
  userLon,
}: {
  userLat: number;
  userLon: number;
}) => {
  const [cities, setCities] = useState<CityMarker[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getAllCitiesAQI();
        setCities(data);
      } catch (e) {
        console.error("API failed, using fallback");
        setCities([
          { city: "Delhi", lat: 28.6, lon: 77.2, aqi: 120, category: "Unhealthy" },
          { city: "Bhopal", lat: 23.25, lon: 77.41, aqi: 54, category: "Moderate" },
          { city: "Gwalior", lat: 26.21, lon: 78.17, aqi: 64, category: "Moderate" },
        ]);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">

      {/* 🔥 LEGEND */}
      <div className="absolute top-3 right-3 z-[1000] bg-black/70 px-3 py-2 rounded-xl text-xs space-y-1">
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full"/> Good
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"/> Moderate
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 bg-orange-500 rounded-full"/> Unhealthy
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full"/> Hazardous
        </div>
      </div>

      <MapContainer
        center={[userLat, userLon]}
        zoom={6}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        <RecenterMap lat={userLat} lon={userLon} />

        {/* 🔥 HEATMAP */}
        <HeatLayer data={cities} />

        {/* 📍 MARKERS */}
        {cities.map((city, idx) => (
          <Marker
            key={idx}
            position={[city.lat, city.lon]}
            icon={L.divIcon({
              className: "",
              html: `
                <div style="
                  background:${getMarkerColor(city.aqi)};
                  width:34px;height:34px;
                  border-radius:50%;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:white;
                  font-weight:bold;
                  border:2px solid white;
                  box-shadow:0 0 12px ${getMarkerColor(city.aqi)};
                  cursor:pointer;
                ">
                  ${city.aqi}
                </div>
              `,
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            })}
            eventHandlers={{
              click: () => {
                // 🔥 chatbot trigger
                triggerMapAQI(city.city, city.aqi);

                // 🔥 save for alerts + health
                localStorage.setItem("current_aqi", String(city.aqi));
              },
            }}
          >
            <Popup>
              <strong>{city.city}</strong>
              <br />
              AQI: {city.aqi}
              <br />
              Status: {getCategory(city.aqi)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};