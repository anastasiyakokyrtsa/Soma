// 3 unvoiced meditation practices - brief 003 / decisions.md 2026-11-21/22
// #6 ("медитации (3 сессии, БЕЗ озвучки - визуально-таймерный формат по
// образцу BreathingSessionScreen)"), source/evidence level per the standing
// rule in decisions.md 2026-09-01 (adapted open, well-known
// techniques/protocols, each with its own real "why it helps" grounding -
// no live expert, no licensed content, same as every other practice in the
// app). Text arrives already split into `sentences` per language (not one
// long `script` string split at render time) - a precomputed array is
// exact and avoids a sentence-boundary regex misreading this content's own
// em dashes, colons and nested quotes («...», "...") as sentence ends.
import type { Language } from '../i18n/LanguageContext';
import type { GradientIconName } from '../components/icons/GradientIcon';

export type MeditationId = 'bodyScan' | 'breathCount' | 'selfKindness';

export type Meditation = {
  id: MeditationId;
  icon: GradientIconName;
  durationMinutes: number;
  title: Record<Language, string>;
  duration: Record<Language, string>;
  description: Record<Language, string>;
  sentences: Record<Language, string[]>;
  whyItHelps: Record<Language, string>;
};

export const MEDITATIONS: Meditation[] = [
  {
    id: 'bodyScan',
    icon: 'brain',
    durationMinutes: 7,
    title: { ru: 'Сканирование тела', en: 'Body Scan' },
    duration: { ru: '7 минут', en: '7 minutes' },
    description: {
      ru: 'Медленно проведи вниманием по телу от стоп до макушки, ничего не пытаясь изменить — просто замечая. Помогает вернуться в тело, если голова перегружена мыслями.',
      en: "Slowly move your attention through your body, from your feet to the top of your head. Don't try to change anything, just notice. Useful when your mind feels overloaded and you want to come back into your body.",
    },
    sentences: {
      ru: [
        'Устройся поудобнее и закрой глаза, если это комфортно.',
        'Начни с дыхания — не меняй его, просто замечай, как воздух входит и выходит.',
        'Теперь перенеси внимание на стопы.',
        'Просто заметь, как они себя чувствуют: тепло, тяжесть, прикосновение к поверхности.',
        'Дай вниманию медленно подняться выше — голени, колени, бёдра.',
        'Не торопись.',
        'Если находишь напряжение — не борись с ним, просто отметь: «да, здесь напряжено», и двигайся дальше.',
        'Живот, грудная клетка, плечи — часто именно здесь скапливается больше всего.',
        'Руки, шея, лицо.',
        'И наконец — всё тело целиком, как единое целое.',
        'Побудь в этом ощущении несколько вдохов, а затем медленно открой глаза.',
      ],
      en: [
        'Get comfortable and close your eyes, if that feels right.',
        'Start with your breath.',
        "Don't try to change it, just notice the air moving in and out.",
        'Now bring your attention to your feet.',
        'Notice how they feel: warmth, weight, the surface beneath them.',
        'Let your attention slowly rise higher, to your calves, your knees, your thighs.',
        'Take your time.',
        'If you find tension, don\'t fight it, just notice it ("yes, there\'s tension here") and move on.',
        'Your stomach, your chest, your shoulders, this is often where the most tension collects.',
        'Your arms, your neck, your face.',
        'And finally, your whole body, all at once.',
        'Stay with that feeling for a few breaths, then slowly open your eyes.',
      ],
    },
    whyItHelps: {
      ru: 'Базовый элемент программ снижения стресса на основе осознанности (MBSR) — одна из самых изученных техник для снижения тревожности и телесного напряжения.',
      en: 'A core part of mindfulness-based stress reduction (MBSR) programs, one of the most studied techniques for easing anxiety and physical tension.',
    },
  },
  {
    id: 'breathCount',
    icon: 'pulse',
    durationMinutes: 5,
    title: { ru: 'Счёт дыхания', en: 'Breath Counting' },
    duration: { ru: '5 минут', en: '5 minutes' },
    description: {
      ru: 'Считай про себя каждый выдох от одного до десяти, потом начинай заново. Сбилась со счёта — не ошибка, а часть практики: просто вернись к единице.',
      en: "Silently count each exhale from one to ten, then start again. Losing count isn't a mistake, it's part of the practice. Just go back to one.",
    },
    sentences: {
      ru: [
        'Сядь удобно, дыши обычным образом, не замедляя специально.',
        'На каждом выдохе про себя считай: один.',
        'Следующий выдох — два.',
        'И так до десяти.',
        'Досчитала до десяти — начни заново с одного.',
        'Если в какой-то момент заметишь, что мысли увели тебя далеко и счёт потерялся — это нормально, так происходит у всех.',
        'Просто мягко верни внимание и начни считать с единицы.',
        'Смысл не в том, чтобы ни разу не сбиться, а в том, чтобы каждый раз спокойно возвращаться.',
      ],
      en: [
        'Sit comfortably and breathe normally, without trying to slow it down.',
        'On each exhale, silently count: one.',
        'The next exhale, two.',
        'Keep going up to ten.',
        'Once you reach ten, start again from one.',
        "If at some point you notice your thoughts carried you off and you lost count, that's normal, it happens to everyone.",
        'Just gently bring your attention back and start counting from one again.',
        "The point isn't to never lose count.",
        "It's to keep calmly coming back.",
      ],
    },
    whyItHelps: {
      ru: 'Простой якорь внимания снижает руминацию (навязчивые мысли по кругу) — техника доступна даже без опыта медитации, не требует особого состояния или обстановки.',
      en: 'A simple anchor for attention that reduces rumination (circling, repetitive thoughts). It works even without any meditation experience and doesn\'t require a particular state of mind or setting.',
    },
  },
  {
    id: 'selfKindness',
    icon: 'idea',
    durationMinutes: 6,
    title: { ru: 'Доброта к себе', en: 'Being Kind to Yourself' },
    duration: { ru: '6 минут', en: '6 minutes' },
    description: {
      ru: 'Несколько простых фраз поддержки, обращённых к себе — как если бы ты говорила с близким человеком в трудный момент.',
      en: 'A few simple, supportive phrases addressed to yourself, the way you might speak to someone you love in a hard moment.',
    },
    sentences: {
      ru: [
        'Положи руку на грудь или живот — туда, где комфортно.',
        'Сделай несколько спокойных вдохов.',
        'Вспомни: сейчас тебе непросто, и это не повод быть к себе строже — скорее наоборот.',
        'Мысленно или шёпотом произнеси: «Это сложный момент».',
        'Затем: «Трудности — часть жизни каждого, я не одна в этом».',
        'И наконец: «Пусть я буду добра к себе прямо сейчас».',
        'Можешь повторить эти фразы своими словами — так, как сказала бы человеку, которого любишь.',
        'Не нужно в них верить на сто процентов, достаточно просто произнести и позволить себе побыть в этом несколько вдохов.',
      ],
      en: [
        'Place a hand on your chest or your stomach, wherever feels comfortable.',
        'Take a few slow breaths.',
        "Remind yourself: this is hard right now, and that's not a reason to be harder on yourself, if anything, it's the opposite.",
        'Silently or in a whisper, say: "This is a hard moment."',
        'Then: "Difficulty is part of everyone\'s life, I\'m not alone in this."',
        'And finally: "May I be kind to myself right now."',
        "You can say these in your own words, the way you'd speak to someone you love.",
        "You don't have to believe them completely, it's enough to say them and let yourself sit with that feeling for a few breaths.",
      ],
    },
    whyItHelps: {
      ru: 'Практики самосострадания (исследования Kristin Neff) снижают самокритику и чувство вины — особенно ценно, если есть привычка винить себя после срыва или спада энергии.',
      en: "Self-compassion practices (based on Kristin Neff's research) help reduce self-criticism and guilt, especially useful if you tend to blame yourself after a slip-up or a dip in energy.",
    },
  },
];
