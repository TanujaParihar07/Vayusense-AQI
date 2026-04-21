const BASE_URL = "http://localhost:5000";

// ---------------- TYPES ----------------

export interface PollutionData {
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
}

export interface ForecastDay {
  date: string;
  aqi: number;
}

export interface AQIResponse {
  city: string;
  aqi: number;
  category: string;
  health_advice?: string;
  pollutants: PollutionData;
  weather: WeatherData;
  forecast: ForecastDay[];
}

export interface CityMarker {
  city: string;
  lat: number;
  lon: number;
  aqi: number;
  category: string;
}

// ---------------- MAIN API ----------------

export const getForecastByCoords = async (
  lat: number,
  lon: number,
  city?: string
): Promise<AQIResponse | null> => {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${BASE_URL}/predict?lat=${lat}&lon=${lon}&city=${encodeURIComponent(
          city || "Current Location"
        )}`
      ),
      fetch(
        `${BASE_URL}/forecast?city=${encodeURIComponent(
          city || "Current Location"
        )}`
      ).catch(() => null),
    ]);

    if (!currentRes.ok) throw new Error("Predict API failed");

    const current = await currentRes.json();

    const p = current.pollutants || {};

    return {
      city: current.city || city || "Current Location",
      aqi: current.aqi ?? 0,
      category: current.category ?? "Unknown",

      health_advice:
        current.health_advice ||
        (current.aqi > 150
          ? "Avoid outdoor activity. Wear N95 mask."
          : current.aqi > 80
          ? "Limit outdoor exposure."
          : "Air quality is good."),

      // 🔥 CRITICAL FIX (pm2 → pm2_5)
      pollutants: {
        pm2_5: p.pm2 ?? p.pm2_5 ?? 0,
        pm10: p.pm10 ?? 0,
        no2: p.no2 ?? 0,
        o3: p.o3 ?? 0,
        so2: p.so2 ?? 0,
        co: p.co ?? 0,
      },

      weather: {
        temp: current.weather?.temp ?? 0,
        humidity: current.weather?.humidity ?? 0,
        wind: current.weather?.wind ?? 0,
      },

      forecast: forecastRes && forecastRes.ok
        ? await forecastRes.json()
        : [],
    };
  } catch (err) {
    console.error("API ERROR:", err);
    return null;
  }
};

// ---------------- CITY AQI ----------------

export const getAQIByCity = async (city: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/predict?city=${encodeURIComponent(city)}`
    );

    if (!res.ok) throw new Error("City AQI failed");

    const data = await res.json();

    return {
      city: data.city || city,
      aqi: data.aqi ?? 0,
      category: data.category ?? "Unknown",
    };
  } catch (err) {
    console.error("City AQI Error:", err);
    return null;
  }
};

// ---------------- MAP ----------------

export const getAllCitiesAQI = async (): Promise<CityMarker[]> => {
  try {
    const res = await fetch(`${BASE_URL}/map`);
    if (!res.ok) throw new Error("Map API failed");
    return await res.json();
  } catch (err) {
    console.error("Map API ERROR:", err);
    return [];
  }
};

// ---------------- CHAT ----------------

export const sendMessageToBot = async (
  message: string,
  currentAQI?: number
): Promise<string> => {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        current_aqi: currentAQI,
      }),
    });

    if (!res.ok) throw new Error("Chat API failed");

    const data = await res.json();
    return data.reply || "No response";
  } catch (err) {
    console.error("Chat API ERROR:", err);
    return "⚠️ Server not responding.";
  }
};