# JSON Combiner for Smart Irrigation AI

## Overview

This project provides a Python script that **combines two sources of data into a single JSON file** (`Input.json`) which serves as input for an AI model designed to assist in irrigation decisions.

1. **Land Sensor Data (Initial JSON):**  
   - Contains soil and crop measurements such as moisture, soil humidity, pH, nitrogen, phosphorus, potassium, temperature, and crop type.  
   - Example keys: `moisture_percent`, `soil_humidity_percent`, `pH`, `N`, `P`, `K_mg_per_kg`, `temperature_C`, `crop`.  

2. **Weather Forecast Data (Real-Time JSON):**  
   - Collected using `meteo.py` which fetches **real-time weather forecast from the Meteo TN API**.  
   - Forecast covers the **next 24 hours**.  
   - Extracted metrics include: expected rainfall, air temperature, humidity, wind speed, wind gusts, and air pressure.  
   - Example keys: `expected_rainfall_mm`, `air_temperature_c`, `humidity_percent`, `wind_speed_kmh`, `wind_gust_kmh`, `air_pressure_hpa`.

## Dependencies

- **Python 3.x**  
- **requests library**: Used to fetch real-time weather data.  
  Install it via pip if not already installed:

```bash
pip install requests
