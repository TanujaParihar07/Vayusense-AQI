"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface AlertItem {
  text: string;
  time: string;
  type: "danger" | "warning" | "safe";
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // 🔥 FORMAT ALERT
  const formatAlert = (msg: string): AlertItem => ({
    text: msg,
    time: new Date().toLocaleTimeString(),
    type: msg.includes("High")
      ? "danger"
      : msg.includes("Moderate")
      ? "warning"
      : "safe",
  });

  // 🔥 LOAD ALERTS
  const loadAlerts = () => {
    const saved = JSON.parse(localStorage.getItem("aqi_alerts") || "[]");
    setAlerts(saved.map((a: string) => formatAlert(a)));
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // 🔥 REAL-TIME AQI WATCH (every 10 sec)
  useEffect(() => {
    const interval = setInterval(() => {
      const aqi = Number(localStorage.getItem("current_aqi") || 0);
      if (!aqi) return;

      let msg = "";

      if (aqi > 150) msg = `⚠️ High Pollution Alert (AQI ${aqi})`;
      else if (aqi > 100) msg = `😷 Moderate Air Quality (AQI ${aqi})`;
      else msg = `✅ Air is Safe (AQI ${aqi})`;

      let existing = JSON.parse(localStorage.getItem("aqi_alerts") || "[]");

      // ❌ avoid duplicates
      if (!existing.includes(msg)) {
        existing.push(msg);
        localStorage.setItem("aqi_alerts", JSON.stringify(existing));

        // 🔔 PUSH NOTIFICATION
        if (Notification.permission === "granted") {
          new Notification("VayuSense Alert 🚨", {
            body: msg,
          });
        }

        loadAlerts();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 🔔 ASK PERMISSION
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ❌ CLEAR
  const clearAlerts = () => {
    localStorage.removeItem("aqi_alerts");
    setAlerts([]);
  };

  // 🎨 STYLE
  const getStyle = (type: string) => {
    if (type === "danger")
      return "bg-red-500/10 border-red-500/30 text-red-300";
    if (type === "warning")
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
    return "bg-green-500/10 border-green-500/30 text-green-300";
  };

  const getIcon = (type: string) => {
    if (type === "danger") return <AlertTriangle />;
    if (type === "warning") return <Clock />;
    return <CheckCircle />;
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell /> Alerts Center
        </h1>

        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="px-4 py-2 bg-red-500 rounded-lg text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY */}
      {alerts.length === 0 ? (
        <div className="text-center text-white/50 mt-20">
          🎉 No alerts — Air quality is good!
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex justify-between items-center ${getStyle(
                a.type
              )}`}
            >
              <div className="flex items-center gap-3">
                {getIcon(a.type)}
                <span>{a.text}</span>
              </div>

              <span className="text-xs text-white/50">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* INFO */}
      <div className="text-xs text-white/40 mt-6">
        Alerts are generated automatically based on AQI changes in real-time.
      </div>
    </div>
  );
}