"use client";

import { useEffect, useState } from "react";
import { HeartPulse, AlertTriangle } from "lucide-react";

const cities = [
  "Delhi","Mumbai","Bangalore","Chennai","Kolkata",
  "Hyderabad","Pune","Ahmedabad","Jaipur","Lucknow",
  "Bhopal","Indore","Nagpur","Patna","Gwalior"
];

export default function Health() {
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [aqi, setAqi] = useState<number | null>(null);
  const [city, setCity] = useState("Delhi");
  const [result, setResult] = useState("");
  const [advice, setAdvice] = useState("");

  // 🔥 AUTO LOAD AQI FROM DASHBOARD
  useEffect(() => {
    const savedAQI = localStorage.getItem("current_aqi");
    if (savedAQI) setAqi(Number(savedAQI));
  }, []);

  // 🔥 CHANGE CITY → FAKE AQI (until backend)
  const changeCity = (c: string) => {
    setCity(c);

    const fakeAQI = Math.floor(50 + Math.random() * 150);
    setAqi(fakeAQI);

    localStorage.setItem("current_aqi", String(fakeAQI));
  };

  // 🧠 HEALTH LOGIC
  const predict = () => {
    if (!aqi) return;

    let risk = "Low";
    let msg = "😊 Air is safe";
    let adv = "Enjoy outdoor activities.";

    if (aqi > 100) {
      risk = "Moderate";
      msg = "😷 Wear mask";
      adv = "Limit outdoor exposure.";
    }

    if (aqi > 150 || Number(age) > 50 || disease) {
      risk = "High";
      msg = "⚠️ Health risk";
      adv = "Avoid outdoor, use air purifier.";
    }

    const final = `Risk: ${risk} (AQI ${aqi}) → ${msg}`;
    setResult(final);
    setAdvice(adv);

    // 🔔 ALERT SAVE
    if (risk === "High") {
      const alerts = JSON.parse(localStorage.getItem("aqi_alerts") || "[]");
      alerts.push(`⚠️ ${city}: High health risk (AQI ${aqi})`);
      localStorage.setItem("aqi_alerts", JSON.stringify(alerts));
    }
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <HeartPulse /> Health Prediction
      </h1>

      {/* CITY SELECT */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <p className="text-sm text-white/60 mb-2">Select City</p>

        <select
          value={city}
          onChange={(e) => changeCity(e.target.value)}
          className="w-full p-2 bg-white/10 rounded"
        >
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* AQI DISPLAY */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <p className="text-sm text-white/60">Current AQI</p>
        <h2 className="text-3xl font-bold">
          {aqi || "Loading..."}
        </h2>
      </div>

      {/* INPUT */}
      <div className="bg-white/5 p-6 rounded-xl space-y-4 border border-white/10">

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-3 rounded bg-white/10"
        />

        <input
          placeholder="Disease (optional e.g. asthma)"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          className="w-full p-3 rounded bg-white/10"
        />

        <button
          onClick={predict}
          className="w-full py-3 bg-green-500 rounded font-semibold"
        >
          Predict Health Risk
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <p className="font-semibold">{result}</p>
          <p className="text-sm text-white/70 mt-1">{advice}</p>
        </div>
      )}

      {/* EXTRA ADVISORY */}
      {aqi && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex gap-2">
          <AlertTriangle className="text-red-400" />
          AQI {aqi} detected — sensitive groups should take precautions.
        </div>
      )}
    </div>
  );
}