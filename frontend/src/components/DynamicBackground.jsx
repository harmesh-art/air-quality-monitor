import React from 'react';

const DynamicBackground = ({ aqi }) => {
    let gradient = 'from-blue-900 to-slate-900'; // Default night/dark
    let fogOpacity = 0;

    if (aqi <= 50) {
        gradient = 'from-emerald-900 to-slate-900';
    } else if (aqi <= 100) {
        gradient = 'from-yellow-900/40 to-slate-900';
    } else if (aqi <= 150) {
        gradient = 'from-orange-900/50 to-slate-900';
        fogOpacity = 0.2;
    } else if (aqi <= 200) {
        gradient = 'from-red-900/60 to-gray-900';
        fogOpacity = 0.5;
    } else if (aqi <= 300) {
        gradient = 'from-purple-900/70 to-gray-900';
        fogOpacity = 0.7;
    } else {
        gradient = 'from-rose-950 to-gray-950'; // Hazardous
        fogOpacity = 0.9;
    }

    return (
        <div className={`fixed inset-0 -z-10 transition-colors duration-1000 bg-gradient-to-b ${gradient}`}>
            {/* Fog Layer */}
            <div
                className="absolute inset-0 bg-repeat-x animate-fog-flow pointer-events-none"
                style={{
                    backgroundImage: 'url("https://raw.githubusercontent.com/hosting-assets/fog-texture/main/fog1.png")', // Using a generic fog texture or CSS noise later if image fails. For now, let's use CSS gradient transparency/noise simulation if possible.
                    // Actually, let's use CSS only for reliability.
                    background: `linear-gradient(to right, transparent, rgba(200,200,200,${fogOpacity * 0.5}), transparent)`,
                    backgroundSize: '200% 100%',
                    opacity: fogOpacity
                }}
            />

            {/* City Skyline */}
            <div
                className="absolute bottom-0 left-0 right-0 h-64 bg-contain bg-bottom bg-repeat-x opacity-40 pointer-events-none"
                style={{ backgroundImage: 'url("/city-skyline.png")' }}
            />

            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
    );
};

export default DynamicBackground;
