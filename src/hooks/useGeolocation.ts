import { useState, useEffect } from "react";

interface LocationState {
  lat: number | null;
  lon: number | null;
  city: string | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lon: null,
    city: null,
    error: null,
    loading: true,
  });

  // 🌍 SAFE CITY FETCH (WITH FALLBACK)
  const getCityName = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "vayusense-app",
          },
        }
      );

      if (!res.ok) throw new Error("Geocode failed");

      const data = await res.json();

      return (
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.state ||
        "Current Location"
      );
    } catch (err) {
      console.warn("Reverse Geocoding Failed:", err);
      return "Current Location";
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        lat: null,
        lon: null,
        city: null,
        error: "Geolocation not supported",
        loading: false,
      });
      return;
    }

    const success = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      let city = "Current Location";

      try {
        city = await getCityName(latitude, longitude);
      } catch {
        city = "Current Location";
      }

      setLocation({
        lat: latitude,
        lon: longitude,
        city,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (err: GeolocationPositionError) => {
      console.error("Geolocation Error:", err);

      setLocation({
        lat: null,
        lon: null,
        city: null,
        error: "Location permission denied",
        loading: false,
      });
    };

    // 🔥 TRY HIGH ACCURACY FIRST
    navigator.geolocation.getCurrentPosition(success, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // 🔁 FALLBACK (LOW ACCURACY if first fails)
    const fallbackTimer = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(success, errorHandler, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000,
      });
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return location;
};