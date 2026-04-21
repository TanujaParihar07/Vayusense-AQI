"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ForecastDay {
  date: string;
  aqi: number;
}

export default function ForecastChart({
  data,
}: {
  data: ForecastDay[];
}) {
  return (
    <div className="h-[300px] w-full p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
      
      <h3 className="text-lg font-semibold mb-4 text-white/80">
        7-Day AQI Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          
          <defs>
            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.5)"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tickLine={false}
            axisLine={false}
            domain={[0, "dataMax + 50"]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
            }}
          />

          <Area
            type="monotone"
            dataKey="aqi"
            stroke="#22c55e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAqi)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}