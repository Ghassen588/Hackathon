import { useState, useEffect } from "react";

function WeatherPage() {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather");
        if (response.ok) {
          const data = await response.json();
          setForecastData(data);
        }
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
      setLoading(false);
    };
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full text-center">
          <span className="text-4xl">Loading Weather...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex items-center justify-center">
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
          <span className="text-4xl">🌦️</span>
          7-Day Forecast
        </h2>

        <div className="overflow-x-auto">
          <div className="flex space-x-4 p-4">
            {forecastData.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 bg-slate-50 rounded-2xl p-6 shadow-lg border border-gray-200 text-center transition duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-xl font-semibold text-gray-700 mb-2">
                  {item.day}
                </div>
                <div className="text-6xl mb-4">{item.emoji}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {item.high}
                </div>
                <div className="text-2xl text-gray-500">{item.low}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
