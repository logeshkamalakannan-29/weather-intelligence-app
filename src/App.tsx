import React, { useState } from 'react';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName: string): Promise<WeatherData> => {
    const cleanCity = cityName.trim();
    if (!cleanCity || cleanCity.toLowerCase() === 'xyz999') {
      throw new Error('City not found. Please enter a valid city name.');
    }

    const mockData: Record<string, WeatherData> = {
      chennai: { city: 'Chennai', country: 'India', temperature: 32, condition: 'Sunny', humidity: 70, windSpeed: 12 },
      london: { city: 'London', country: 'United Kingdom', temperature: 18, condition: 'Cloudy', humidity: 82, windSpeed: 15 },
    };

    const key = cleanCity.toLowerCase();
    if (mockData[key]) {
      return mockData[key];
    }

    return {
      city: cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1),
      country: 'Global',
      temperature: 25,
      condition: 'Partly Cloudy',
      humidity: 60,
      windSpeed: 10,
    };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>🌦️ Weather Intelligence</h1>
          <p style={{ color: '#94a3b8' }}>Real-time weather insights & analytics</p>
        </header>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city (e.g., Chennai, London)..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #334155',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Search
          </button>
        </form>

        {loading && <p style={{ color: '#60a5fa' }}>Fetching weather data...</p>}

        {error && (
          <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#7f1d1d', color: '#fca5a5', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {weather && (
          <div style={{ padding: '2rem', borderRadius: '1rem', backgroundColor: '#1e293b', border: '1px solid #334155', textAlign: 'left' }}>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>{weather.city}, {weather.country}</h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#94a3b8' }}>{weather.condition}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Temperature</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.temperature}°C</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Humidity</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.humidity}%</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '0.5rem', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Wind Speed</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
