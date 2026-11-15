import { useLanguage } from './LanguageContext';
import { dictionaries } from './dictionaries';

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

// "namespace.key" -> current language's string, falling back to Russian
// (the source copy, always complete) and then to the raw key itself so a
// missing translation never crashes a screen, just shows something obviously
// wrong and easy to spot.
export function useT() {
  const { language } = useLanguage();
  return (key: string, vars?: Record<string, string | number>): string => {
    const raw = getByPath(dictionaries[language], key) ?? getByPath(dictionaries.ru, key) ?? key;
    const text = typeof raw === 'string' ? raw : key;
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (_match, name) => String(vars[name] ?? ''));
  };
}
