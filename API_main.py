from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
API_KEY = "zS44us0WWwYrr40Gx65xNNU1eXz1SUd4"
@app.route('/get_current_air_data', methods=['GET'])
def get_current_air_data():
    # Get latitude and longitude from request parameters
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude are required.'}), 400
    
    url = f"https://api.meersens.com/environment/public/air/current?lat={lat}&lng={lng}&health_recommendations=true"

    # Headers for the Meersens API
    headers = {
        'accept': 'application/json',
        'apikey': API_KEY
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        health_recommendations = data.get("health_recommendations")
        trimmed_response = {
            "found": data.get("found"),
            "datetime": data.get("datetime"),
            "index": data.get("index"),
            "pollutants": {
                key: {
                    "shortcode": value.get("shortcode"),
                    "name": value.get("name"),
                    "unit": value.get("unit"),
                    "found": value.get("found"),
                    "value": value.get("value"),
                    "confidence": value.get("confidence")
                }
                for key, value in data.get("pollutants", {}).items()
            },
            "health_recommendations": health_recommendations if health_recommendations else {}
        }

        return jsonify(trimmed_response)
    else:
        return jsonify({'error': 'Failed to fetch data.'}), response.status_code
    

@app.route('/get_current_noise_data', methods=['GET'])
def get_current_noise_data():
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude are required.'}), 400

    url = f"https://api.meersens.com/environment/public/noise/current?lat={lat}&lng={lng}&health_recommendations=true"

    headers = {
        'accept': 'application/json',
        'apikey': API_KEY
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch noise data.'}), response.status_code

@app.route('/get_seven_days_weather', methods=['GET'])
def get_seven_days_weather():
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude are required.'}), 400

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,wind_speed_10m_max&timezone=auto"

    headers = {
        'accept': 'application/json'
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch weather data.'}), response.status_code


if __name__ == '__main__':
    app.run(debug=True)