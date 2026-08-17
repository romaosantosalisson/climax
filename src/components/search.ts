import { translations } from "../i18n";
import type { Language } from "../types";

export function searchMarkup(language: Language): string {
  const t = translations[language];
  return `
  <section class="search-section">
    <form id="search-form" class="search-form" novalidate>
      <label id="city-search-label" class="sr-only" for="city-search">${t.placeholder}</label>
      <input
        id="city-search"
        type="search"
        inputmode="text"
        maxlength="80"
        placeholder="${t.placeholder}"
        aria-label="${t.placeholder}"
      />
      <button id="search-button" type="submit" class="primary-button" aria-label="${t.search}">🔎 <span>${t.search}</span></button>
      <button id="geo-button" type="button" class="geo-button" aria-label="${t.geolocation}">📍</button>
    </form>
    <p id="status-message" class="status-message info" aria-live="polite"></p>
  </section>
  `;
}
