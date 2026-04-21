"use client";

import { useState, useEffect } from "react";
import { HeartPulse, Activity, AlertTriangle } from "lucide-react";

export default function Health() {
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [result, setResult] = useState("");
  const [aqi, setAqi] = useState<number>(0);

  // 🌍 LOAD AQI FROM LOCALSTORAGE
  useEffect(() => {
    const stored = localStorage.getItem("current_aqi");
    if (stored) setAqi(Number(stored));
  }, []);

  // 🧠 AI LOGIC (IMPROVED)
  const predictHealth = () => {
    const ageNum = Number(age);

    if (!ageNum) {
      setResult("⚠️ Please enter valid age");
      return;
    }

    let risk = "Low";
    let advice = "";

    // 🔥 CORE LOGIC
    if (aqi > 150 || ageNum > 60 || disease.toLowerCase().includes("asthma")) {
      risk = "High";
      advice = "Avoid outdoor exposure, wear mask, use air purifier.";
    } 
    else if (aqi > 100 || ageNum > 40) {
      risk = "Moderate";
      advice = "Limit outdoor activities, stay hydrated.";
    } 
    else {
      risk = "Low";
      advice = "Air is manageable, but stay aware.";
    }

    const final = `${risk} Risk (AQI ${aqi}) — ${advice}`;
    setResult(final);

    // 🚨 SAVE ALERT
    let alerts = JSON.parse(localStorage.getItem("aqi_alerts") || "[]");

    if (!alerts.includes(final)) {
      alerts.push(final);
      localStorage.setItem("aqi_alerts", JSON.stringify(alerts));
    }
  };

  // 🎨 STYLE
  const getStyle = () => {
    if (result.includes("High"))
      return "bg-red-500/10 border-red-500/30 text-red-300";
    if (result.includes("Moderate"))
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
    return "bg-green-500/10 border-green-500/30 text-green-300";
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <HeartPulse /> Health Prediction
      </h1>

      {/* AQI DISPLAY */}
      <div className="bg-[#0b1220] p-4 rounded-xl border border-white/10">
        🌍 Current AQI: <span className="font-bold">{aqi || "N/A"}</span>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white/5 p-6 rounded-xl space-y-4 border border-white/10">

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-3 rounded bg-white/10 outline-none"
        />

        <input
          type="text"
          placeholder="Disease (e.g. asthma, heart)"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          className="w-full p-3 rounded bg-white/10 outline-none"
        />

        <button
          onClick={predictHealth}
          className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 rounded-xl font-semibold text-black"
        >
          Predict Health Risk
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className={`p-4 rounded-xl border flex gap-3 ${getStyle()}`}>
          <AlertTriangle />
          <div>
            <p className="font-semibold">{result}</p>

            <p className="text-xs text-white/50 mt-1">
              Based on AQI, age & health condition
            </p>
          </div>
        </div>
      )}

      {/* EXTRA HEALTH TIPS */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-white/70">
        💡 Tips:
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Wear mask if AQI &gt; 100</li>
          <li>Use indoor plants / purifier</li>
          <li>Avoid morning outdoor exercise in polluted cities</li>
        </ul>
      </div>

    </div>
  );
}