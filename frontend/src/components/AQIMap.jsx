import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchAirQuality } from '../services/api';

// Component to handle map center updates
const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon]);
    }, [lat, lon, map]);
    return null;
};

const AQIMap = ({ centerLat, centerLon, centerAqi }) => {
    const [nearbyPoints, setNearbyPoints] = useState([]);

    useEffect(() => {
        const fetchNearby = async () => {
            // Define offsets for "nearby" points (~5km away)
            const offsets = [
                { lat: 0.04, lon: 0 },    // North
                { lat: -0.04, lon: 0 },   // South
                { lat: 0, lon: 0.04 },    // East
                { lat: 0, lon: -0.04 },   // West
                { lat: 0.03, lon: 0.03 }, // NE
                { lat: -0.03, lon: -0.03 }// SW
            ];

            const points = [];

            // Parallel fetch for speed
            const promises = offsets.map(async (offset) => {
                const pLat = centerLat + offset.lat;
                const pLon = centerLon + offset.lon;
                try {
                    const data = await fetchAirQuality(pLat, pLon);
                    // Only take what we need
                    return {
                        lat: pLat,
                        lon: pLon,
                        aqi: data.us_aqi ? data.us_aqi : data.current?.us_aqi // Handle potential structure diff
                    };
                } catch (e) {
                    return null; // Ignore failed points
                }
            });

            const results = await Promise.all(promises);
            setNearbyPoints(results.filter(p => p !== null));
        };

        if (centerLat && centerLon) {
            fetchNearby();
        }
    }, [centerLat, centerLon]);

    const getColor = (aqi) => {
        if (aqi <= 50) return '#22c55e';
        if (aqi <= 100) return '#eab308';
        if (aqi <= 150) return '#f97316';
        if (aqi <= 200) return '#ef4444';
        if (aqi <= 300) return '#a855f7';
        return '#7e22ce';
    };

    const getStatus = (aqi) => {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy (Sens.)';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    };

    return (
        <div className="glass-panel p-2 animate-fade-in" style={{ height: '400px', overflow: 'hidden' }}>
            <MapContainer
                center={[centerLat, centerLon]}
                zoom={11}
                style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <RecenterMap lat={centerLat} lon={centerLon} />

                {/* Center Point */}
                <CircleMarker
                    center={[centerLat, centerLon]}
                    radius={20}
                    pathOptions={{
                        color: getColor(centerAqi),
                        fillColor: getColor(centerAqi),
                        fillOpacity: 0.7,
                        weight: 2
                    }}
                >
                    <Popup>
                        <div className="text-center">
                            <strong>Your Location</strong><br />
                            AQI: {centerAqi}<br />
                            {getStatus(centerAqi)}
                        </div>
                    </Popup>
                </CircleMarker>

                {/* Nearby Points */}
                {nearbyPoints.map((point, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[point.lat, point.lon]}
                        radius={12}
                        pathOptions={{
                            color: getColor(point.aqi),
                            fillColor: getColor(point.aqi),
                            fillOpacity: 0.5,
                            weight: 1
                        }}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong>Nearby</strong><br />
                                AQI: {point.aqi}<br />
                                {getStatus(point.aqi)}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AQIMap;
