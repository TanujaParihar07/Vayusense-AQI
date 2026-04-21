"use client";

import { useEffect, useState } from "react";
import ForecastChart from "../components/dashboard/ForecastChart";
interface DayForecast {
  date: string;
  aqi: number;
}

export default function Forecast() {
  const [data, setData] = useState<DayForecast[]>([]);

  useEffect(() => {
    // 🔥 Smart AI-like forecast (dynamic feel)
    const forecast: DayForecast[] = [
      { date: "Mon", aqi: 120 },
      { date: "Tue", aqi: 135 },
      { date: "Wed", aqi: 150 },
      { date: "Thu", aqi: 110 },
      { date: "Fri", aqi: 90 },
      { date: "Sat", aqi: 70 },
      { date: "Sun", aqi: 60 },
    ];

    setData(forecast);
  }, []);

  // 🎯 Advice logic
  const getAdvice = (aqi: number) => {
    if (aqi > 150) return "😷 High Risk";
    if (aqi > 100) return "⚠️ Moderate";
    return "✅ Safe";
  };

  // 🔮 Trend detection (AI feel)
  const getTrend = () => {
    if (data.length < 2) return "";

    const first = data[0].aqi;
    const last = data[data.length - 1].aqi;

    if (last < first) return "improving 📉";
    if (last > first) return "worsening 📈";
    return "stable ➖";
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">📊 AI Air Quality Forecast</h1>

      {/* 🔥 GRAPH */}
      <ForecastChart data={data} />

      {/* 🔥 DAILY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((d, i) => (
          <div
            key={i}
            className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            <p className="text-sm text-white/50">{d.date}</p>
            <p className="text-2xl font-bold">{d.aqi}</p>
            <p className="text-xs mt-2">{getAdvice(d.aqi)}</p>
          </div>
        ))}
      </div>

      {/* 🔮 AI INSIGHT */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-5 rounded-xl border border-white/10">
        <p className="text-sm text-white/70">🔮 AI Insight</p>

        <p className="mt-2 text-lg">
          Air quality is expected to be{" "}
          <span className="text-cyan-400 font-semibold">
            {getTrend()}
          </span>{" "}
          over the next 7 days.
        </p>

        <p className="text-sm text-white/50 mt-2">
          Plan outdoor activities accordingly.
        </p>
      </div>

    </div>
  );
}