import React from 'react';
import { Wind, Droplets, Sun } from 'lucide-react';

const DashboardHero = ({ data, advisory, location }) => {
    if (!data || !advisory) return null;

    const { us_aqi: aqi, pm2_5, pm10, temperature_2m: temp, relative_humidity_2m: humidity, wind_speed_10m: windSpeed, weather_code: weatherCode } = data;

    // Determine Gradient & Mascot
    let gradient = 'from-blue-900 to-indigo-900';
    let mascotSrc = '/mascot-happy.png';
    let statusColor = 'bg-green-500';

    if (aqi > 300) {
        gradient = 'from-rose-900 to-slate-900';
        mascotSrc = '/mascot-hazardous.png';
        statusColor = 'bg-rose-600';
    } else if (aqi > 200) {
        gradient = 'from-purple-900 to-slate-900';
        mascotSrc = '/mascot-hazardous.png';
        statusColor = 'bg-purple-600';
    } else if (aqi > 150) {
        gradient = 'from-red-900 to-slate-900';
        mascotSrc = '/mascot-mask.png';
        statusColor = 'bg-red-500';
    } else if (aqi > 100) {
        gradient = 'from-orange-800 to-slate-900';
        mascotSrc = '/mascot-mask.png';
        statusColor = 'bg-orange-500';
    } else if (aqi > 50) {
        gradient = 'from-yellow-700 to-slate-800';
        mascotSrc = '/mascot-happy.png';
        statusColor = 'bg-yellow-500';
    }

    // Weather Helper
    const getWeatherIcon = (code) => {
        // Simplified check
        if (code <= 3) return "Clear/Cloudy";
        if (code < 70) return "Rainy";
        return "Stormy";
    };

    return (
        <div className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-br ${gradient} p-6 md:p-10 shadow-2xl mb-8 transition-colors duration-1000 min-h-[400px] flex flex-col justify-center`}>

            {/* Background Texture/Skyline */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48 bg-contain bg-bottom bg-repeat-x opacity-20 pointer-events-none"
                style={{ backgroundImage: 'url("/city-skyline.png")' }}
            />

            {/* Fog Overlay for high AQI */}
            {aqi > 150 && (
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none animate-fog-flow"
                    style={{ background: 'linear-gradient(to right, transparent, white, transparent)', backgroundSize: '200% 100%' }}
                />
            )}

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* LEFT: AQI Data */}
                <div className="flex-1 text-center md:text-left z-20">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="relative flex h-3 w-3">
                            <span className={`${statusColor} animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                            <span className={`${statusColor} relative inline-flex rounded-full h-3 w-3`}></span>
                        </span>
                        <span className="font-semibold text-white/80 uppercase tracking-wider text-sm">Live AQI • {location}</span>
                    </div>

                    <div className="flex items-baseline justify-center md:justify-start gap-4">
                        <h1 className="text-8xl md:text-9xl font-bold text-white tracking-tighter" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            {aqi}
                        </h1>
                        <div className="text-left">
                            <div className="text-xl text-white/60">US AQI</div>
                        </div>
                    </div>

                    <div className={`inline-block px-6 py-2 rounded-full ${statusColor} text-white font-bold text-xl mb-6 shadow-lg`}>
                        {advisory.status}
                    </div>

                    <div className="flex gap-8 justify-center md:justify-start text-white/90">
                        <div>
                            <div className="text-sm opacity-70">PM2.5</div>
                            <div className="text-2xl font-bold">{pm2_5}</div>
                            <div className="text-xs opacity-50">µg/m³</div>
                        </div>
                        <div>
                            <div className="text-sm opacity-70">PM10</div>
                            <div className="text-2xl font-bold">{pm10}</div>
                            <div className="text-xs opacity-50">µg/m³</div>
                        </div>
                    </div>
                </div>

                {/* CENTER: Mascot Image */}
                {/* Positioned absolutely on desktop to sit at bottom, relative on mobile */}
                <div className="md:absolute md:bottom-[-40px] md:left-1/2 md:-translate-x-1/2 z-10 w-64 md:w-80 transition-transform hover:scale-105 duration-300">
                    <img
                        src={mascotSrc}
                        alt="Mascot"
                        className={`w-full h-full object-contain filter drop-shadow-2xl ${aqi > 200 ? 'animate-shake' : 'animate-bounce-slow'}`}
                    />
                </div>

                {/* RIGHT: Weather Widget (Glassmorphism) */}
                <div className="w-full md:w-80 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-white shadow-xl z-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all" />

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-4xl font-bold mb-1">{Math.round(temp || 0)}°C</div>
                            <div className="text-sm opacity-80">{getWeatherIcon(weatherCode || 0)}</div>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Sun className="text-yellow-300" size={28} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Droplets size={18} className="text-blue-300" />
                            <div className="flex-1 flex justify-between text-sm">
                                <span className="opacity-70">Humidity</span>
                                <span className="font-semibold">{Math.round(humidity || 0)}%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Wind size={18} className="text-cyan-300" />
                            <div className="flex-1 flex justify-between text-sm">
                                <span className="opacity-70">Wind</span>
                                <span className="font-semibold">{Math.round(windSpeed || 0)} km/h</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Range Bar Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 via-red-500 to-purple-800 opacity-80" />
            <div
                className="absolute bottom-0 h-4 w-1 bg-white shadow-[0_0_10px_white] z-30 transition-all duration-1000"
                style={{ left: `${Math.min(aqi / 350 * 100, 100)}%` }}
            />
        </div>
    );
};

export default DashboardHero;
