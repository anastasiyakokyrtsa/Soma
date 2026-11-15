import type { Language } from '../LanguageContext';

// Shared 5-mood data (MoodScale's full slider + Home's compact MoodCheckIn
// chip) - one source for both, keyed by a stable id so the same image always
// maps to the same mood regardless of which language's label is showing.
export type MoodKey = 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';

export const MOOD_KEYS: MoodKey[] = ['veryBad', 'bad', 'neutral', 'good', 'veryGood'];

const LABELS: Record<Language, Record<MoodKey, string>> = {
  ru: {
    veryBad: 'Ужасно',
    bad: 'Плохо',
    neutral: 'Нейтрально',
    good: 'Хорошо',
    veryGood: 'Отлично',
  },
  en: {
    veryBad: 'Awful',
    bad: 'Bad',
    neutral: 'Neutral',
    good: 'Good',
    veryGood: 'Great',
  },
};

export function getMoodLabels(language: Language): Record<MoodKey, string> {
  return LABELS[language];
}
