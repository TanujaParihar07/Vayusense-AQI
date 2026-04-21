"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getForecastByCoords } from "@/services/api";

import ForecastChart from "@/components/dashboard/ForecastChart";
import { PollutantCards } from "@/components/dashboard/PollutantCards";
import { AIChatbot } from "@/components/chatbot/AIChatbot";
import { UserMenu } from "@/components/UserMenu";

import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  AlertTriangle,
  Bell,
  Sun,
  Moon,
} from "lucide-react";

import {
  requestNotificationPermission,
  sendNotification,
} from "@/utils/notifications";

const AQIMap = lazy(() => import("@/components/dashboard/AQIMap"));

export default function Dashboard() {
  const navigate = useNavigate();

  const { lat, lon, city, loading: geoLoading } = useGeolocation();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  // ✅ MAP DATA (IMPORTANT)
  const mapData = [
    { city: "Delhi", aqi: 180, lat: 28.61, lon: 77.23 },
    { city: "Mumbai", aqi: 95, lat: 19.07, lon: 72.87 },
    { city: "Bangalore", aqi: 70, lat: 12.97, lon: 77.59 },
    { city: "Gwalior", aqi: data?.aqi || 120, lat: 26.22, lon: 78.17 },
    { city: "Bhopal", aqi: 85, lat: 23.25, lon: 77.41 },
  ];

  // 🔥 DATA FETCH
  useEffect(() => {
    requestNotificationPermission();

    const fetchData = async () => {
      if (!lat || !lon) return;

      try {
        const res = await getForecastByCoords(
          lat,
          lon,
          city || "Current Location"
        );

        if (res) {
          setData(res);

          localStorage.setItem("current_aqi", String(res.aqi));

          // 🔔 ALERT
          if (res.aqi > 100) {
            const msg = `⚠️ ${res.city} AQI is ${res.aqi}`;

            setNotifications((prev) => [msg, ...prev]);

            const old = JSON.parse(localStorage.getItem("aqi_alerts") || "[]");

            if (!old.includes(msg)) {
              localStorage.setItem(
                "aqi_alerts",
                JSON.stringify([msg, ...old])
              );
            }

            sendNotification("Air Quality Alert", msg);
          }
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!geoLoading) fetchData();

    const timer = setTimeout(() => setShowMap(true), 500);
    return () => clearTimeout(timer);
  }, [lat, lon, geoLoading]);

  // 🎨 STATUS
  const getStatus = (aqi: number) => {
    if (aqi <= 50) return "😊 Good";
    if (aqi <= 100) return "🙂 Moderate";
    if (aqi <= 200) return "😷 Unhealthy";
    return "☠️ Hazardous";
  };

  const getColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-400";
    if (aqi <= 100) return "text-yellow-400";
    if (aqi <= 200) return "text-orange-400";
    return "text-red-500";
  };

  const getHealthAdvice = (aqi: number) => {
    if (aqi <= 50) return "😊 Safe for outdoor activities.";
    if (aqi <= 100) return "🙂 Sensitive people avoid long exposure.";
    if (aqi <= 200) return "😷 Wear mask. Avoid outdoor.";
    return "☠️ Stay indoors. Use air purifier.";
  };

  // ⏳ LOADING
  if (loading || geoLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white space-y-4">
        <Activity className="animate-spin w-10 h-10 text-blue-500" />
        <p className="text-white/50">Loading AQI Dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        Failed to load data
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-white bg-[#020617]">

      {/* NAVBAR */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🌿 VayuSense</h1>

        <div className="flex items-center gap-4">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-white/10 rounded-lg"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>

          <div
            onClick={() => navigate("/alerts")}
            className="relative cursor-pointer"
          >
            <Bell />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>

          <UserMenu />
        </div>
      </div>

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <MapPin className="w-4 h-4" />
          {data.city}
        </div>

        <h2 className="text-3xl font-bold">Air Quality Dashboard</h2>
      </div>

      {/* ALERT */}
      <div className="p-3 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-2">
        <AlertTriangle />
        AQI is {data.aqi} — {getStatus(data.aqi)}
      </div>

      {/* AQI + FORECAST */}
      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-[#0b1220] p-6 rounded-2xl text-center">
          <div className={`text-6xl font-bold ${getColor(data.aqi)}`}>
            {data.aqi}
          </div>

          <p>{getStatus(data.aqi)}</p>

          <div className="flex justify-around mt-6 text-sm">
            <div><Thermometer /> {data.weather?.temp}°C</div>
            <div><Droplets /> {data.weather?.humidity}%</div>
            <div><Wind /> {data.weather?.wind} km/h</div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ForecastChart data={data.forecast || []} />
        </div>
      </div>

      {/* HEALTH */}
      <div className="bg-[#0b1220] p-4 rounded-xl text-center">
        {getHealthAdvice(data.aqi)}
      </div>

      {/* POLLUTANTS */}
      <PollutantCards data={data} />

      {/* ✅ MAP FIXED */}
      {showMap && (
        <Suspense fallback={<p>Loading Map...</p>}>
          <AQIMap data={mapData} activeCity={data.city} />
        </Suspense>
      )}

      {/* CHATBOT */}
      <AIChatbot currentAQI={data.aqi} />

    </div>
  );
}