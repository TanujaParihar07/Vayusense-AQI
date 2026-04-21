import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  aqi: number;
  city: string;
}

const getAlert = (aqi: number) => {
  if (aqi <= 100) return null;

  if (aqi <= 200)
    return {
      level: "warning",
      message: "Air quality is moderate. Sensitive groups take care.",
    };

  if (aqi <= 300)
    return {
      level: "danger",
      message: "Unhealthy air. Wear mask and limit outdoor activity.",
    };

  return {
    level: "critical",
    message: "Hazardous air! Avoid going outside.",
  };
};

export const AlertBanner = ({ aqi, city }: Props) => {
  const [dismissed, setDismissed] = useState(false);

  const alert = getAlert(aqi);

  // ✅ persist dismiss
  useEffect(() => {
    const saved = localStorage.getItem("alert-dismissed");
    if (saved === "true") setDismissed(true);
  }, []);

  if (!alert || dismissed) return null;

  const getStyle = () => {
    if (alert.level === "warning")
      return "border-yellow-400/40 bg-yellow-400/10 text-yellow-400";
    if (alert.level === "danger")
      return "border-orange-400/40 bg-orange-400/10 text-orange-400";
    return "border-red-500/40 bg-red-500/10 text-red-500";
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${getStyle()} animate-slide-down`}>

      {/* Glow */}
      <div className="absolute inset-0 opacity-30 blur-xl bg-current" />

      {/* Content */}
      <div className="relative px-4 py-3 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-current/20 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            {city} AQI: {aqi}
          </p>

          <p className="text-xs text-muted-foreground">
            {alert.message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem("alert-dismissed", "true");
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};