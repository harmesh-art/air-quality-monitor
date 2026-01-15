import React from 'react';

const PollutantCard = ({ name, value, unit, description, color }) => {
    return (
        <div className="glass-panel p-6 pollutant-card animate-fade-in">
            <div className="flex-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">{name}</h3>
                <span className="unit-badge">{unit}</span>
            </div>
            <div className="pollutant-value" style={{ color: color }}>
                {value}
            </div>
            <p className="text-xs text-muted mt-2 opacity-70 leading-tight">
                {description}
            </p>
        </div>
    );
};

export default PollutantCard;
