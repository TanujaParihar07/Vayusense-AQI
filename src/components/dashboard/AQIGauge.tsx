import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  aqi: number;
  city: string;
  dominant?: string;
}

// 🎯 AQI CATEGORY + COLOR
const getCategory = (aqi: number) => {
  if (aqi <= 50) return { label: "Good", color: "#22c55e" };
  if (aqi <= 100) return { label: "Moderate", color: "#eab308" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#f97316" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#ef4444" };
  return { label: "Hazardous", color: "#7f1d1d" };
};

export const AQIGauge = ({ aqi, city, dominant = "PM2.5" }: Props) => {
  const [val, setVal] = useState(0);
  const cat = getCategory(aqi || 0);

  // 🔥 Smooth animation (stable easing)
  useEffect(() => {
    let current = 0;
    const duration = 1000;
    const steps = 60;
    const increment = (aqi - current) / steps;

    let count = 0;

    const interval = setInterval(() => {
      current += increment;
      count++;

      if (count >= steps) {
        setVal(Math.round(aqi));
        clearInterval(interval);
      } else {
        setVal(Math.max(0, Math.round(current)));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [aqi]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // 🔥 scale up to 500 AQI (realistic)
  const safeAQI = Math.min(val, 500);
  const progress = safeAQI / 500;

  const offset = circumference - progress * circumference;

  return (
    <div className="bg-[#0b1220] p-6 rounded-3xl border border-[#1f2937] flex items-center justify-between shadow-xl">

      {/* LEFT INFO */}
      <div>
        <div className="flex items-center gap-2 text-xs text-cyan-400">
          <Sparkles size={14} />
          AI Prediction
        </div>

        <h2 className="text-2xl font-bold mt-2">{city}</h2>

        <p
          className="font-semibold mt-1"
          style={{ color: cat.color }}
        >
          {cat.label}
        </p>

        <div className="mt-4 text-sm text-gray-400">
          Dominant: {dominant}
        </div>
      </div>

      {/* 🔥 GAUGE */}
      <div className="relative w-36 h-36 flex items-center justify-center">

        {/* Glow Effect */}
        <div
          className="absolute w-full h-full rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: cat.color }}
        />

        <svg className="rotate-[-90deg] w-full h-full">
          
          {/* Background */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#1f2937"
            strokeWidth="10"
            fill="none"
          />

          {/* Gradient */}
          <defs>
            <linearGradient id="aqiGradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Progress */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#aqiGradient)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease",
            }}
          />
        </svg>

        {/* CENTER VALUE */}
        <div className="absolute text-center">
          <div className="text-3xl font-bold">{val}</div>
          <div className="text-xs text-gray-400">AQI</div>
        </div>
      </div>
    </div>
  );
};