import type { Language } from "../types";

const footerTranslations: Record<Language, string> = {
  "pt-BR":
    "&copy; " +
    new Date().getFullYear() +
    " <strong>Climax</strong> — Feito com ❤️ e ☕ por <strong>Álisson</strong>",
  "en-US":
    "&copy; " +
    new Date().getFullYear() +
    " <strong>Climax</strong> — Made with ❤️ and ☕ by <strong>Álisson</strong>",
  es:
    "&copy; " +
    new Date().getFullYear() +
    " <strong>Climax</strong> — Hecho con ❤️ y ☕ por <strong>Álisson</strong>",
};

export function footerMarkup(language: Language): string {
  return footerTranslations[language];
}
