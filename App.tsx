import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Heart,
  Sparkles,
} from 'lucide-react';
import { CityResult, FullWeatherData, TempUnit, SpeedUnit, PrecipUnit } from './types';
import { fetchWeatherForCity } from './services/weatherApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FavoriteCities } from './components/FavoriteCities';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { Daily7DayForecast } from './components/Daily7DayForecast';
import { OutdoorPlanningCard } from './components/OutdoorPlanningCard';
import { WeatherStatsGrid } from './components/WeatherStatsGrid';

const DEFAULT_CITY: CityResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  country_code: 'GB',
  timezone: 'Europe/London',
};

export default function App() {
  const [city, setCity] = useState<CityResult>(() => {
    try {
      const saved = localStorage.getItem('weather_last_city');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CITY;
  });

  const [weather, setWeather] = useState<FullWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Units
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh');
  const [precipUnit, setPrecipUnit] = useState<PrecipUnit>('mm');

  const handleToggleUnits = (unit: TempUnit) => {
    setTempUnit(unit);
    if (unit === 'F') {
      setSpeedUnit('mph');
      setPrecipUnit('inch');
    } else {
      setSpeedUnit('kmh');
      setPrecipUnit('mm');
    }
  };

  const loadWeatherData = useCallback(async (targetCity: CityResult, showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherForCity(targetCity);
      setWeather(data);
      setCity(targetCity);
      try {
        localStorage.setItem('weather_last_city', JSON.stringify(targetCity));
      } catch {
        // ignore
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather forecast data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(city);
  }, []);

  const handleSelectCity = (newCity: CityResult) => {
    loadWeatherData(newCity);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500 selection:text-white transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-400 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-500 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-amber-300 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Navigation */}
        <Header
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          precipUnit={precipUnit}
          onToggleUnits={handleToggleUnits}
          onRefresh={() => loadWeatherData(city, true)}
          isRefreshing={isRefreshing}
          lastUpdated={weather?.lastUpdated}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Top Search & Favorites Bar */}
          <div className="space-y-3">
            <SearchBar onSelectCity={handleSelectCity} isLoading={isLoading} />
            <FavoriteCities currentCity={city} onSelectCity={handleSelectCity} />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 sm:p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Weather Fetch Error</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={() => loadWeatherData(city)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          )}

          {/* Initial Loading Skeleton */}
          {isLoading && !weather && (
            <div className="space-y-6 animate-pulse">
              <div className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            </div>
          )}

          {/* Main Weather Intelligence Dashboard */}
          {weather && (
            <div className="space-y-6 sm:space-y-8">
              {/* Current Weather Highlights Card */}
              <CurrentWeatherCard
                weather={weather}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
                precipUnit={precipUnit}
              />

              {/* Outdoor Planning & Advice */}
              <OutdoorPlanningCard weather={weather} />

              {/* 24-Hour Forecast Interactive Recharts Chart */}
              <HourlyForecastChart
                hourly={weather.hourly}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
                precipUnit={precipUnit}
              />

              {/* 7-Day Extended Forecast */}
              <Daily7DayForecast
                daily={weather.daily}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
                precipUnit={precipUnit}
              />

              {/* Secondary Atmospheric Indicators Grid */}
              <WeatherStatsGrid
                weather={weather}
                speedUnit={speedUnit}
                tempUnit={tempUnit}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 py-6 bg-white/60 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
                IQ
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">AtmosphereIQ</span>
              <span>— Powered by</span>
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Open-Meteo API <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>Real-time WMO Weather Conditions</span>
              <span>•</span>
              <span>Free Geocoding & High-Resolution Forecasts</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
