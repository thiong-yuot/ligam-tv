import { useState, useEffect } from "react";

const weatherCodeDescriptions = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Foggy", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Moderate drizzle", icon: "🌧️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  71: { description: "Slight snow", icon: "🌨️" },
  73: { description: "Moderate snow", icon: "❄️" },
  75: { description: "Heavy snow", icon: "❄️" },
  77: { description: "Snow grains", icon: "🌨️" },
  80: { description: "Slight rain showers", icon: "🌦️" },
  81: { description: "Moderate rain showers", icon: "🌧️" },
  82: { description: "Violent rain showers", icon: "⛈️" },
  85: { description: "Slight snow showers", icon: "🌨️" },
  86: { description: "Heavy snow showers", icon: "❄️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`
        );
        
        if (!weatherRes.ok) throw new Error("Failed to fetch weather");
        
        const weatherData = await weatherRes.json();
        const current = weatherData.current;
        
        const weatherInfo = weatherCodeDescriptions[current.weather_code] || { description: "Unknown", icon: "🌡️" };
        
        setWeather({
          temperature: Math.round(current.temperature_2m),
          weatherCode: current.weather_code,
          isDay: current.is_day === 1,
          location: weatherData.timezone?.split("/")[1]?.replace("_", " ") || "Your Location",
          description: weatherInfo.description,
          icon: current.is_day === 0 && current.weather_code === 0 ? "🌙" : weatherInfo.icon,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Unable to fetch weather");
        setIsLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeather(40.7128, -74.006);
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, []);

  return { weather, isLoading, error };
};
