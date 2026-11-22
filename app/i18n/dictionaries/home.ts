import type { Language } from '../LanguageContext';

export const home = {
  ru: {
    greeting: 'Доброе утро, {name}',
    biorhythmsTitle: 'Биоритмы',
    biorhythmsDetails: 'Подробнее',
    biorhythmsA11y: 'Что означают биоритмы',

    // Brief 001 / decisions.md 2026-11-21/22 #2 - без даты рождения график
    // рисуется приглушённым контуром, а не демо-кривыми; эта строка и ссылка
    // заменяют обычный текст-инсайт под графиком.
    noBirthDateText: 'Чтобы увидеть свой биоритм, укажи дату рождения',
    noBirthDateLink: 'Указать дату рождения',

    demoDate: '14 марта, 18:07',
    moonCardTitle: 'Лунная активность',
    moonPhase: 'Убывающая луна',
    moonIllumination: 'Освещенность',
    moonIlluminationValue: '24%',
    moonrise: 'Восход',
    moonriseValue: '4:32 утра',
    moonset: 'Закат',
    moonsetValue: '12:15 дня',
    untilNewMoon: 'До новолуния',
    untilNewMoonValue: '6 дней',
    moonNote: 'Конец лунного цикла. В ближайшие дни рекомендуется снизить нагрузку и сфокусироваться на отдыхе и восстановлении ресурса.',

    sunCardTitle: 'Солнечная активность',
    sunPhase: 'Умеренная солнечная активность',
    sunIndex: 'Индекс',
    sunIndexValue: 'Кп 3/9',
    sunrise: 'Восход',
    sunriseValue: '7:12 утра',
    sunset: 'Закат',
    sunsetValue: '18:41 дня',
    daylight: 'Световой день',
    daylightValue: '11 ч 26 мин',
    sunNote: 'Солнечная активность умеренная, день подойдёт для спокойной и сосредоточенной работы.',

    focusTitle: 'Фокус дня',
    focus1Title: 'Мягкий старт',
    focus1Text: 'Не время для рекордов, но отличный момент, чтобы мягко войти в ритм. Подойдут пилатес, растяжка или неспешная прогулка на свежем воздухе. Это поднимет настроение, вернёт лёгкость и немного сил.',
    focus2Title: 'Планирование',
    focus2Text: 'Хороший момент для спокойной аналитической работы в одиночестве — пишите стратегии, учите языки, разбирайте почту. Избегайте брейнштормов и публичных выступлений сегодня.',
    focus3Title: 'Пространство',
    focus3Text: 'Выбросьте лишнее из дома и цифрового пространства: старые вещи, ненужные файлы, лишние подписки. Избавление от старого возвращает контроль, добавляет лёгкости и ясность.',

    quoteText: 'Важно не то, как ты идёшь, а то, что ты\nне останавливаешься',
    quoteAuthor: 'Конфуций',
  },
  en: {
    greeting: 'Good morning, {name}',
    biorhythmsTitle: 'Biorhythms',
    biorhythmsDetails: 'Details',
    biorhythmsA11y: 'What biorhythms mean',

    noBirthDateText: 'Add your date of birth to see your biorhythm',
    noBirthDateLink: 'Add date of birth',

    demoDate: 'March 14, 6:07 PM',
    moonCardTitle: 'Lunar activity',
    moonPhase: 'Waning moon',
    moonIllumination: 'Illumination',
    moonIlluminationValue: '24%',
    moonrise: 'Moonrise',
    moonriseValue: '4:32 AM',
    moonset: 'Moonset',
    moonsetValue: '12:15 PM',
    untilNewMoon: 'Until new moon',
    untilNewMoonValue: '6 days',
    moonNote: "End of the lunar cycle. Over the next few days, it's a good time to ease off and focus on rest and recovery.",

    sunCardTitle: 'Solar activity',
    sunPhase: 'Moderate solar activity',
    sunIndex: 'Index',
    sunIndexValue: 'Kp 3/9',
    sunrise: 'Sunrise',
    sunriseValue: '7:12 AM',
    sunset: 'Sunset',
    sunsetValue: '6:41 PM',
    daylight: 'Daylight',
    daylightValue: '11h 26m',
    sunNote: 'Solar activity is moderate today, a good day for calm, focused work.',

    focusTitle: "Today's focus",
    focus1Title: 'Gentle start',
    focus1Text: 'Not a day for personal records, but a good one for easing into a rhythm. Pilates, stretching, or a slow walk outside would all work well. It can lift your mood and bring back some lightness and energy.',
    focus2Title: 'Planning',
    focus2Text: 'Good time for quiet, focused work on your own: strategy docs, language practice, clearing out your inbox. Steer clear of brainstorms and public speaking today.',
    focus3Title: 'Space',
    focus3Text: "Clear out what you don't need, at home and online: old stuff, files you don't use, subscriptions you forgot about. Letting go of clutter brings back a sense of control, along with more lightness and clarity.",

    quoteText: 'It does not matter how slowly you go\nas long as you do not stop.',
    quoteAuthor: 'Confucius',
  },
};

// Hedged per the app's own wellbeing-safety/claims-reviewer rule: every line
// attributes the read to the graph/chart itself ("the curve suggests...")
// rather than asserting the person's real state, confirmed with the
// english-editor agent (2026-11-21) when translating this batch.
export const dayParagraphs: Record<Language, Record<number, string>> = {
  ru: {
    10: 'Эмоциональный биоритм сегодня заметно выше обычного, и возможно, поэтому настроение с утра кажется легче, чем в последние дни. Телу и голове по графику сейчас скорее нужна пауза, так что если не тянет на сложные задачи, это в порядке вещей.',
    11: 'Судя по кривой, сегодня труднее всего именно с концентрацией. Если мысли разбегаются и трудно удержать фокус, дело может быть не в тебе, а в этом конкретном дне. Тело и настроение держатся ровно, так что для простых дел время неплохое, а важные решения лучше отложить.',
    12: 'Интеллектуальный биоритм сегодня почти на нуле, а физический на подъёме. Собраться с мыслями сегодня может быть особенно тяжело, зато тянет двигаться. Хороший день для движения и не самый удачный для серьёзных решений.',
    13: 'Тело сегодня по графику на пике, а голове и настроению, похоже, нужнее отдых. Не обязательно успевать всё и сразу. Если день располагает больше к физическому, чем к умственному, можно ему довериться.',
    14: 'Сразу два биоритма, эмоциональный и интеллектуальный, сегодня внизу, а физический на максимуме. Это не значит, что день обязательно тяжёлый, но если сложные разговоры и решения даются труднее обычного, причина может быть здесь. Есть смысл направить силы туда, где их сегодня больше всего, в тело.',
    15: 'Эмоциональная кривая на этой неделе ещё нигде не опускалась так низко, как сегодня, хотя тело держится хорошо. Если сегодня реагируешь острее обычного, это вполне может быть просто фаза, а не что-то, что нужно исправлять. Стоит быть мягче к себе в разговорах и оставить важное на потом.',
    16: 'Эмоциональный биоритм пока не спешит выходить из низкой точки, хотя физический всё ещё держится хорошо. Движение часто помогает легче пережить такие дни, можно попробовать, если откликается.',
    17: 'Настроение по графику потихоньку разворачивается вверх, а разум и тело идут ровно. Неплохой день для привычных дел без лишнего напряжения.',
    18: 'Сегодня заметнее всего работает голова, интеллектуальная кривая выше остальных. Тело и настроение спокойны, без резких перепадов. Удачный момент для аналитической работы и планов.',
  },
  en: {
    10: "Your emotional biorhythm is noticeably higher than usual today, which might be why mornings have felt lighter than they have the past few days. The chart suggests your body and mind could use a pause right now, so if you're not up for anything demanding, that's completely fine.",
    11: "According to the curve, focus is what's hardest today. If your thoughts keep scattering and it's hard to concentrate, it might not be you, it could just be the day. Body and mood are holding steady, so it's a decent time for simple tasks, but it's worth holding off on anything important.",
    12: 'Your intellectual biorhythm is close to zero today, while the physical one is climbing. Pulling your thoughts together might be especially hard right now, but your body may want to move. Good day for getting moving, not the best one for big decisions.',
    13: "Your body is at its peak today, according to the chart, while your mind and mood seem to need rest more. You don't have to get everything done at once. If today feels more suited to the physical than the mental, it's fine to go with that.",
    14: 'Two biorhythms, emotional and intellectual, are both low today, while the physical one is at its max. That doesn\'t mean today has to be hard, but if tough conversations or decisions feel harder than usual, this could be why. It might make sense to put your energy where you have the most of it today, in your body.',
    15: "Your emotional curve hasn't dipped this low all week, even though your body is holding up well. If you're reacting more sharply than usual today, it could just be a phase, not something to fix. It's worth going easier on yourself in conversations and leaving anything important for later.",
    16: "Your emotional biorhythm isn't in a hurry to climb out of its low point, though the physical one is still holding up well. Moving your body often makes days like this easier to get through, worth trying if it sounds right to you.",
    17: 'According to the chart, your mood is slowly turning upward, while mind and body stay steady. A decent day for familiar routines, nothing that needs extra effort.',
    18: 'Today your mind is the most active of the three, the intellectual curve is running higher than the rest. Body and mood are calm, no sharp swings. A good moment for analytical work and planning.',
  },
};
