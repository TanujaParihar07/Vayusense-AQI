import { HeartPulse, ShieldAlert, Wind, Activity } from "lucide-react";
import { getAQICategory } from "@/lib/aqi";

export const HealthPanel = ({ aqi }: { aqi: number }) => {
  const cat = getAQICategory(aqi);
  const score = Math.max(0, Math.min(100, 100 - aqi / 5));
  const risk = aqi <= 100 ? "Low" : aqi <= 200 ? "Moderate" : "High";
  const riskColor = aqi <= 100 ? "text-aqi-good" : aqi <= 200 ? "text-aqi-moderate" : "text-aqi-unhealthy";

  const tips = [
    { icon: ShieldAlert, title: "Wear an N95 mask", body: "Recommended outdoors during peak hours.", urgent: aqi > 150 },
    { icon: Activity, title: "Limit outdoor activity", body: "Avoid intense exercise between 2-6pm.", urgent: aqi > 100 },
    { icon: Wind, title: "Improve ventilation", body: "Use HEPA air purifiers indoors.", urgent: false },
  ];

  return (
    <div className="glass-strong rounded-3xl p-6 hover-lift">
      <div className="flex items-center gap-2 mb-1">
        <HeartPulse className="h-4 w-4 text-primary" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Health Analysis</p>
      </div>
      <h3 className="text-lg font-semibold mb-5">AI Health Score</h3>

      {/* Score arc */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={`hsl(${cat.hsl})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 263.9} 263.9`}
              transform="rotate(-90 50 50)"
              style={{ filter: `drop-shadow(0 0 8px hsl(${cat.hsl} / 0.5))`, transition: "stroke-dasharray 1s" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{Math.round(score)}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">/100</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Risk Level</p>
          <p className={`text-2xl font-bold ${riskColor}`}>{risk}</p>
          <p className="text-xs text-muted-foreground mt-1">Based on current AQI & exposure</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Personalized Recommendations
        </p>
        {tips.map((t, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-muted/40 ${
              t.urgent ? "bg-destructive/5 border border-destructive/20" : "bg-muted/30"
            }`}
          >
            <div className={`p-1.5 rounded-lg ${t.urgent ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
              <t.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
