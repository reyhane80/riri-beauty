import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language, LocalizedString } from '../types';
import { translations } from './translations';
import type { TranslationKey } from './translations';

const STORAGE_KEY = 'riri-lang';

interface LanguageContextValue {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** Translate a UI string, with optional {placeholder} interpolation */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Pick the current language's value from a localized data field */
  l: (value: LocalizedString) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'fa';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readStoredLang);
  const dir: 'rtl' | 'ltr' = lang === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = translations[lang]['meta.title'];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', translations[lang]['meta.description']);
  }, [lang, dir]);

  const setLang = useCallback((next: Language) => setLangState(next), []);
  const toggleLang = useCallback(() => setLangState((prev) => (prev === 'fa' ? 'en' : 'fa')), []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text: string = translations[lang][key];
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replace(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [lang],
  );

  const l = useCallback((value: LocalizedString) => value[lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t, l }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
