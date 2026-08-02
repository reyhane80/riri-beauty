import type { Language } from '../types';

const numberLocales: Record<Language, string> = { fa: 'fa-IR', en: 'en-US' };

export function formatPrice(value: number, lang: Language = 'fa'): string {
  return new Intl.NumberFormat(numberLocales[lang]).format(value);
}

export function formatDate(iso: string, lang: Language = 'fa'): string {
  return new Intl.DateTimeFormat(numberLocales[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}
