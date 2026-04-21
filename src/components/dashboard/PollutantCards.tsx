import { Wind, Droplets, Flame, Cloud, Sun, Zap } from "lucide-react";

// ICON MAP
const iconMap: Record<string, any> = {
  pm2_5: Droplets,
  pm10: Wind,
  co: Flame,
  no2: Cloud,
  o3: Sun,
  so2: Zap,
};

// SEVERITY
const getSeverity = (value: number) => {
  if (value <= 50) return "low";
  if (value <= 100) return "moderate";
  return "high";
};

const severityStyle = {
  low: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    glow: "#22c55e",
  },
  moderate: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    glow: "#eab308",
  },
  high: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "#ef4444",
  },
};

export const PollutantCards = ({ data }: any) => {
  // ✅ FIX: handle BOTH formats
  const pData = data?.pollutants || data;

  if (!pData) {
    return <p className="text-center text-white/50">Loading pollutants...</p>;
  }

  const pollutants = [
    {
      code: "pm2_5",
      label: "PM2.5",
      value: pData.pm2_5 ?? pData.pm2 ?? 0, // 🔥 FIX pm2 issue
      unit: "µg/m³",
      limit: 60,
    },
    {
      code: "pm10",
      label: "PM10",
      value: pData.pm10 ?? 0,
      unit: "µg/m³",
      limit: 100,
    },
    {
      code: "co",
      label: "CO",
      value: pData.co ?? 0,
      unit: "mg/m³",
      limit: 10,
    },
    {
      code: "no2",
      label: "NO₂",
      value: pData.no2 ?? 0,
      unit: "µg/m³",
      limit: 80,
    },
    {
      code: "o3",
      label: "O₃",
      value: pData.o3 ?? 0,
      unit: "µg/m³",
      limit: 100,
    },
    {
      code: "so2",
      label: "SO₂",
      value: pData.so2 ?? 0,
      unit: "µg/m³",
      limit: 80,
    },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-white/80">
        🌫️ Major Air Pollutants
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pollutants.map((p) => {
          const Icon = iconMap[p.code];
          const severity = getSeverity(p.value);
          const style = severityStyle[severity];

          const pct = Math.min((p.value / p.limit) * 100, 100);

          return (
            <div
              key={p.code}
              className="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl"
            >
              {/* ICON */}
              <div
                className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${style.bg} ${style.border}`}
              >
                <Icon className={`h-4 w-4 ${style.color}`} />
              </div>

              {/* LABEL */}
              <p className="mt-3 text-xs text-white/60">{p.label}</p>

              {/* VALUE */}
              <div className="flex items-end gap-1 mt-1">
                <span className="text-xl font-bold text-white">
                  {Math.round(p.value)}
                </span>
                <span className="text-[10px] text-white/50">
                  {p.unit}
                </span>
              </div>

              {/* BAR */}
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: style.glow,
                  }}
                />
              </div>

              {/* LIMIT */}
              <p className="text-[10px] text-white/40 mt-1">
                Limit: {p.limit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};