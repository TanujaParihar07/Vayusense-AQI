"use client";

import { useEffect, useState } from "react";
import { AQIMap } from "@/components/map/AQIMap";

export default function MapPage() {
  const [lat, setLat] = useState(28.61);
  const [lon, setLon] = useState(77.20);

  // 📍 User location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      () => {
        console.log("Location denied, using default");
      }
    );
  }, []);

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">🌍 Live AQI Map</h1>

      <AQIMap userLat={lat} userLon={lon} />
    </div>
  );
}