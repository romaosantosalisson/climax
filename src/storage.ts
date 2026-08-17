import type { ThemeMode, TemperatureUnit } from "./types";

export function getSavedTheme(): ThemeMode {
  const stored = localStorage.getItem("climax-theme");
  return stored === "light" || stored === "dark" || stored === "system"
    ? (stored as ThemeMode)
    : "system";
}

export function getSavedUnit(): TemperatureUnit {
  const stored = localStorage.getItem("climax-temperature-unit");
  return stored === "F" ? "F" : "C";
}
