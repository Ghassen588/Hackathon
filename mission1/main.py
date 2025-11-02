#import from libraries
from machine import Pin, ADC
import utime
import math

# Sensor pins (only ADC capable pins: GP26, GP27, GP28)
MOISTURE_SENSOR_PIN = 27
TEMP_SENSOR_PIN = 26
NPK_SENSOR_PIN = 28
# PH_SENSOR_PIN = 22  # GP22 doesn't have ADC - removed

# Switch pins for predefined crop selection
SWITCH_1_PIN = 6
SWITCH_2_PIN = 7
SWITCH_3_PIN = 8

def read_temperature():
    temp_reading = temp_sensor.read_u16()
    
    if temp_reading >= 65535:
        temp_reading = 65534
        
    R1 = 10000
    logR2 = math.log(R1 * (65535.0 / temp_reading - 1.0))
    temp_kelvin = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * logR2 * logR2)) * logR2)
    temp_celsius = temp_kelvin - 273.15
    
    return round(temp_celsius, 1)

def read_moisture():
    moisture_reading = moisture_sensor.read_u16()
    moisture_percentage = int((moisture_reading / 65535) * 100)
    return moisture_percentage

def read_virtual_npk():
    npk_reading = npk_sensor.read_u16()
    base_value = npk_reading / 65535.0
    
    nitrogen = 20 + int(base_value * 80)
    phosphorus = 15 + int(base_value * 65)
    potassium = 25 + int(base_value * 95)
    
    return nitrogen, phosphorus, potassium

def read_virtual_ph():
    # Simulate pH reading since no ADC pin available
    # Use time-based variation for simulation
    base_value = (utime.ticks_ms() // 2000) % 100 / 100.0
    ph_value = 5.5 + (base_value * 3.5)
    return round(ph_value, 1)

def read_soil_humidity():
    moisture = read_moisture()
    humidity = max(0, min(100, moisture + 5))
    return humidity

def get_crop_selection():
    # Read which switch is active (predefined by installer)
    if Pin(SWITCH_1_PIN, Pin.IN, Pin.PULL_UP).value() == 0:
        return 0
    elif Pin(SWITCH_2_PIN, Pin.IN, Pin.PULL_UP).value() == 0:
        return 1
    elif Pin(SWITCH_3_PIN, Pin.IN, Pin.PULL_UP).value() == 0:
        return 2
    else:
        return 0  # Default crop

def main():
    global moisture_sensor, temp_sensor, npk_sensor
    
    # Initialize sensors (only ADC capable pins)
    moisture_sensor = ADC(Pin(MOISTURE_SENSOR_PIN))
    temp_sensor = ADC(Pin(TEMP_SENSOR_PIN))
    npk_sensor = ADC(Pin(NPK_SENSOR_PIN))
    # ph_sensor removed - GP22 doesn't have ADC
    
    print("Sensor Reading System Started")
    print("=" * 40)
    
    while True:
        # Read all sensors
        temperature = read_temperature()
        moisture = read_moisture()
        soil_humidity = read_soil_humidity()
        nitrogen, phosphorus, potassium = read_virtual_npk()
        ph_value = read_virtual_ph()  # Now simulated
        crop = get_crop_selection()
        
        # Print all sensor readings
        print(f"Crop: {crop}")
        print(f"Temperature: {temperature}C")
        print(f"Moisture: {moisture}%")
        print(f"Soil Humidity: {soil_humidity}%")
        print(f"NPK - N:{nitrogen}, P:{phosphorus}, K:{potassium} mg/kg")
        print(f"pH: {ph_value}")
        print("-" * 40)
        
        utime.sleep(2.0)

if __name__ == "__main__":
    main()