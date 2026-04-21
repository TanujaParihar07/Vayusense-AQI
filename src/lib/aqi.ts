export type AQICategory = {
  label: string;
  color: string; // tailwind class color name part
  hsl: string; // raw hsl var
  description: string;
  textColor: string;
};

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50)
    return {
      label: "Good",
      color: "aqi-good",
      hsl: "var(--aqi-good)",
      description: "Air quality is satisfactory and poses little or no risk.",
      textColor: "text-aqi-good",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      color: "aqi-moderate",
      hsl: "var(--aqi-moderate)",
      description: "Acceptable, but sensitive groups may experience minor effects.",
      textColor: "text-aqi-moderate",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive",
      color: "aqi-unhealthy-sensitive",
      hsl: "var(--aqi-unhealthy-sensitive)",
      description: "Sensitive groups may experience health effects.",
      textColor: "text-aqi-unhealthy-sensitive",
    };
  if (aqi <= 200)
    return {
      label: "Unhealthy",
      color: "aqi-unhealthy",
      hsl: "var(--aqi-unhealthy)",
      description: "Everyone may begin to experience health effects.",
      textColor: "text-aqi-unhealthy",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      color: "aqi-very-unhealthy",
      hsl: "var(--aqi-very-unhealthy)",
      description: "Health alert: serious effects for everyone.",
      textColor: "text-aqi-very-unhealthy",
    };
  return {
    label: "Hazardous",
    color: "aqi-hazardous",
    hsl: "var(--aqi-hazardous)",
    description: "Emergency conditions. Entire population affected.",
    textColor: "text-aqi-hazardous",
  };
}

export const cities = [
  { name: "New Delhi", country: "India", aqi: 218, lat: 28.6139, lng: 77.209, dominant: "PM2.5" },
  { name: "Mumbai", country: "India", aqi: 142, lat: 19.076, lng: 72.8777, dominant: "PM10" },
  { name: "Bengaluru", country: "India", aqi: 78, lat: 12.9716, lng: 77.5946, dominant: "NO2" },
  { name: "Chennai", country: "India", aqi: 95, lat: 13.0827, lng: 80.2707, dominant: "PM2.5" },
  { name: "Kolkata", country: "India", aqi: 168, lat: 22.5726, lng: 88.3639, dominant: "PM2.5" },
  { name: "Hyderabad", country: "India", aqi: 88, lat: 17.385, lng: 78.4867, dominant: "O3" },
  { name: "Pune", country: "India", aqi: 112, lat: 18.5204, lng: 73.8567, dominant: "PM10" },
  { name: "London", country: "UK", aqi: 42, lat: 51.5074, lng: -0.1278, dominant: "NO2" },
  { name: "Tokyo", country: "Japan", aqi: 38, lat: 35.6762, lng: 139.6503, dominant: "O3" },
  { name: "Beijing", country: "China", aqi: 185, lat: 39.9042, lng: 116.4074, dominant: "PM2.5" },
];

export const pollutants = [
  { code: "PM2.5", name: "Fine Particulate", value: 124, unit: "µg/m³", limit: 60, severity: "high" as const },
  { code: "PM10", name: "Coarse Particulate", value: 198, unit: "µg/m³", limit: 100, severity: "high" as const },
  { code: "CO", name: "Carbon Monoxide", value: 1.4, unit: "mg/m³", limit: 4, severity: "low" as const },
  { code: "NO2", name: "Nitrogen Dioxide", value: 56, unit: "ppb", limit: 80, severity: "moderate" as const },
  { code: "O3", name: "Ozone", value: 72, unit: "ppb", limit: 100, severity: "moderate" as const },
  { code: "SO2", name: "Sulfur Dioxide", value: 14, unit: "ppb", limit: 75, severity: "low" as const },
];

export const forecast = [
  { day: "Today", aqi: 218, predicted: false },
  { day: "Tue", aqi: 232, predicted: true },
  { day: "Wed", aqi: 195, predicted: true },
  { day: "Thu", aqi: 168, predicted: true },
  { day: "Fri", aqi: 142, predicted: true },
  { day: "Sat", aqi: 156, predicted: true },
  { day: "Sun", aqi: 178, predicted: true },
];
