import { translations } from "../i18n";
import type { Language } from "../types";

export function headerMarkup(language: Language): string {
  const t = translations[language];
  return `
  <header class="top-bar">
    <div class="brand-group">
      <span class="brand-mark" aria-hidden="true">⛅</span>
      <span class="brand-name">${t.title}</span>
    </div>

    <div class="control-group">
      <button id="unit-toggle" class="icon-button" type="button" aria-label="Toggle unit" aria-pressed="false">°C</button>

      <label class="select-wrap language-select" aria-label="Select language">
        <span class="sr-only">${t.language}</span>
        <select id="language-select">
          <option value="pt-BR">🇧🇷 PT-BR</option>
          <option value="en-US">🇬🇧 EN</option>
          <option value="es">🇪🇸 ES</option>
        </select>
      </label>

      <button id="theme-toggle" class="icon-button theme-toggle" type="button" aria-label="Toggle theme" aria-pressed="false"></button>
    </div>
  </header>
  `;
}
