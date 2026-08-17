import type { GeoResult, WeatherData } from "../types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

function sanitizeQuery(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeGeoResult(payload: Record<string, unknown>): GeoResult | null {
  const name = toStringValue(payload.name);
  const country = toStringValue(payload.country) ?? "Unknown";
  const countryCode = toStringValue(payload.country_code) ?? "N/A";
  const latitude = toFiniteNumber(payload.latitude);
  const longitude = toFiniteNumber(payload.longitude);
  const timezone = toStringValue(payload.timezone) ?? "auto";

  if (!name || latitude === null || longitude === null) {
    return null;
  }

  return {
    name,
    country,
    countryCode,
    admin1: toStringValue(payload.admin1) ?? undefined,
    latitude,
    longitude,
    timezone,
  };
}

export async function searchCityByName(name: string): Promise<GeoResult | null> {
  const query = sanitizeQuery(name);

  if (!query) {
    return null;
  }

  const url = new URL(`${GEOCODING_URL}/search`);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { results?: Record<string, unknown>[] };
  const result = payload.results?.[0];

  if (!result) {
    return null;
  }

  return normalizeGeoResult(result);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeoResult | null> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  try {
    const url = new URL(`${GEOCODING_URL}/reverse`);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { results?: Record<string, unknown>[] };
    const result = payload.results?.[0];

    if (!result) {
      return null;
    }

    return normalizeGeoResult(result);
  } catch {
    return null;
  }
}

async function fetchAirQuality(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<number | null> {
  const url = new URL(AIR_QUALITY_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("timezone", timezone || "auto");
  url.searchParams.set("current", "us_aqi");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      current?: { us_aqi?: number | null };
    };

    const value = payload.current?.us_aqi;
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export async function fetchWeatherForLocation(location: GeoResult): Promise<WeatherData | null> {
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const timezone = location.timezone || "auto";

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("timezone", timezone);
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,is_day,weather_code,wind_speed_10m,wind_direction_10m,precipitation,visibility",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max",
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      current?: Record<string, unknown>;
      daily?: {
        time?: unknown[];
        weather_code?: unknown[];
        temperature_2m_max?: unknown[];
        temperature_2m_min?: unknown[];
        sunrise?: unknown[];
        sunset?: unknown[];
        uv_index_max?: unknown[];
        precipitation_probability_max?: unknown[];
      };
      timezone?: string;
    };

    const current = payload.current;
    const daily = payload.daily;

    if (!current || !daily) {
      return null;
    }

    const airQuality = await fetchAirQuality(
      latitude,
      longitude,
      timezone || payload.timezone || "auto",
    );

    const timeValue = toStringValue(current.time) ?? new Date().toISOString();
    const temperature = toFiniteNumber(current.temperature_2m);
    const apparentTemperature = toFiniteNumber(current.apparent_temperature);
    const humidity = toFiniteNumber(current.relative_humidity_2m);
    const precipitationProbability = toFiniteNumber(current.precipitation_probability);
    const precipitation = toFiniteNumber(current.precipitation);
    const windSpeed = toFiniteNumber(current.wind_speed_10m);
    const windDirection = toFiniteNumber(current.wind_direction_10m);
    const weatherCode = toFiniteNumber(current.weather_code);
    const isDay = Number(current.is_day) === 1;
    const visibilityKm = toFiniteNumber(current.visibility);

    if (
      temperature === null ||
      apparentTemperature === null ||
      humidity === null ||
      precipitationProbability === null ||
      windSpeed === null ||
      windDirection === null ||
      weatherCode === null
    ) {
      return null;
    }

    const forecast = (daily.time ?? []).map((dateValue, index) => {
      const date = toStringValue(dateValue) ?? "";
      const code = toFiniteNumber(daily.weather_code?.[index]) ?? 0;
      const max = toFiniteNumber(daily.temperature_2m_max?.[index]);
      const min = toFiniteNumber(daily.temperature_2m_min?.[index]);
      const sunrise = toStringValue(daily.sunrise?.[index]) ?? "00:00";
      const sunset = toStringValue(daily.sunset?.[index]) ?? "00:00";
      const uvIndex = toFiniteNumber(daily.uv_index_max?.[index]);
      const precipitationChance = toFiniteNumber(daily.precipitation_probability_max?.[index]) ?? 0;

      return {
        date,
        dayName: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        weatherCode: code,
        temperatureMax: max ?? 0,
        temperatureMin: min ?? 0,
        precipitationProbability: precipitationChance,
        uvIndexMax: uvIndex,
        sunrise,
        sunset,
      };
    });

    return {
      location,
      airQuality,
      current: {
        time: timeValue,
        temperature,
        apparentTemperature,
        humidity,
        precipitationProbability,
        precipitation: precipitation ?? 0,
        windSpeed,
        windDirection,
        weatherCode,
        isDay,
        visibilityKm,
      },
      forecast,
    };
  } catch {
    return null;
  }
}
