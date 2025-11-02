import requests
import json

def weather_zaghouan(hours=24, save_file=True):
    """
    Fetch weather forecast for Zaghouan, Tunisia for the next `hours`.
    Returns a dictionary with selected metrics.
    Optionally saves the result to 'weather_zaghouan.json'.
    """
    # Coordinates for Zaghouan
    lat, lon = 36.4029, 10.1429
    url = (
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        "&hourly=precipitation,temperature_2m,relative_humidity_2m,"
        "windspeed_10m,windgusts_10m,surface_pressure"
    )

    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()
    hourly = data.get("hourly", {})

    precip = hourly.get("precipitation", [])
    temp = hourly.get("temperature_2m", [])
    humidity = hourly.get("relative_humidity_2m", [])
    wind = hourly.get("windspeed_10m", [])
    gust = hourly.get("windgusts_10m", [])
    pressure = hourly.get("surface_pressure", [])

    if not precip:
        print("No weather data available.")
        return None

    # Compute metrics
    total_rain_mm = sum(precip[:hours])
    avg_temp = sum(temp[:hours]) / len(temp[:hours])
    avg_humidity = sum(humidity[:hours]) / len(humidity[:hours])
    avg_wind = sum(wind[:hours]) / len(wind[:hours])
    avg_gust = sum(gust[:hours]) / len(gust[:hours])
    avg_pressure = sum(pressure[:hours]) / len(pressure[:hours])

    # Prepare JSON dictionary
    weather_json = {
        "expected_rainfall_mm": round(total_rain_mm, 2),
        "air_temperature_c": round(avg_temp, 1),
        "humidity_percent": round(avg_humidity, 1),
        "wind_speed_kmh": round(avg_wind, 1),
        "wind_gust_kmh": round(avg_gust, 1),
        "air_pressure_hpa": round(avg_pressure / 10, 1)  # convert Pa to hPa
    }

    # Save to JSON file if requested
    if save_file:
        with open("weather_zaghouan.json", "w") as f:
            json.dump(weather_json, f, indent=4)

    return weather_json


# Allow script to run standalone
if __name__ == "__main__":
    result = weather_zaghouan()
    print(json.dumps(result, indent=4))
