import axios from 'axios';

// Point to our local Python backend
const BACKEND_URL = 'http://localhost:5000/api';

export const fetchCoordinates = async (city) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/search`, {
            params: { name: city },
        });
        const { latitude, longitude, name, country } = response.data;
        return { latitude, longitude, name, country };
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error;
    }
};

export const reverseGeocode = async (lat, lon) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/reverse-geocode`, {
            params: { lat, lon }
        });
        return response.data;
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        return { name: "Your Location", country: "" };
    }
};

export const fetchAirQuality = async (lat, lon) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/aqi`, {
            params: { lat, lon },
        });
        return {
            current: response.data.current,
            hourly: response.data.hourly
        };
    } catch (error) {
        console.error("Error fetching AQI:", error);
        throw error;
    }
};

export const fetchUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        }
    });
};
