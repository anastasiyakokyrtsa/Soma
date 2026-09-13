// Shared between HomeScreen.tsx (inline (i) next to "Биоритмы") and
// BiorhythmsScreen.tsx (same (i) in the detail screen's title row) - one
// InfoSheet, one source of text, not a copy in each screen. Text is the
// owner's own wording (audit findings #3/#9, confirmed 2026-09-13), only
// re-addressed from impersonal to the app's standing "ты" voice.
export const BIORHYTHM_INFO_TITLE = 'О чём эти графики';

export const BIORHYTHM_INFO_PARAGRAPHS = [
  'Soma использует классическую модель биоритмов — идею о повторяющихся циклах, которые связаны с твоим физическим, эмоциональным и интеллектуальным состоянием.',
  'Эта модель не считается научно подтверждённым способом прогнозировать состояние человека, поэтому показатели в приложении не стоит принимать за точный прогноз.',
  'Воспринимай их как инструмент самонаблюдения и рефлексии и в первую очередь прислушивайся к своему реальному самочувствию.',
];
