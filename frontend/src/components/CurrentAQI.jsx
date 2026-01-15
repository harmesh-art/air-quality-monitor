import React from 'react';
import { Wind } from 'lucide-react';

const CurrentAQI = ({ aqi, status, color, location }) => {
    return (
        <div className="glass-panel current-aqi-panel animate-fade-in">
            <div
                className="aqi-glow"
                style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
            />

            <div className="relative z-10">
                <div className="flex-center gap-2 mb-4 text-muted">
                    <Wind size={20} />
                    <span className="uppercase text-sm font-semibold">Air Quality Index</span>
                </div>

                <div className="aqi-value" style={{ color: color, textShadow: `0 0 30px ${color}40` }}>
                    {aqi}
                </div>

                <div className="aqi-status" style={{ color: color }}>
                    {status}
                </div>

                <div className="text-xl font-medium mt-1 mb-2 opacity-90">
                    {location}
                </div>

                <p className="text-sm opacity-70 mt-2 max-w-xs mx-auto">
                    Scale: US AQI Standard
                </p>
            </div>
        </div>
    );
};

export default CurrentAQI;
