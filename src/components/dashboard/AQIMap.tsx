"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

import { triggerMapAQI } from "@/lib/events";

// 🔥 AUTO ZOOM
const FlyToCity = ({ lat, lon }: any) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], 8, { duration: 1.2 });
    }
  }, [lat, lon]);

  return null;
};

// 🔥 RESIZE FIX
const ResizeFix = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);

  return null;
};

// 🎨 AQI COLOR
const getColor = (aqi: number) => {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 200) return "#f97316";
  return "#ef4444";
};

// 🔥 SIZE
const getRadius = (aqi: number) => {
  return Math.max(10, Math.min(aqi / 5, 30));
};

export default function AQIMap({ data = [], activeCity }: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-2xl text-center text-muted-foreground">
        Loading map...
      </div>
    );
  }

  const focused =
    data.find((c: any) => c.city === activeCity) || data[0];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-elevated border border-border">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          🌍 Live AQI Map
        </h3>

        {/* LEGEND */}
        <div className="hidden md:flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Unhealthy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Hazardous
          </span>
        </div>
      </div>

      {/* MAP */}
      <div className="h-[420px] rounded-2xl overflow-hidden border border-border">
        <MapContainer
          center={[focused.lat, focused.lon]}
          zoom={5}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <ResizeFix />
          <FlyToCity lat={focused.lat} lon={focused.lon} />

          {/* 🌑 DARK TILE */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {data.map((c: any, i: number) => {
            if (!c.lat || !c.lon) return null;

            const color = getColor(c.aqi || 0);
            const radius = getRadius(c.aqi || 0);
            const isActive = c.city === activeCity;

            return (
              <CircleMarker
                key={i}
                center={[c.lat, c.lon]}
                radius={isActive ? radius + 5 : radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: isActive ? 3 : 1.5,
                }}

                // ✅ FIXED (NO STYLE ERROR)
                className="cursor-pointer"

                // 🔥 UX + INTERACTION
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 4 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({
                      weight: isActive ? 3 : 1.5,
                    });
                  },
                  click: () => {
                    console.log("Clicked:", c.city, c.aqi);

                    // 🔥 CHATBOT TRIGGER
                    triggerMapAQI(c.city, c.aqi);
                  },
                }}
              >
                {/* 🔥 GLOW EFFECT */}
                <CircleMarker
                  center={[c.lat, c.lon]}
                  radius={radius * 1.8}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.15,
                    weight: 0,
                  }}
                />

                {/* 🔥 PULSE EFFECT */}
                <CircleMarker
                  center={[c.lat, c.lon]}
                  radius={radius * 2.5}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.05,
                    weight: 0,
                  }}
                />

                {/* TOOLTIP */}
                <Tooltip direction="top" offset={[0, -10]}>
                  <div className="text-center text-xs">
                    <strong>{c.city}</strong>
                    <br />
                    <span style={{ color }}>
                      AQI: {Math.round(c.aqi || 0)}
                    </span>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}