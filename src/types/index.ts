export type ThemeMode = "light" | "dark" | "system";
export type TemperatureUnit = "C" | "F";
export type Language = "pt-BR" | "en-US" | "es";

export interface GeoResult {
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  visibilityKm: number | null;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  uvIndexMax: number | null;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  location: GeoResult;
  current: CurrentWeather;
  forecast: ForecastDay[];
  airQuality: number | null;
}
