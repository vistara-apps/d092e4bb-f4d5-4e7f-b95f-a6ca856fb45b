import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const type = searchParams.get('type') || 'current'; // 'current' or 'forecast'

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    let endpoint: string;
    let params: any = {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units: 'metric'
    };

    if (type === 'forecast') {
      endpoint = `${BASE_URL}/forecast`;
      params.cnt = 40; // 5 days of 3-hourly forecasts
    } else {
      endpoint = `${BASE_URL}/weather`;
    }

    const response = await axios.get(endpoint, { params });

    // Transform the data to match our internal format
    const transformedData = transformWeatherData(response.data, type);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

function transformWeatherData(data: any, type: string) {
  if (type === 'forecast') {
    return {
      location: {
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      city: data.city.name,
      country: data.city.country,
      forecast: data.list.map((item: any) => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        precipitation: item.rain?.['3h'] || 0,
        precipitationProbability: item.pop * 100,
        weather: item.weather[0].main,
        description: item.weather[0].description,
        windSpeed: item.wind?.speed || 0,
        pressure: item.main.pressure
      }))
    };
  } else {
    return {
      location: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      city: data.name,
      country: data.sys.country,
      current: {
        timestamp: new Date(data.dt * 1000),
        temperature: data.main.temp,
        humidity: data.main.humidity,
        precipitation: data.rain?.['1h'] || 0,
        weather: data.weather[0].main,
        description: data.weather[0].description,
        windSpeed: data.wind?.speed || 0,
        pressure: data.main.pressure,
        visibility: data.visibility,
        cloudCover: data.clouds?.all || 0
      }
    };
  }
}

