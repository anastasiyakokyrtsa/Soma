// Chrome strings (buttons, screen titles, a11y labels) for the two new
// unvoiced practice flows - brief 003 / decisions.md 2026-11-21/22 #6. The
// actual meditation/story content itself lives in content/meditations.ts
// and content/stories.ts as per-language Records, same split as
// content/articleWater.ts (long-form content isn't routed through t(),
// only the surrounding UI is).
export const practices = {
  ru: {
    meditationListTitle: 'Медитации',
    meditationListSubtitle: 'Выбери практику, которая откликается сейчас',
    meditationDurationA11y: '{duration}',
    startButton: 'Начать',
    whyItHelpsLabel: 'Почему это помогает',
    meditationCompleteTitle: 'Практика завершена',
    meditationCompleteButton: 'К другим медитациям',

    storiesListTitle: 'Сказки на ночь',
    storiesListSubtitle: 'Истории для спокойного засыпания',
    storyPausedLabel: 'На паузе',
  },
  en: {
    meditationListTitle: 'Meditations',
    meditationListSubtitle: 'Choose whatever practice fits how you feel right now',
    meditationDurationA11y: '{duration}',
    startButton: 'Begin',
    whyItHelpsLabel: 'Why this helps',
    meditationCompleteTitle: 'Practice complete',
    meditationCompleteButton: 'More meditations',

    storiesListTitle: 'Sleep stories',
    storiesListSubtitle: 'Stories for settling into sleep',
    storyPausedLabel: 'Paused',
  },
};
