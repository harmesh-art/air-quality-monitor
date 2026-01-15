import React from 'react';
import { Sparkles, Activity, ShieldAlert, HeartPulse } from 'lucide-react';

const AdvisoryPanel = ({ advisory }) => {
    if (!advisory) return null;

    return (
        <div className="glass-panel p-6 animate-fade-in advisory-panel">
            <div className="advisory-header border-b border-white/10 pb-4 mb-4">
                <div className="icon-box-gradient">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">AI Health Insights</h2>
                    <p className="text-xs text-muted">Real-time analysis & recommendations</p>
                </div>
            </div>

            <div className="advisory-content space-y-4">
                <div className="summary-box p-4 rounded-xl border-l-4" style={{ borderColor: advisory.colorVar }}>
                    <p className="text-lg leading-relaxed font-medium">
                        "{advisory.summary}"
                    </p>
                </div>

                <div className="grid-cols-2 gap-4">
                    <div className="risk-box">
                        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted mb-1">
                            <ShieldAlert size={16} /> Health Risks
                        </h4>
                        <p className="text-sm opacity-90">{advisory.healthRisks}</p>
                    </div>

                    <div className="precaution-box">
                        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted mb-1">
                            <HeartPulse size={16} /> Precautions
                        </h4>
                        <p className="text-sm opacity-90">{advisory.precaution}</p>
                    </div>
                </div>

                {advisory.pollutantInsights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted mb-2">
                            <Activity size={16} /> Specific Alerts
                        </h4>
                        <ul className="list-disc list-inside text-sm opacity-80">
                            {advisory.pollutantInsights.map((insight, idx) => (
                                <li key={idx} className="mb-1">{insight}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvisoryPanel;
