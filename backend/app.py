from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from functools import lru_cache
import time

app = Flask(__name__)
# Enable CORS so our React frontend (port 5173+) can communicate with this backend (port 5000)
CORS(app)

AQI_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast'
GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

# ---------------------------------------------------------
# OPTIONAL: WAQI API Token for Ground Station Data
# Get your free token here: https://aqicn.org/data-platform/token/
# Paste it inside the quotes below.
WAQI_TOKEN = "bf6cd737ac4bbad01ffd58711ecdae70232feda1" 
# ---------------------------------------------------------

# Use a session for connection pooling (Keep-Alive)
session = requests.Session()

# Simple caching decorator for API calls
@lru_cache(maxsize=128)
def cached_geo_search(city_name):
    response = session.get(GEO_BASE_URL, params={
        'name': city_name,
        'count': 1,
        'language': 'en',
        'format': 'json'
    })
    return response.json()

@lru_cache(maxsize=128)
def cached_reverse_geo(lat, lon):
    response = session.get(REVERSE_GEO_URL, params={
        'latitude': lat,
        'longitude': lon,
        'localityLanguage': 'en'
    })
    return response.json()

def map_waqi_to_standard(waqi_data):
    """Maps WAQI response to our internal standard format"""
    try:
        iaqi = waqi_data.get('iaqi', {})
        return {
            'us_aqi': waqi_data.get('aqi'),
            'pm2_5': iaqi.get('pm25', {}).get('v'),
            'pm10': iaqi.get('pm10', {}).get('v'),
            'carbon_monoxide': iaqi.get('co', {}).get('v'),
            'nitrogen_dioxide': iaqi.get('no2', {}).get('v'),
            'sulphur_dioxide': iaqi.get('so2', {}).get('v'),
            'ozone': iaqi.get('o3', {}).get('v'),
        }
    except Exception as e:
        print(f"Error parse WAQI: {e}")
        return None

# Cache AQI data for 5 minutes
aqi_cache = {}

def get_cached_aqi(lat, lon):
    key = f"{lat},{lon}"
    now = time.time()
    if key in aqi_cache:
        timestamp, data = aqi_cache[key]
        if now - timestamp < 300: # 5 minutes
            return data
            
    # 1. Fetch Forecast (Hourly) from Open-Meteo Air Quality API
    om_params = {
        'latitude': lat,
        'longitude': lon,
        'current': 'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
        'hourly': 'us_aqi',
        'forecast_days': 1
    }
    om_response = session.get(AQI_BASE_URL, params=om_params)
    om_data = om_response.json()
    
    current_data = om_data.get('current', {})

    # 2. Fetch Weather Data from Open-Meteo Weather API (Separate Service)
    try:
        weather_params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code'
        }
        weather_response = session.get(WEATHER_BASE_URL, params=weather_params)
        weather_data = weather_response.json()
        
        if 'current' in weather_data:
            current_data.update(weather_data['current'])
    except Exception as e:
        print(f"Weather Fetch Error: {e}")
    
    # 3. Try Fetching Ground Truth from WAQI (if token exists)
    if WAQI_TOKEN:
        try:
            waqi_url = f"https://api.waqi.info/feed/geo:{lat};{lon}/"
            waqi_response = session.get(waqi_url, params={'token': WAQI_TOKEN})
            waqi_json = waqi_response.json()
            
            if waqi_json.get('status') == 'ok':
                ground_truth = map_waqi_to_standard(waqi_json.get('data'))
                if ground_truth:
                    # Overwrite current satellite data with ground truth
                    # We keep Open-Meteo keys if WAQI is missing some values
                    current_data.update({k: v for k, v in ground_truth.items() if v is not None})
        except Exception as e:
            print(f"WAQI Fetch Error: {e}")

    final_data = {
        "current": current_data,
        "hourly": om_data.get('hourly', {})
    }
    
    aqi_cache[key] = (now, final_data)
    return final_data

@app.route('/')
def home():
    return jsonify({"status": "Backend is running", "service": "Air Quality Monitor API"})

@app.route('/api/search', methods=['GET'])
def search_city():
    city = request.args.get('name')
    if not city:
        return jsonify({"error": "City name is required"}), 400
    
    try:
        data = cached_geo_search(city)
        if 'results' in data and len(data['results']) > 0:
            return jsonify(data['results'][0])
        return jsonify({"error": "City not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/aqi', methods=['GET'])
def get_aqi():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude are required"}), 400

    try:
        data = get_cached_aqi(lat, lon)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reverse-geocode', methods=['GET'])
def reverse_geocode():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude are required"}), 400
        
    try:
        data = cached_reverse_geo(lat, lon)
        
        # improved naming strategy: "Locality, City"
        locality = data.get('locality')
        city = data.get('city')
        subdivision = data.get('principalSubdivision')
        
        parts = []
        # Add locality if it exists and isn't identical to city (avoid "Delhi, Delhi")
        if locality:
            parts.append(locality)
        
        # Add city if it exists, otherwise partial subdivision
        if city:
            if city not in parts: 
                parts.append(city)
        elif subdivision:
            if subdivision not in parts:
                parts.append(subdivision)
                
        name = ", ".join(parts)
        
        # Fallback
        if not name:
            name = "Unknown Location"
            
        result = {
            "name": name,
            "country": data.get('countryName') or ""
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
