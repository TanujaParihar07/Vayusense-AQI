import { motion } from "framer-motion";

interface Props {
  data: any;
}

export default function EnvStats({ data }: Props) {
  if (!data) return null;

  const items = [
    {
      label: "🌡 Temperature",
      value: data.weather?.temp || 0,
      unit: "°C",
    },
    {
      label: "💧 Humidity",
      value: data.weather?.humidity || 0,
      unit: "%",
    },
    {
      label: "🌬 Wind",
      value: data.weather?.wind || 0,
      unit: "km/h",
    },
    {
      label: "PM2.5",
      value: data.pollutants?.pm2_5 || 0,
      unit: "µg/m³",
    },
    {
      label: "NO₂",
      value: data.pollutants?.no2 || 0,
      unit: "ppb",
    },
    {
      label: "O₃",
      value: data.pollutants?.o3 || 0,
      unit: "ppb",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card border border-border rounded-xl p-4 text-center shadow"
        >
          <div className="text-sm text-muted-foreground">
            {item.label}
          </div>

          <div className="text-2xl font-bold mt-1">
            {item.value}
          </div>

          <div className="text-xs text-muted-foreground">
            {item.unit}
          </div>
        </motion.div>
      ))}
    </div>
  );
}