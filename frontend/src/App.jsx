import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentAQI from './components/CurrentAQI';
import WeatherWidget from './components/WeatherWidget';
import PollutantCard from './components/PollutantCard';
import AdvisoryPanel from './components/AdvisoryPanel';
import ForecastChart from './components/ForecastChart';
import ActivityGuide from './components/ActivityGuide';
import AQIMap from './components/AQIMap';
import { fetchCoordinates, fetchAirQuality, fetchUserLocation, reverseGeocode } from './services/api';
import { getAdvisory } from './utils/advisoryEngine';
import { Loader2 } from 'lucide-react';

function App() {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleLocate();
  }, []);

  useEffect(() => {
    if (location) {
      loadData();
    }
  }, [location]);

  const loadData = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const { current, hourly } = await fetchAirQuality(location.lat, location.lon);
      setData(current);
      setHourlyData(hourly);

      // Calculate advisory
      const currentAQI = current.us_aqi;
      const pollutants = {
        pm25: current.pm2_5,
        pm10: current.pm10
      };

      const advice = getAdvisory(currentAQI, pollutants);
      setAdvisory(advice);
    } catch (err) {
      console.error(err);
      setError('Failed to load air quality data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city) => {
    setLoading(true);
    try {
      const coords = await fetchCoordinates(city);
      setLocation({
        name: coords.name,
        country: coords.country,
        lat: coords.latitude,
        lon: coords.longitude
      });
    } catch (err) {
      setError('City not found. Please try another location.');
      setLoading(false);
    }
  };

  const handleLocate = async () => {
    setLoading(true);
    try {
      const coords = await fetchUserLocation();

      // Parallelize requests to backend (Reverse Geo + AQI Data)
      // This saves time compared to sequential await
      const [locationInfo, aqiData] = await Promise.all([
        reverseGeocode(coords.latitude, coords.longitude),
        fetchAirQuality(coords.latitude, coords.longitude)
      ]);

      // 1. Set location state
      setLocation({
        name: locationInfo.name,
        country: locationInfo.country,
        lat: coords.latitude,
        lon: coords.longitude
      });

      // 2. Set Data state immediately (avoids needing to re-fetch in useEffect)
      setData(aqiData.current);
      setHourlyData(aqiData.hourly);

      // 3. Calculate advisory
      const currentAQI = aqiData.current.us_aqi;
      const pollutants = {
        pm25: aqiData.current.pm2_5,
        pm10: aqiData.current.pm10
      };

      const advice = getAdvisory(currentAQI, pollutants);
      setAdvisory(advice);

    } catch (err) {
      console.warn("Location access denied or failed, defaulting to New York");
      setLocation({ name: 'New York', lat: 40.71, lon: -74.01 });
      // The useEffect will handle the fallback data load for New York
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container relative min-h-screen">

      <header className="mb-8 text-center pt-8 relative z-10">
        <h1 className="text-white mb-2">Air Quality <span className="text-muted">Monitor</span></h1>
        <p className="text-muted">Real-time insights for a healthier life.</p>
      </header>

      <SearchBar onSearch={handleSearch} onLocate={handleLocate} isLoading={loading} />

      {error && (
        <div className="glass-panel p-4 mb-8 border-red-500/50 bg-red-500/10 text-center text-white">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex-center py-20 text-muted">
          <Loader2 className="animate-spin" size={48} />
        </div>
      )}

      {!loading && data && advisory && (
        <>
          <div className="main-grid animate-fade-in relative z-10">
            {/* Split View: AQI + Weather */}
            <div className="grid-cols-2 mb-8">
              <CurrentAQI
                aqi={data.us_aqi}
                status={advisory.status}
                color={advisory.colorVar}
                location={location?.name}
              />
              <WeatherWidget
                temp={data.temperature_2m}
                humidity={data.relative_humidity_2m}
                windSpeed={data.wind_speed_10m}
                weatherCode={data.weather_code}
              />
            </div>


            <div className="mb-8">
              <AdvisoryPanel advisory={advisory} />
            </div>

            <div className="mb-8">
              <AQIMap
                centerLat={location.lat}
                centerLon={location.lon}
                centerAqi={data.us_aqi}
              />
            </div>

            <div className="grid-cols-2 mb-8">
              <ForecastChart hourlyData={hourlyData} />
            </div>

            <div className="mb-8">
              <ActivityGuide aqi={data.us_aqi} />
            </div>

            <h3 className="mb-4 text-white opacity-90">Pollutant Breakdown</h3>
            <div className="grid-pollutants mb-8">
              <PollutantCard
                name="PM 2.5"
                value={data.pm2_5}
                unit="µg/m³"
                color={advisory.colorVar}
                description="Fine particles capable of entering bloodstream."
              />
              <PollutantCard
                name="PM 10"
                value={data.pm10}
                unit="µg/m³"
                color={advisory.colorVar}
                description="Inhalable particles contributing to haze."
              />
              <PollutantCard
                name="NO₂"
                value={data.nitrogen_dioxide}
                unit="µg/m³"
                color="var(--color-text-main)"
                description="From vehicle emissions."
              />
              <PollutantCard
                name="O₃"
                value={data.ozone}
                unit="µg/m³"
                color="var(--color-text-main)"
                description="Ground-level ozone."
              />
            </div>

            <div className="text-center text-muted text-xs pb-8">
              Data provided by Open-Meteo • Location: {location.name} {location.country ? `, ${location.country}` : ''}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
