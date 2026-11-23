// Text for Home's "Фокус дня" cards (FocusCard) when they're driven by a
// real signal instead of always showing the same 3 static cards - находка
// №18 follow-up, her explicit ask ("карточки должны подстраиваться под
// состояние"). Every string here is copied verbatim from the claims-reviewer
// registry at docs/content/правила-рекомендаций.md (P1-P7) - that file is
// the one place wording decisions get made; this is just where the RN app
// reads them from, same split every other content area in this cycle uses
// (tea/meditations/stories). Don't edit wording here without updating that
// file too. P8 (the pre-existing default 3 cards) stays in home.ts,
// untouched - not part of this file.
export const focusRecommendations = {
  ru: {
    p1Title: 'Доброта к себе',
    p1Text:
      'Ты отметила, что сегодня непросто. Может помочь короткая практика «Доброта к себе» (6 минут) — несколько фраз поддержки для себя самой, как для близкого человека.',
    p2Title: 'Тепло и забота',
    p2Text:
      'По датам цикла сейчас фаза, когда тело часто просит больше тепла и мягкости. Стоит попробовать чай из категории «Тепло и восстановление» — подойдёт имбирь или куркума.',
    p3Title: 'Бережный день',
    p3Text:
      'Сон сегодня был короче обычного — это не повод себя ругать. Можно попробовать «Двойной вдох» (1 минута): быстрый и мягкий способ немного прийти в себя.',
    p4Title: 'Телу сегодня легче в покое',
    p4Text:
      'По графику биоритмов физическая кривая сейчас ближе к нижней точке — это наблюдение модели, не диагноз. Если чувствуется напряжение или усталость, может помочь «Дыхание для возвращения в тело» (2 минуты).',
    p5Title: 'По графику — повод быть к себе мягче',
    p5Text:
      'Эмоциональная кривая по классическому расчёту биоритмов сейчас ниже обычного — это наблюдение графика, не факт о настроении. На всякий случай может помочь практика «Доброта к себе» (6 минут).',
    p6Title: 'Для ясности мыслей',
    p6Text:
      'Интеллектуальная кривая по графику биоритмов сейчас ниже обычного — наблюдение, не диагноз внимания. Можно попробовать чай из категории «Фокус и ясность» или практику «Счёт дыхания» (5 минут), чтобы мягко собрать внимание.',
    p7Title: 'Если сегодня тяжелее, чем обычно',
    p7Text:
      'Сегодняшние показатели в целом немного ниже привычного — не повод что-то менять резко. Может помочь «Резонансное дыхание» (5 минут): ровный темп, который мягко возвращает тело в равновесие.',
  },
  en: {
    p1Title: 'Kindness to yourself',
    p1Text:
      "You marked today as a hard one. The short \"Self-kindness\" practice (6 min) might help - a few supportive phrases for yourself, the way you'd speak to someone close.",
    p2Title: 'Warmth and care',
    p2Text:
      'Based on your cycle dates, this is a phase when the body often asks for a bit more warmth and gentleness. Worth trying a tea from the "Warmth and restoration" category - ginger or turmeric work well.',
    p3Title: 'An easier kind of day',
    p3Text:
      "Sleep was shorter than usual last night - that's not something to be hard on yourself about. Worth trying the \"Double inhale\" (1 min): a quick, gentle way to reset a little.",
    p4Title: 'The body may want less today',
    p4Text:
      'On the biorhythm chart, the physical curve is closer to its low point right now - an observation from the model, not a diagnosis. If you\'re noticing tension or fatigue, "Breathing to return to the body" (2 min) might help.',
    p5Title: 'The chart suggests a little extra softness',
    p5Text:
      "The emotional curve in the classic biorhythm calculation is lower than usual right now - just an observation from the chart, not a statement about your mood. The \"Self-kindness\" practice (6 min) might help, just in case.",
    p6Title: 'For a clearer head',
    p6Text:
      'The intellectual curve on the biorhythm chart is lower than usual right now - just an observation, not a verdict on your focus. Worth trying a tea from the "Focus and clarity" category, or the "Breath counting" practice (5 min), to gently gather your attention.',
    p7Title: 'If today feels a little heavier than usual',
    p7Text:
      "Today's numbers are a bit lower than usual across the board - no reason to change anything drastically. \"Resonant breathing\" (5 min) might help: an even pace that gently brings the body back into balance.",
  },
};
