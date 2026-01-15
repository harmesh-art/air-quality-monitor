import React from 'react';
import { PersonStanding, Bike, Wind, Fan, DoorOpen } from 'lucide-react';

const ActivityItem = ({ icon: Icon, label, allowed, reason }) => (
    <div className={`p-4 rounded-xl flex items-center gap-4 transition-all ${allowed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
        <div className={`p-2 rounded-lg ${allowed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{label}</h4>
            <p className="text-xs text-muted">{reason}</p>
        </div>
        <div className={`text-2xl font-bold ${allowed ? 'text-green-500' : 'text-red-500'}`}>
            {allowed ? '✓' : '×'}
        </div>
    </div>
);

const ActivityGuide = ({ aqi }) => {
    const getActivities = (aqi) => {
        if (aqi <= 50) {
            return [
                { icon: PersonStanding, label: "Outdoor Walk", allowed: true, reason: "Perfect conditions for a stroll." },
                { icon: Bike, label: "Outdoor Exercise", allowed: true, reason: "Great for intense cardio." },
                { icon: DoorOpen, label: "Open Windows", allowed: true, reason: "Let the fresh air in." },
                { icon: Fan, label: "Air Purifier", allowed: false, reason: "Not necessary right now." },
            ];
        } else if (aqi <= 100) {
            return [
                { icon: PersonStanding, label: "Outdoor Walk", allowed: true, reason: "Generally safe for most." },
                { icon: Bike, label: "Outdoor Exercise", allowed: true, reason: "Acceptable, monitor breathing." },
                { icon: DoorOpen, label: "Open Windows", allowed: true, reason: "Fine for short durations." },
                { icon: Fan, label: "Air Purifier", allowed: false, reason: "Optional for sensitive groups." },
            ];
        } else if (aqi <= 150) {
            return [
                { icon: PersonStanding, label: "Outdoor Walk", allowed: true, reason: "Limit for sensitive groups." },
                { icon: Bike, label: "Outdoor Exercise", allowed: false, reason: "Better to hit the gym indoors." },
                { icon: DoorOpen, label: "Open Windows", allowed: false, reason: "Keep them closed." },
                { icon: Fan, label: "Air Purifier", allowed: true, reason: "Recommended." },
            ];
        } else {
            return [
                { icon: PersonStanding, label: "Outdoor Walk", allowed: false, reason: "Stay indoors if possible." },
                { icon: Bike, label: "Outdoor Exercise", allowed: false, reason: "Dangerous, avoid outdoors." },
                { icon: DoorOpen, label: "Open Windows", allowed: false, reason: "Strictly keep closed." },
                { icon: Fan, label: "Air Purifier", allowed: true, reason: "Highly recommended." },
            ];
        }
    };

    const activities = getActivities(aqi);

    return (
        <div className="glass-panel p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-6">Activity Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((activity, idx) => (
                    <ActivityItem key={idx} {...activity} />
                ))}
            </div>
        </div>
    );
};

export default ActivityGuide;
