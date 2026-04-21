"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  getForecastByCoords,
  AQIResponse,
  getAllCitiesAQI,
} from "@/services/api";

import ForecastChart from "@/components/dashboard/ForecastChart";
import { PollutantCards } from "@/components/dashboard/PollutantCards";
import AQIMap from "@/components/dashboard/AQIMap";

import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  ShieldAlert,
  Activity,
} from "lucide-react";

const MAJOR_CITIES = [
  "Delhi","Mumbai","Bangalore","Kolkata","Chennai",
  "Hyderabad","Jaipur","Lucknow","Bhopal","Pune",
  "Ahmedabad","Indore","Patna","Chandigarh","Gwalior"
];

const cityCoords: any = {
  Delhi: { lat: 28.61, lon: 77.2 },
  Mumbai: { lat: 19.07, lon: 72.87 },
  Bangalore: { lat: 12.97, lon: 77.59 },
  Chennai: { lat: 13.08, lon: 80.27 },
  Kolkata: { lat: 22.57, lon: 88.36 },
  Hyderabad: { lat: 17.38, lon: 78.48 },
  Pune: { lat: 18.52, lon: 73.85 },
  Ahmedabad: { lat: 23.02, lon: 72.57 },
  Jaipur: { lat: 26.91, lon: 75.79 },
  Lucknow: { lat: 26.85, lon: 80.95 },
  Bhopal: { lat: 23.25, lon: 77.41 },
  Indore: { lat: 22.72, lon: 75.86 },
  Patna: { lat: 25.59, lon: 85.13 },
  Chandigarh: { lat: 30.73, lon: 76.77 },
  Gwalior: { lat: 26.21, lon: 78.17 },
};

export default function Prediction() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [data, setData] = useState<AQIResponse | null>(null);
  const [mapData, setMapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { lat, lon, city: geoCity } = useGeolocation();

  // 🔥 FETCH AQI
  const fetchPrediction = async (city: string) => {
    try {
      setLoading(true);

      let res;

      if (city === "current" && lat && lon) {
        res = await getForecastByCoords(
          lat,
          lon,
          geoCity || "Current Location"
        );
      } else {
        const coords = cityCoords[city];
        if (!coords) return;

        res = await getForecastByCoords(
          coords.lat,
          coords.lon,
          city
        );
      }

      if (res) {
        setData(res);

        // ✅ store for alerts + health
        localStorage.setItem("current_aqi", String(res.aqi));
      }

    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOAD MAP DATA
  useEffect(() => {
    getAllCitiesAQI()
      .then(setMapData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchPrediction(selectedCity);
  }, [selectedCity, lat, lon]);

  const getStatus = (aqi: number) => {
    if (aqi <= 50) return "😊 Good";
    if (aqi <= 100) return "🙂 Moderate";
    if (aqi <= 200) return "😷 Unhealthy";
    return "☠️ Hazardous";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-white">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          City Air Quality Prediction
        </h1>
        <p className="text-white/50 text-sm">
          Select a city or use your location
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 justify-center">

        {/* ✅ FIXED DROPDOWN (UI ISSUE SOLVED) */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-white outline-none appearance-none"
        >
          {MAJOR_CITIES.map((c) => (
            <option key={c} value={c} className="bg-[#020617] text-white">
              {c}
            </option>
          ))}
        </select>

        {/* LOCATION BUTTON */}
        <button
          onClick={() => setSelectedCity("current")}
          className="flex items-center gap-2 px-4 py-3 bg-cyan-400 text-black rounded-xl"
        >
          <MapPin size={16} />
          Use My Location
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center gap-2 text-white/50">
          <Activity className="animate-spin" />
          Loading prediction...
        </div>
      )}

      {/* MAIN */}
      {data && (
        <>
          {/* AQI CARD */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-3">
            <h2 className="text-xl font-semibold">{data.city}</h2>

            <div className="text-6xl font-bold">
              {data.aqi}
            </div>

            <div className="text-lg">
              {getStatus(data.aqi)}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-red-400">
              <ShieldAlert className="w-4 h-4" />
              {data.health_advice}
            </div>
          </div>

          {/* WEATHER */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 p-4 rounded-xl">
              <Thermometer className="mx-auto mb-1 text-orange-400" />
              <p className="text-lg">{data.weather?.temp}°C</p>
              <span className="text-xs text-white/50">Temperature</span>
            </div>

            <div className="bg-white/5 p-4 rounded-xl">
              <Droplets className="mx-auto mb-1 text-blue-400" />
              <p className="text-lg">{data.weather?.humidity}%</p>
              <span className="text-xs text-white/50">Humidity</span>
            </div>

            <div className="bg-white/5 p-4 rounded-xl">
              <Wind className="mx-auto mb-1 text-green-400" />
              <p className="text-lg">{data.weather?.wind} km/h</p>
              <span className="text-xs text-white/50">Wind</span>
            </div>
          </div>

          {/* POLLUTANTS */}
          <PollutantCards data={data} />

          {/* FORECAST */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              7-Day AQI Forecast
            </h3>
            <ForecastChart data={data.forecast || []} />
          </div>

          {/* MAP */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Live AQI Map
            </h3>
            <AQIMap data={mapData} activeCity={data.city} />
          </div>
        </>
      )}
    </div>
  );
}