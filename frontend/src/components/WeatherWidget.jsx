import React from 'react';
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, CloudFog } from 'lucide-react';

const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes (WW)
    if (code === 0 || code === 1) return <Sun size={32} className="text-yellow-400" />;
    if (code === 2 || code === 3) return <Cloud size={32} className="text-gray-400" />;
    if (code >= 45 && code <= 48) return <CloudFog size={32} className="text-blue-300" />;
    if (code >= 51 && code <= 67) return <CloudRain size={32} className="text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={32} className="text-white" />;
    if (code >= 80 && code <= 99) return <CloudRain size={32} className="text-blue-500" />;
    return <Sun size={32} className="text-yellow-400" />;
};

const getWeatherDescription = (code) => {
    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Foggy";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 56 && code <= 57) return "Freezing Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95) return "Thunderstorm";
    return "Clear";
};

const WeatherWidget = ({ temp, humidity, windSpeed, weatherCode }) => {
    // Safety check: if data hasn't loaded (e.g. backend cache is old), show placeholders


    return (
        <div className="glass-panel p-6 animate-fade-in relative overflow-hidden h-full flex flex-col justify-between">
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    {getWeatherIcon(weatherCode || 0)}
                    <div>
                        <div className="text-3xl font-bold">{temp === undefined || temp === null ? '--' : Math.round(temp)}°C</div>
                        <div className="text-sm text-muted">{getWeatherDescription(weatherCode || 0)}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Droplets size={20} className="text-blue-400" />
                    <div>
                        <div className="text-xs text-muted mb-1">Humidity</div>
                        <div className="font-semibold">{Math.round(humidity || 0)}%</div>
                    </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Wind size={20} className="text-cyan-400" />
                    <div>
                        <div className="text-xs text-muted mb-1">Wind Speed</div>
                        <div className="font-semibold">{Math.round(windSpeed || 0)} km/h</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
