import json
import meteo  # make sure meteo.py is in the same directory

def main():
    # --- Step 1: Get weather JSON from meteo.py ---
    weather_data = meteo.weather_zaghouan(save_file=False)

    # --- Step 2: Sensor JSON (manual example) ---
    sensor_json_str = '{"P": 15, "K": 25, "pH": 6.6, "crop": 0, "N": 20, "temperature_C": 24.5, "soil_humidity_percent": 5, "moisture_percent": 0}'
    sensor_data = json.loads(sensor_json_str)

    # --- Step 3: Merge dictionaries ---
    combined_data = {**sensor_data, **weather_data}  # merge top-level keys

    # --- Step 4: Save combined JSON ---
    with open("Input.json", "w") as f:
        json.dump(combined_data, f, indent=4)

    print("Input.json created successfully!")
    print(json.dumps(combined_data, indent=4))

if __name__ == "__main__":
    main()
