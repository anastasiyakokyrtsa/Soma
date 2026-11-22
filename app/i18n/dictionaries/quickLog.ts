// FAB quick-log sheet (BottomBar's "+"), brief 002. Decided composition
// (decisions.md 2026-11-21/22 #1): no profile with a relevant cycle sees a
// "Самочувствие сейчас" option any more (dropped - it duplicated Home's own
// MoodCheckIn), just Sleep and, for profiles the cycle step applies to,
// Cycle.
export const quickLog = {
  ru: {
    menuTitle: 'Быстрая запись',
    sleepTileLabel: 'Сон',
    sleepTileHint: 'Сегодня или вчера',
    cycleTileLabel: 'Цикл',
    cycleTileHint: 'Начался сегодня',

    sleepFormTitle: 'Сон был другим',
    sleepFormDescription: 'Поправь время сна за последние сутки — дневная энергия обновится.',

    cycleFormTitle: 'Цикл начался',
    cycleFormDescription: 'Если дата отличается, выбери её в календаре.',
  },
  en: {
    menuTitle: 'Quick log',
    sleepTileLabel: 'Sleep',
    sleepTileHint: 'Today or yesterday',
    cycleTileLabel: 'Cycle',
    cycleTileHint: 'Started today',

    sleepFormTitle: 'Sleep was different',
    sleepFormDescription: "Adjust last night's sleep, and today's energy will update.",

    cycleFormTitle: 'Cycle started',
    cycleFormDescription: "If the date's different, pick it on the calendar.",
  },
};
