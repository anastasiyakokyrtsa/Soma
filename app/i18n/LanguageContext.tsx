import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'ru' | 'en';

const STORAGE_KEY = 'soma.language';

// Web only: a recruiter's link carries the language in the URL itself
// (?lang=en), so one deployed site serves two "versions" without a second
// deploy - the RU link goes on her Russian resume, the EN one everywhere
// else (her ask, 2026-11-15). Read once at module load, before React even
// mounts, so the very first render is already in the right language.
function readWebLangParam(): Language | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('lang');
  return value === 'en' || value === 'ru' ? value : null;
}

const webLangParam = readWebLangParam();

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(webLangParam ?? 'ru');

  useEffect(() => {
    // A URL override always wins on first load, so a shared EN link never
    // silently falls back to a previously-stored RU preference.
    if (webLangParam) return;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'en' || stored === 'ru') setLanguageState(stored);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
