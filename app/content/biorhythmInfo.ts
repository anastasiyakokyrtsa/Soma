// Shared between HomeScreen.tsx (inline (i) next to "Биоритмы") and
// BiorhythmsScreen.tsx (same (i) in the detail screen's title row) - one
// InfoSheet, one source of text, not a copy in each screen. Text is the
// owner's own wording (audit findings #3/#9, confirmed 2026-09-13), only
// re-addressed from impersonal to the app's standing "ты" voice.
import type { Language } from '../i18n/LanguageContext';

export const BIORHYTHM_INFO_TITLE: Record<Language, string> = {
  ru: 'О чём эти графики',
  en: 'About these charts',
};

export const BIORHYTHM_INFO_PARAGRAPHS: Record<Language, string[]> = {
  ru: [
    'Soma использует классическую модель биоритмов — идею о повторяющихся циклах, которые связаны с твоим физическим, эмоциональным и интеллектуальным состоянием.',
    'Эта модель не считается научно подтверждённым способом прогнозировать состояние человека, поэтому показатели в приложении не стоит принимать за точный прогноз.',
    'Воспринимай их как инструмент самонаблюдения и рефлексии и в первую очередь прислушивайся к своему реальному самочувствию.',
  ],
  en: [
    'Soma uses the classic biorhythm model: the idea of repeating cycles tied to your physical, emotional, and intellectual state.',
    "This model isn't considered a scientifically proven way to predict how someone feels, so the numbers in the app shouldn't be taken as an exact forecast.",
    'Think of them as a tool for self-observation and reflection, and let how you actually feel be your main guide.',
  ],
};
