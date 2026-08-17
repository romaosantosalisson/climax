import "./styles.css";
import { fetchWeatherForLocation, reverseGeocode, searchCityByName } from "./api/openMeteo";
import { translations, getPreferredLanguage } from "./i18n";
import { getSavedTheme, getSavedUnit } from "./storage";
import { escapeHtml } from "./utils";
import { headerMarkup } from "./components/header";
import { searchMarkup } from "./components/search";
import { footerMarkup } from "./components/footer";
import type { Language, TemperatureUnit, ThemeMode, WeatherData } from "./types";

const app = document.querySelector<HTMLDivElement>("#app") as HTMLDivElement;

const weatherCodeMap: Record<number, Record<Language, string>> = {
  0: { "pt-BR": "Céu limpo", "en-US": "Clear sky", es: "Cielo despejado" },
  1: {
    "pt-BR": "Principalmente limpo",
    "en-US": "Mainly clear",
    es: "Mayormente despejado",
  },
  2: {
    "pt-BR": "Parcialmente nublado",
    "en-US": "Partly cloudy",
    es: "Parcialmente nublado",
  },
  3: { "pt-BR": "Nublado", "en-US": "Overcast", es: "Cubierto" },
  45: { "pt-BR": "Neblina", "en-US": "Fog", es: "Niebla" },
  48: { "pt-BR": "Neblina com gelo", "en-US": "Rime fog", es: "Niebla helada" },
  51: {
    "pt-BR": "Garoa leve",
    "en-US": "Light drizzle",
    es: "Llovizna ligera",
  },
  53: {
    "pt-BR": "Garoa moderada",
    "en-US": "Moderate drizzle",
    es: "Llovizna moderada",
  },
  55: {
    "pt-BR": "Garoa densa",
    "en-US": "Dense drizzle",
    es: "Llovizna intensa",
  },
  56: {
    "pt-BR": "Garoa gelada leve",
    "en-US": "Light freezing drizzle",
    es: "Llovizna helada ligera",
  },
  57: {
    "pt-BR": "Garoa gelada intensa",
    "en-US": "Dense freezing drizzle",
    es: "Llovizna helada intensa",
  },
  61: { "pt-BR": "Chuva leve", "en-US": "Light rain", es: "Lluvia ligera" },
  63: {
    "pt-BR": "Chuva moderada",
    "en-US": "Moderate rain",
    es: "Lluvia moderada",
  },
  65: { "pt-BR": "Chuva forte", "en-US": "Heavy rain", es: "Lluvia fuerte" },
  66: {
    "pt-BR": "Chuva gelada leve",
    "en-US": "Light freezing rain",
    es: "Lluvia helada ligera",
  },
  67: {
    "pt-BR": "Chuva gelada forte",
    "en-US": "Heavy freezing rain",
    es: "Lluvia helada fuerte",
  },
  71: { "pt-BR": "Neve leve", "en-US": "Light snow", es: "Nieve ligera" },
  73: {
    "pt-BR": "Neve moderada",
    "en-US": "Moderate snow",
    es: "Nieve moderada",
  },
  75: { "pt-BR": "Neve forte", "en-US": "Heavy snow", es: "Nieve fuerte" },
  77: {
    "pt-BR": "Grãos de neve",
    "en-US": "Snow grains",
    es: "Granizo de nieve",
  },
  80: {
    "pt-BR": "Pancadas leves",
    "en-US": "Light showers",
    es: "Lloviznas ligeras",
  },
  81: {
    "pt-BR": "Pancadas moderadas",
    "en-US": "Moderate showers",
    es: "Lloviznas moderadas",
  },
  82: {
    "pt-BR": "Pancadas violentas",
    "en-US": "Violent showers",
    es: "Lloviznas violentas",
  },
  85: {
    "pt-BR": "Neve leve",
    "en-US": "Light snow showers",
    es: "Nieve ligera",
  },
  86: {
    "pt-BR": "Neve forte",
    "en-US": "Heavy snow showers",
    es: "Nieve fuerte",
  },
  95: { "pt-BR": "Trovoada", "en-US": "Thunderstorm", es: "Tormenta" },
  96: {
    "pt-BR": "Trovoada com granizo leve",
    "en-US": "Thunderstorm with hail",
    es: "Tormenta con granizo",
  },
  99: {
    "pt-BR": "Trovoada com granizo forte",
    "en-US": "Heavy hailstorm",
    es: "Tormenta fuerte con granizo",
  },
};

const state: {
  weather: WeatherData | null;
  theme: ThemeMode;
  language: Language;
  unit: TemperatureUnit;
} = {
  weather: null,
  theme: getSavedTheme(),
  language: getPreferredLanguage(),
  unit: getSavedUnit(),
};

function getResolvedTheme(): Exclude<ThemeMode, "system"> {
  if (state.theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return state.theme;
}

function applyTheme(): void {
  const selected = getResolvedTheme();
  document.documentElement.dataset.theme = selected;

  // update theme toggle button icon
  const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (themeToggle) {
    const t = translations[state.language];
    // Display rules requested:
    // - when state.theme === 'dark' show sun icon (☀️)
    // - when state.theme === 'light' show moon icon (🌙)
    // - when state.theme === 'system' show computer icon (🖥️) — and represent the light theme via the toggle
    let icon = "🖥️";
    if (state.theme === "dark") icon = "☀️";
    else if (state.theme === "light") icon = "🌙";

    themeToggle.textContent = icon;
    // mark pressed when the resolved theme is dark
    themeToggle.setAttribute("aria-pressed", String(selected === "dark"));

    // update accessible label/title
    // For system, include the resolved theme in the label (e.g. "System (Dark)")
    const resolvedLabel = selected === "dark" ? t.dark : t.light;
    const readable =
      state.theme === "system"
        ? `${t.system} (${resolvedLabel})`
        : state.theme === "dark"
          ? `${t.dark}`
          : `${t.light}`;
    themeToggle.setAttribute("aria-label", `Theme: ${readable}`);
    themeToggle.title = readable;
  }
}

function setLanguage(language: Language): void {
  state.language = language;
  localStorage.setItem("climax-language", language);
  document.documentElement.lang = language;

  const languageSelect = document.querySelector<HTMLSelectElement>("#language-select");
  if (languageSelect) {
    languageSelect.value = language;
  }

  const searchInput = document.querySelector<HTMLInputElement>("#city-search");
  const searchLabel = document.querySelector<HTMLLabelElement>("#city-search-label");
  const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  const t = translations[language];
  const searchButton = document.querySelector<HTMLButtonElement>("#search-button");
  const footer = document.querySelector<HTMLElement>(".app-footer");
  if (searchInput) {
    searchInput.placeholder = t.placeholder;
    searchInput.setAttribute("aria-label", t.placeholder);
  }

  if (searchLabel) {
    searchLabel.textContent = t.placeholder;
  }

  if (searchButton) {
    searchButton.innerHTML = `🔎 <span>${escapeHtml(t.search)}</span>`;
    searchButton.setAttribute("aria-label", t.search);
  }
  if (footer) {
    footer.innerHTML = footerMarkup(language);
  }
  // update theme toggle label when language changes
  if (themeToggle) {
    applyTheme();
  }

  renderWeatherPanel();
}

function setUnit(unit: TemperatureUnit): void {
  state.unit = unit;
  localStorage.setItem("climax-temperature-unit", unit);

  const unitButton = document.querySelector<HTMLButtonElement>("#unit-toggle");
  if (unitButton) {
    unitButton.textContent = unit === "C" ? "°C" : "°F";
    unitButton.setAttribute("aria-pressed", unit === "F" ? "true" : "false");
  }

  renderWeatherPanel();
}

function formatTemperature(value: number): string {
  const converted = state.unit === "F" ? (value * 9) / 5 + 32 : value;
  return `${Math.round(converted)}°${state.unit}`;
}

function formatTemperatureValue(value: number): number {
  return state.unit === "F" ? (value * 9) / 5 + 32 : value;
}

function formatTime(dateValue: string, locale = state.language): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function formatDay(dateValue: string, locale = state.language): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(new Date(dateValue));
}

function formatFullDate(dateValue: string, locale = state.language): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

function getWeatherLabel(code: number): string {
  return weatherCodeMap[code]?.[state.language] ?? weatherCodeMap[0][state.language];
}

function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) {
    return isDay ? "☀️" : "🌙";
  }

  if ([1, 2, 3].includes(code)) {
    return "⛅";
  }

  if ([45, 48].includes(code)) {
    return "🌫️";
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "🌧️";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "❄️";
  }

  if ([95, 96, 99].includes(code)) {
    return "⛈️";
  }

  return "☁️";
}

function getAirQualityLabel(value: number | null): string {
  if (value === null) {
    return translations[state.language].noData;
  }

  if (value <= 50) {
    return translations[state.language].good;
  }

  if (value <= 100) {
    return translations[state.language].moderate;
  }

  if (value <= 150) {
    return translations[state.language].warning;
  }

  return translations[state.language].unhealthy;
}

function getCompassDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
}

function getStatusMessage(key: keyof (typeof translations)["pt-BR"]): string {
  return translations[state.language][key];
}

function showStatus(message: string, type: "info" | "error" | "success" = "info"): void {
  const statusEl = document.querySelector<HTMLElement>("#status-message");
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
}

function setSearchButtonLoading(isLoading: boolean): void {
  const button = document.querySelector<HTMLButtonElement>("#search-button");
  if (!button) {
    return;
  }

  const label = translations[state.language];
  button.classList.toggle("is-loading", isLoading);
  button.innerHTML = isLoading
    ? `<span class="button-spinner" aria-hidden="true"></span><span>${escapeHtml(label.searching)}</span>`
    : `<span aria-hidden="true">🔎</span><span>${escapeHtml(label.search)}</span>`;
  button.setAttribute("aria-label", isLoading ? label.searching : label.search);
}

function setGeoButtonLoading(isLoading: boolean): void {
  const button = document.querySelector<HTMLButtonElement>("#geo-button");
  if (!button) {
    return;
  }

  button.classList.toggle("is-loading", isLoading);
  button.innerHTML = isLoading ? `<span class="button-spinner" aria-hidden="true"></span>` : "📍";
  button.setAttribute(
    "aria-label",
    isLoading ? translations[state.language].searching : translations[state.language].geolocation,
  );
}

function renderEmptyState(): void {
  const root = document.querySelector<HTMLElement>("#weather-panel");
  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🌤️</div>
      <h2>${escapeHtml(translations[state.language].emptyTitle)}</h2>
      <p>${escapeHtml(translations[state.language].emptyText)}</p>
    </div>
  `;
}

function renderWeatherPanel(): void {
  const root = document.querySelector<HTMLElement>("#weather-panel");
  if (!root) {
    return;
  }

  if (!state.weather) {
    renderEmptyState();
    return;
  }

  const { location, current, forecast, airQuality } = state.weather;
  const t = translations[state.language];
  const dayLabel = current.isDay ? t.day : t.night;
  const uvIndexValue = forecast[0]?.uvIndexMax ?? 0;

  const forecastMarkup = forecast
    .slice(0, 7)
    .map((day) => {
      const dateLabel = formatDay(day.date);
      const weatherText = getWeatherLabel(day.weatherCode);
      return `
        <article class="forecast-card" aria-label="${escapeHtml(dateLabel)} - ${escapeHtml(weatherText)}">
          <p class="forecast-day">${escapeHtml(dateLabel)}</p>
          <span class="forecast-icon" aria-hidden="true">${getWeatherIcon(day.weatherCode, true)}</span>
          <p class="forecast-condition">${escapeHtml(weatherText)}</p>
          <div class="forecast-temp-row">
            <span>${escapeHtml(formatTemperatureValue(day.temperatureMax).toFixed(0))}°${state.unit}</span>
            <span class="forecast-min">${escapeHtml(formatTemperatureValue(day.temperatureMin).toFixed(0))}°${state.unit}</span>
          </div>
        </article>
      `;
    })
    .join("");

  const highlightMarkup = `
    <article class="highlight-card">
      <p class="highlight-label">${t.uvIndex}</p>
      <div class="gauge-wrapper">
        <div class="gauge" style="--value:${Math.min(100, Math.max(0, (Math.min(uvIndexValue, 12) / 12) * 100))}%"></div>
      </div>
      <div class="highlight-value">${escapeHtml(String(Math.min(12, Math.max(0, uvIndexValue))))}<span class="highlight-unit">/12</span></div>
    </article>

    <article class="highlight-card">
      <p class="highlight-label">${t.windStatus}</p>
      <div class="wind-value-row">
        <strong>${escapeHtml(current.windSpeed.toFixed(1))} km/h</strong>
      </div>
      <div class="wind-detail">${escapeHtml(getCompassDirection(current.windDirection))} ${escapeHtml(String(current.windDirection))}°</div>
    </article>

    <article class="highlight-card">
      <p class="highlight-label">${t.sunrise} & ${t.sunset}</p>
      <div class="sun-times">
        <div><span>☀️</span> <strong>${escapeHtml(formatTime(forecast[0]?.sunrise ?? current.time))}</strong></div>
        <div><span>🌙</span> <strong>${escapeHtml(formatTime(forecast[0]?.sunset ?? current.time))}</strong></div>
      </div>
    </article>

    <article class="highlight-card">
      <p class="highlight-label">${t.humidity}</p>
      <div class="highlight-value-primary">${escapeHtml(String(current.humidity))}%</div>
      <div class="highlight-meta">${escapeHtml(current.humidity > 60 ? translations[state.language].humid : translations[state.language].normal)}</div>
    </article>

    <article class="highlight-card">
      <p class="highlight-label">${t.visibility}</p>
      <div class="highlight-value-primary">${escapeHtml(current.visibilityKm !== null ? `${(current.visibilityKm / 1000).toFixed(1)} km` : t.noData)}</div>
      <div class="highlight-meta">${escapeHtml(current.visibilityKm !== null ? translations[state.language].average : "")}</div>
    </article>

    <article class="highlight-card">
      <p class="highlight-label">${t.airQuality}</p>
      <div class="highlight-value-primary">${escapeHtml(String(airQuality ?? 0))}</div>
      <div class="highlight-meta">${escapeHtml(getAirQualityLabel(airQuality))}</div>
    </article>
  `;

  root.innerHTML = `
    <section class="dashboard-panel">
      <div class="today-header">${escapeHtml(t.today)}</div>
      <div class="main-weather card">
        <div class="weather-visual-wrap">
          <div class="weather-visual">
            <span class="weather-symbol">${escapeHtml(getWeatherIcon(current.weatherCode, current.isDay))}</span>
          </div>
        </div>

        <div class="weather-main-meta">
          <div class="temperature-row">
            <h1 class="current-temperature">${escapeHtml(formatTemperature(current.temperature))}</h1>
          </div>
          <p class="location-name">${escapeHtml(location.name)}</p>
          <p class="location-subtitle">${escapeHtml(location.admin1 ?? `${translations[state.language].stateName} ${location.country}`)} • ${escapeHtml(location.countryCode)}</p>
          <p class="date-line">${escapeHtml(formatFullDate(current.time))}</p>
        </div>

        <div class="condition-row">
          <span class="condition-pill">${escapeHtml(dayLabel)}</span>
          <span class="condition-pill">${escapeHtml(getWeatherLabel(current.weatherCode))}</span>
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <span>${t.humidity}</span>
            <strong>${escapeHtml(String(current.humidity))}%</strong>
          </div>
          <div class="metric-box">
            <span>${t.feelsLike}</span>
            <strong>${escapeHtml(formatTemperature(current.apparentTemperature))}</strong>
          </div>
          <div class="metric-box">
            <span>${t.rainChance}</span>
            <strong>${escapeHtml(String(current.precipitationProbability))}%</strong>
          </div>
          <div class="metric-box">
            <span>${t.wind}</span>
            <strong>${escapeHtml(`${Math.round(current.windSpeed)} km/h`)}</strong>
          </div>
        </div>
      </div>

      <div class="week-card card">
        <div class="section-header">
          <button class="tab-button active" type="button">${t.week}</button>
        </div>
        <div class="forecast-grid">${forecastMarkup}</div>
      </div>

      <div class="highlights card">
        <h3>${escapeHtml(t.highlights)}</h3>
        <div class="highlight-grid">${highlightMarkup}</div>
      </div>
    </section>
  `;
}

async function performSearch(cityName: string): Promise<void> {
  const sanitized = cityName.replace(/[<>]/g, "").trim();

  if (!sanitized) {
    setSearchButtonLoading(false);
    showStatus(getStatusMessage("cityRequired"), "error");
    return;
  }

  setSearchButtonLoading(true);
  showStatus(`⏳ ${getStatusMessage("searching")}`, "info");

  try {
    const location = await searchCityByName(sanitized);

    if (!location) {
      state.weather = null;
      renderWeatherPanel();
      showStatus(getStatusMessage("notFound").replace("{query}", sanitized), "error");
      setSearchButtonLoading(false);
      return;
    }

    const weather = await fetchWeatherForLocation(location);

    if (!weather) {
      state.weather = null;
      renderWeatherPanel();
      showStatus(getStatusMessage("requestError"), "error");
      setSearchButtonLoading(false);
      return;
    }

    state.weather = weather;
    showStatus(`${location.name} • ${location.country}`, "success");
    renderWeatherPanel();
  } catch {
    state.weather = null;
    renderWeatherPanel();
    showStatus(getStatusMessage("requestError"), "error");
  } finally {
    setSearchButtonLoading(false);
  }
}

async function handleGeoSearch(): Promise<void> {
  const isLocalhost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (!navigator.geolocation) {
    showStatus(getStatusMessage("geoUnavailable"), "error");
    return;
  }

  if (!window.isSecureContext && !isLocalhost) {
    showStatus(
      "Este site precisa usar HTTPS ou localhost para acessar a sua localização.",
      "error",
    );
    return;
  }

  setSearchButtonLoading(true);
  setGeoButtonLoading(true);
  showStatus(`⏳ ${getStatusMessage("searching")}`, "info");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let location = await reverseGeocode(latitude, longitude);

        if (!location) {
          location = {
            name: "Current location",
            country: "Local",
            countryCode: "GPS",
            latitude,
            longitude,
            timezone: "auto",
          };
        }

        const weather = await fetchWeatherForLocation(location);

        if (!weather) {
          state.weather = null;
          renderWeatherPanel();
          showStatus(getStatusMessage("requestError"), "error");
          setSearchButtonLoading(false);
          setGeoButtonLoading(false);
          return;
        }

        state.weather = weather;
        showStatus(`${location.name} • ${location.country}`, "success");
        renderWeatherPanel();
      } catch {
        state.weather = null;
        renderWeatherPanel();
        showStatus(getStatusMessage("requestError"), "error");
      } finally {
        setSearchButtonLoading(false);
        setGeoButtonLoading(false);
      }
    },
    (error) => {
      const message =
        error.code === 1
          ? getStatusMessage("geoDenied")
          : error.code === 2
            ? getStatusMessage("geoUnavailable")
            : getStatusMessage("noLocation");

      showStatus(message, "error");
      setSearchButtonLoading(false);
      setGeoButtonLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    },
  );
}

function initializeApp(): void {
  // build shell using modular components
  app.innerHTML = `
    <div class="app-shell">
      ${headerMarkup(state.language)}
      ${searchMarkup(state.language)}
      <div id="weather-panel" aria-live="polite"></div>
    </div>
  `;

  // place footer in the document body (outside the card .app-shell)
  if (!document.querySelector(".app-footer")) {
    const footer = document.createElement("footer");
    footer.className = "app-footer";
    footer.innerHTML = footerMarkup(state.language);
    document.body.appendChild(footer);
  }

  const searchForm = document.querySelector<HTMLFormElement>("#search-form");
  const searchInput = document.querySelector<HTMLInputElement>("#city-search");
  const geoButton = document.querySelector<HTMLButtonElement>("#geo-button");
  const unitButton = document.querySelector<HTMLButtonElement>("#unit-toggle");
  const languageSelect = document.querySelector<HTMLSelectElement>("#language-select");
  const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const cityName = searchInput.value;
      searchInput.value = "";
      await performSearch(cityName);
    });
  }

  if (geoButton) {
    geoButton.addEventListener("click", () => {
      void handleGeoSearch();
    });
  }

  if (unitButton) {
    unitButton.addEventListener("click", () => {
      setUnit(state.unit === "C" ? "F" : "C");
    });
    unitButton.textContent = state.unit === "C" ? "°C" : "°F";
  }

  if (languageSelect) {
    languageSelect.value = state.language;
    languageSelect.addEventListener("change", () => {
      const value = languageSelect.value as Language;
      setLanguage(value);
    });
  }

  if (themeToggle) {
    // initialize label
    applyTheme();
    themeToggle.addEventListener("click", () => {
      // Improved toggle logic:
      // - If current theme is 'system', determine the resolved theme (based on prefers-color-scheme)
      //   and toggle to the opposite of the resolved theme (so clicking flips the effective theme).
      // - Otherwise, toggle between 'light' and 'dark' as usual.
      let newTheme: ThemeMode;
      if (state.theme === "system") {
        const resolved = getResolvedTheme();
        newTheme = resolved === "dark" ? "light" : "dark";
      } else {
        newTheme = state.theme === "dark" ? "light" : "dark";
      }

      state.theme = newTheme;
      localStorage.setItem("climax-theme", newTheme);
      applyTheme();
    });
  }

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (state.theme === "system") {
        applyTheme();
      }
    };
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
    } else if (typeof mq.addListener === "function") {
      // older browsers
      mq.addListener(handler);
    }
  }

  const preferredLanguage = localStorage.getItem("climax-language") as Language | null;
  if (preferredLanguage && ["pt-BR", "en-US", "es"].includes(preferredLanguage)) {
    state.language = preferredLanguage;
  }

  setLanguage(state.language);
  setUnit(state.unit);
  applyTheme();
  renderWeatherPanel();
}

export { initializeApp };
