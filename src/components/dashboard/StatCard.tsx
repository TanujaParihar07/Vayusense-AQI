import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  accent?: "primary" | "secondary" | "accent";
}

export const StatCard = ({ icon: Icon, label, value, suffix = "", trend, accent = "primary" }: StatCardProps) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1000);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const accentClass = {
    primary: "from-primary/20 to-primary/5 text-primary",
    secondary: "from-secondary/20 to-secondary/5 text-secondary",
    accent: "from-accent/20 to-accent/5 text-accent",
  }[accent];

  return (
    <div className="glass-strong rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accentClass} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? "text-aqi-good" : "text-destructive"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tabular-nums mt-0.5">
        {display.toFixed(value % 1 === 0 ? 0 : 1)}
        {suffix && <span className="text-sm font-medium text-muted-foreground ml-1">{suffix}</span>}
      </p>
    </div>
  );
};
