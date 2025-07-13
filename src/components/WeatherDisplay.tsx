import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, Eye } from 'lucide-react';
import { WeatherData, WEATHER_CODES } from '../types/weather';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  picnicDate: string;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, picnicDate }) => {
  const picnicDay = weatherData.daily.find(day => day.date === picnicDate);
  const currentWeather = WEATHER_CODES[weatherData.current.weatherCode] || { description: 'Unknown', icon: '❓' };
  
  if (!picnicDay) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-700">
          <Cloud className="w-5 h-5" />
          <span className="font-medium">Weather data not available for selected date</span>
        </div>
      </div>
    );
  }

  const picnicWeather = WEATHER_CODES[picnicDay.weatherCode] || { description: 'Unknown', icon: '❓' };
  const isToday = picnicDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Weather Forecast</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {isToday ? 'Today' : new Date(picnicDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{picnicWeather.icon}</div>
          <div className="text-lg font-medium text-gray-900 mb-1">{picnicWeather.description}</div>
          <div className="text-3xl font-bold text-gray-900">
            {picnicDay.temperatureMax}°C
          </div>
          <div className="text-sm text-gray-600">
            Low: {picnicDay.temperatureMin}°C
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Precipitation</div>
              <div className="font-medium text-gray-900">{picnicDay.precipitationProbability}%</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Wind className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Wind Speed</div>
              <div className="font-medium text-gray-900">{picnicDay.windSpeedMax} km/h</div>
            </div>
          </div>

          {isToday && (
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Humidity</div>
                <div className="font-medium text-gray-900">{weatherData.current.humidity}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="space-y-2">
        {picnicDay.precipitationProbability > 70 && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-600">⚠️</span>
            <span className="text-red-700 text-sm font-medium">High chance of rain - consider backup plans</span>
          </div>
        )}
        
        {picnicDay.temperatureMax > 30 && (
          <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="text-orange-600">🌡️</span>
            <span className="text-orange-700 text-sm font-medium">Hot weather - bring extra water and shade</span>
          </div>
        )}
        
        {picnicDay.windSpeedMax > 20 && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-600">💨</span>
            <span className="text-blue-700 text-sm font-medium">Windy conditions - secure lightweight items</span>
          </div>
        )}

        {picnicDay.precipitationProbability < 20 && picnicDay.temperatureMax > 15 && picnicDay.temperatureMax < 28 && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-600">✅</span>
            <span className="text-green-700 text-sm font-medium">Perfect picnic weather!</span>
          </div>
        )}
      </div>

      {/* 7-Day Forecast */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">7-Day Forecast</h4>
        <div className="grid grid-cols-7 gap-2">
          {weatherData.daily.slice(0, 7).map((day, index) => {
            const dayWeather = WEATHER_CODES[day.weatherCode] || { description: 'Unknown', icon: '❓' };
            const date = new Date(day.date);
            const isSelected = day.date === picnicDate;
            
            return (
              <div 
                key={day.date} 
                className={`text-center p-2 rounded-lg ${
                  isSelected ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50'
                }`}
              >
                <div className="text-xs text-gray-600 mb-1">
                  {index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg mb-1">{dayWeather.icon}</div>
                <div className="text-xs font-medium text-gray-900">
                  {day.temperatureMax}°
                </div>
                <div className="text-xs text-gray-500">
                  {day.temperatureMin}°
                </div>
                {day.precipitationProbability > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    {day.precipitationProbability}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};