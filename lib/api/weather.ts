import axios from 'axios';
import { WeatherData, CurrentWeather, WeatherForecast, WeatherAlert, Location, ApiResponse } from '../types';

const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

if (!API_KEY) {
  console.warn('OpenWeatherMap API key not found. Weather features will not work.');
}

export class WeatherAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY || '';
  }

  /**
   * Get current weather data for a location
   */
  async getCurrentWeather(location: Location): Promise<ApiResponse<CurrentWeather>> {
    try {
      const response = await axios.get(`${OPENWEATHERMAP_BASE_URL}/weather`, {
        params: {
          lat: location.lat,
          lon: location.lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      const currentWeather: CurrentWeather = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        precipitation: data.rain?.['1h'] || 0,
        visibility: data.visibility,
        conditions: data.weather[0].description,
        timestamp: new Date(data.dt * 1000)
      };

      return { success: true, data: currentWeather };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return {
        success: false,
        error: 'Failed to fetch current weather data'
      };
    }
  }

  /**
   * Get weather forecast for a location
   */
  async getWeatherForecast(location: Location): Promise<ApiResponse<WeatherForecast[]>> {
    try {
      const response = await axios.get(`${OPENWEATHERMAP_BASE_URL}/forecast`, {
        params: {
          lat: location.lat,
          lon: location.lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const forecasts: WeatherForecast[] = response.data.list.map((item: any) => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        precipitation: item.rain?.['3h'] || 0,
        precipitationProbability: item.pop * 100,
        windSpeed: item.wind.speed,
        conditions: item.weather[0].description
      }));

      return { success: true, data: forecasts };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return {
        success: false,
        error: 'Failed to fetch weather forecast'
      };
    }
  }

  /**
   * Get comprehensive weather data including current and forecast
   */
  async getWeatherData(location: Location): Promise<ApiResponse<WeatherData>> {
    try {
      const [currentResult, forecastResult] = await Promise.all([
        this.getCurrentWeather(location),
        this.getWeatherForecast(location)
      ]);

      if (!currentResult.success || !forecastResult.success) {
        return {
          success: false,
          error: 'Failed to fetch complete weather data'
        };
      }

      const weatherData: WeatherData = {
        location,
        current: currentResult.data!,
        forecast: forecastResult.data!
      };

      return { success: true, data: weatherData };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        success: false,
        error: 'Failed to fetch weather data'
      };
    }
  }

  /**
   * Get historical weather data (requires paid plan)
   */
  async getHistoricalWeather(location: Location, date: Date): Promise<ApiResponse<any>> {
    try {
      const response = await axios.get(`${OPENWEATHERMAP_BASE_URL}/history/city`, {
        params: {
          lat: location.lat,
          lon: location.lon,
          dt: Math.floor(date.getTime() / 1000),
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return {
        success: false,
        error: 'Failed to fetch historical weather data'
      };
    }
  }

  /**
   * Calculate flood risk based on weather data
   */
  calculateFloodRisk(weatherData: WeatherData): number {
    const { current, forecast } = weatherData;

    // Simple risk calculation based on precipitation and forecast
    let riskScore = 0;

    // Current precipitation contributes to immediate risk
    if (current.precipitation > 10) riskScore += 30;
    else if (current.precipitation > 5) riskScore += 15;

    // Forecast precipitation over next 24 hours
    const next24Hours = forecast.filter(f =>
      f.timestamp.getTime() - Date.now() < 24 * 60 * 60 * 1000
    );

    const totalPrecipitation = next24Hours.reduce((sum, f) => sum + f.precipitation, 0);
    const avgProbability = next24Hours.reduce((sum, f) => sum + f.precipitationProbability, 0) / next24Hours.length;

    if (totalPrecipitation > 50) riskScore += 40;
    else if (totalPrecipitation > 25) riskScore += 20;

    if (avgProbability > 70) riskScore += 20;
    else if (avgProbability > 40) riskScore += 10;

    // Wind can contribute to storm surges
    if (current.windSpeed > 20) riskScore += 10;

    return Math.min(100, Math.max(0, riskScore));
  }

  /**
   * Get weather alerts if available
   */
  async getWeatherAlerts(location: Location): Promise<ApiResponse<WeatherAlert[]>> {
    // Note: OpenWeatherMap One Call API 3.0 provides alerts, but requires paid plan
    // This is a placeholder for when alerts are available
    try {
      // For now, return empty array as alerts require paid API access
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return {
        success: false,
        error: 'Failed to fetch weather alerts'
      };
    }
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPI();

