"""
Self-Learning Model for Smart Irrigation System
================================================
This script trains a machine learning model (RandomForestRegressor) to predict
how much water is needed for crops based on soil data, and periodically retrains
it as new data becomes available.

Dependencies:
-------------
- numpy
- pandas
- scikit-learn
- joblib
- flask (optional if integrating with an API)
- schedule
- threading

Install with:
-------------
pip install numpy pandas scikit-learn joblib schedule flask
"""

import numpy as np
import pandas as pd
import joblib
import schedule
import threading
import time
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# ==============================================================
# 1. Load and Prepare Data
# ==============================================================

def load_data(file_path="sensor_data.csv"):
    """Loads sensor data and prepares features & labels."""
    try:
        data = pd.read_csv(file_path)
    except FileNotFoundError:
        print("No historical data found, starting from scratch.")
        columns = ["soil_moisture", "temperature", "humidity", "crop_type", "water_needed"]
        data = pd.DataFrame(columns=columns)
        data.to_csv(file_path, index=False)
        return data
    return data

# ==============================================================
# 2. Train Model Function
# ==============================================================

def train_model(data):
    """Train the model on the current dataset."""
    if len(data) < 10:
        print("Not enough data to train the model yet.")
        return None

    X = data[["soil_moisture", "temperature", "humidity", "crop_type"]]
    y = data["water_needed"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"Model retrained successfully. MAE: {mae:.2f}")

    joblib.dump(model, "water_model.pkl")

# ==============================================================
# 3. Predict Function
# ==============================================================

def predict_water_need(sensor_data):
    """Predict water needed using the trained model."""
    try:
        model = joblib.load("water_model.pkl")
    except FileNotFoundError:
        print("No trained model found, training from scratch.")
        data = load_data()
        train_model(data)
        model = joblib.load("water_model.pkl")

    df = pd.DataFrame([sensor_data])
    prediction = model.predict(df)[0]
    print(f"Predicted water need: {prediction:.2f} mm")
    return prediction

# ==============================================================
# 4. Periodic Retraining Function
# ==============================================================

def retrain_periodically():
    """Retrain model every certain time interval."""
    def job():
        print("\nRetraining model with latest data...")
        data = load_data()
        train_model(data)

    # Retrain every hour (can be changed to daily, weekly, etc.)
    schedule.every(1).hours.do(job)

    while True:
        schedule.run_pending()
        time.sleep(60)

# ==============================================================
# 5. Start Background Retraining
# ==============================================================

def start_background_retraining():
    """Start retraining in a separate thread."""
    thread = threading.Thread(target=retrain_periodically, daemon=True)
    thread.start()

# ==============================================================
# 6. Example of Model Usage
# ==============================================================

if __name__ == "__main__":
    start_background_retraining()  # runs retraining every hour

    # Example: new sensor input
    new_sensor_data = {
        "soil_moisture": 35.2,
        "temperature": 28.1,
        "humidity": 55.4,
        "crop_type": 0  # 0=tomato, 1=onion, 2=mint bush
    }

    predict_water_need(new_sensor_data)

    # Simulate adding new data after functioning for a while
    data = load_data()
    new_row = {**new_sensor_data, "water_needed": 22.5}
    data = pd.concat([data, pd.DataFrame([new_row])], ignore_index=True)
    data.to_csv("sensor_data.csv", index=False)

    print("Data saved for future retraining.")
