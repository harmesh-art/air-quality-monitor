import React from 'react';

const Mascot = ({ aqi }) => {
    let imageSrc = '/mascot-happy.png';
    let animationClass = 'animate-bounce-slow';

    if (aqi <= 50) {
        imageSrc = '/mascot-happy.png';
    } else if (aqi <= 100) {
        imageSrc = '/mascot-happy.png'; // Moderate is still okay for most
    } else if (aqi <= 200) {
        imageSrc = '/mascot-mask.png';
        animationClass = 'animate-pulse-slow';
    } else {
        imageSrc = '/mascot-hazardous.png';
        animationClass = 'animate-shake';
    }

    return (
        <div className={`fixed bottom-0 left-10 w-48 h-48 z-10 hidden md:block transition-all duration-500 ${animationClass}`}>
            <img
                src={imageSrc}
                alt="Air Quality Mascot"
                className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
            />
        </div>
    );
};

export default Mascot;
