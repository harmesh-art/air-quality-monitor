import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-3 border-none !bg-slate-900/90">
                <p className="text-sm font-semibold mb-1 text-white">{format(new Date(label), 'h:mm a')}</p>
                <p className="text-sm text-blue-400 font-bold">
                    AQI: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

const ForecastChart = ({ hourlyData }) => {
    if (!hourlyData) return null;

    // Transform data for Recharts
    const data = hourlyData.time.map((time, index) => ({
        time: time,
        aqi: hourlyData.us_aqi[index]
    }));

    // Filter to show next 24 hours starting from now (simplification as API returns whole days)
    const now = new Date();
    const futureData = data.filter(d => new Date(d.time) >= now).slice(0, 24);

    return (
        <div className="glass-panel p-6 animate-fade-in col-span-2">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold">24-Hour Forecast</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Predictive
                </span>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={futureData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            tickFormatter={(str) => format(new Date(str), 'ha')}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="aqi"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAqi)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ForecastChart;
