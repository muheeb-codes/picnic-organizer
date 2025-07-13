import { WeatherData, WEATHER_CODES } from '../types/weather';

export class WeatherService {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast';

  static async getWeatherData(lat: number, lng: number, date?: string): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max',
        timezone: 'auto',
        forecast_days: '7'
      });

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        params.append('start_date', startDate.toISOString().split('T')[0]);
        params.append('end_date', endDate.toISOString().split('T')[0]);
      }

      const response = await fetch(`${this.BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1
        },
        daily: data.daily.time.map((date: string, index: number) => ({
          date,
          temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
          temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
          precipitationProbability: data.daily.precipitation_probability_max[index] || 0,
          weatherCode: data.daily.weather_code[index],
          windSpeedMax: Math.round(data.daily.wind_speed_10m_max[index] * 10) / 10
        }))
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  static getWeatherDescription(weatherCode: number): { description: string; icon: string } {
    return WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: '❓' };
  }

  static generateWeatherTips(weatherData: WeatherData, picnicDate: string): string[] {
    const tips: string[] = [];
    const picnicDay = weatherData.daily.find(day => day.date === picnicDate);
    
    if (!picnicDay) {
      tips.push('Check the weather forecast closer to your picnic date');
      return tips;
    }

    const weather = this.getWeatherDescription(picnicDay.weatherCode);
    
    // Temperature tips
    if (picnicDay.temperatureMax > 30) {
      tips.push('🌡️ Hot day expected - bring extra water, sunscreen, and seek shade');
      tips.push('🧊 Pack plenty of ice to keep food and drinks cold');
    } else if (picnicDay.temperatureMax < 15) {
      tips.push('🧥 Cool weather - bring warm layers and blankets');
      tips.push('☕ Consider bringing hot drinks in thermoses');
    } else {
      tips.push('🌡️ Pleasant temperature expected - perfect for outdoor activities');
    }

    // Precipitation tips
    if (picnicDay.precipitationProbability > 70) {
      tips.push('☔ High chance of rain - consider rescheduling or have indoor backup plans');
      tips.push('🏠 Bring a large tarp or pop-up tent for shelter');
    } else if (picnicDay.precipitationProbability > 30) {
      tips.push('🌦️ Possible rain - pack a pop-up tent or umbrella just in case');
    }

    // Wind tips
    if (picnicDay.windSpeedMax > 20) {
      tips.push('💨 Windy conditions - secure lightweight items and consider wind-resistant activities');
      tips.push('🪁 Great weather for kite flying!');
    }

    // Weather-specific tips
    if (weather.description.includes('clear') || weather.description.includes('sunny')) {
      tips.push('☀️ Sunny day - perfect for outdoor games and activities');
      tips.push('🕶️ Don\'t forget sunglasses and hats');
    }

    if (weather.description.includes('cloudy')) {
      tips.push('☁️ Overcast conditions - comfortable for extended outdoor time');
    }

    return tips;
  }
}