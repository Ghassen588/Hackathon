# 🌾 Self-Learning Smart Irrigation System

This project implements a **self-learning irrigation model** that predicts how much water crops need based on soil and weather data.  
It continuously **improves itself over time** as new real-world data is collected.

---

## 💡 Overview

The system uses a **machine learning model (Random Forest Regressor)** to estimate the optimal irrigation level for crops, based on:

- Soil moisture
- Temperature
- Humidity
- Crop type

It automatically **retrains itself** on new data to stay accurate over time — ensuring smarter and more efficient irrigation decisions.  
All predictions and retraining happen locally, so it’s lightweight and easy to run anywhere.

---

## 📦 Features

✅ Predicts the amount of water needed for each crop  
✅ Learns automatically from past sensor data  
✅ Periodically retrains in the background  
✅ Saves and loads trained models automatically  
✅ Easy to integrate with sensors or a Flask API

---

## 🧠 How It Works

1. **Data Loading**

   - Reads from `sensor_data.csv` (historical soil and weather data).
   - If no file exists, creates an empty one automatically.

2. **Model Training**

   - Trains a Random Forest model once enough data is available.
   - Saves the model as `water_model.pkl` for later use.

3. **Prediction**

   - Takes new sensor input and predicts the water requirement (in mm).

4. **Self-Learning**
   - A background thread retrains the model every hour using the latest data.
   - Each new record (e.g., from irrigation logs or sensors) improves the model.

---

## 📊 Data Format

The model learns from past data you provide (e.g., daily logs).  
Each record should look like this:

| soil_moisture | temperature | humidity | crop_type  | water_needed |
| ------------- | ----------- | -------- | ---------- | ------------ |
| 35.2          | 28.1        | 55.4     | 0 (tomato) | 22.5         |

> 🧾 You can gather this data from past farm logs, sensors, or manual irrigation records.

---

## ⚙️ Installation

```bash
pip install numpy pandas scikit-learn joblib schedule flask
```
