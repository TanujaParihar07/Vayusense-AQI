// src/lib/events.ts

export const triggerMapAQI = (city: string, aqi: number) => {
  // 📦 Save globally
  localStorage.setItem("selected_city", city);
  localStorage.setItem("selected_aqi", String(aqi));
  localStorage.setItem("current_aqi", String(aqi));

  // 🚨 Save alert automatically
  let alerts = JSON.parse(localStorage.getItem("aqi_alerts") || "[]");

  let msg = "";
  if (aqi > 150) msg = `⚠️ High Pollution in ${city} (AQI ${aqi})`;
  else if (aqi > 100) msg = `😷 Moderate Air in ${city} (AQI ${aqi})`;
  else msg = `✅ Good Air in ${city} (AQI ${aqi})`;

  if (!alerts.includes(msg)) {
    alerts.push(msg);
    localStorage.setItem("aqi_alerts", JSON.stringify(alerts));
  }

  // 📡 Trigger global event
  window.dispatchEvent(
    new CustomEvent("map_aqi_update", {
      detail: { city, aqi },
    })
  );
};