// One-line insight shown right after date-of-birth entry in onboarding
// (2026-09-15, habit-designer's recommendation for finding #7 - real value
// before the onboarding flow finishes, not just at the end on Home). 6
// hand-written templates (3 cycles x 2 directions), same register/hedging
// as HomeScreen's DAY_PARAGRAPHS (audit findings #3/#9 - attribute the read
// to the graph, not assert it as fact about the person) - shown once per
// install, so no need for DAY_PARAGRAPHS' 9-way variety.
import type { CycleId } from '../lib/biorhythm';
import type { Language } from '../i18n/LanguageContext';

type Insights = Record<CycleId, Record<'high' | 'low', string>>;

export const BIORHYTHM_INSIGHTS: Record<Language, Insights> = {
  ru: {
    physical: {
      high: 'Судя по графику, твой физический ритм сегодня на подъёме, неплохой день, чтобы добавить немного движения.',
      low: 'Физический ритм сегодня по графику ближе к спаду, возможно, стоит быть к себе бережнее в нагрузках.',
    },
    emotional: {
      high: 'Эмоциональный ритм сегодня по графику наверху, день может ощущаться немного живее обычного.',
      low: 'Эмоциональный ритм сегодня по графику пониже, если что-то заденет сильнее обычного, это вполне может быть просто фаза.',
    },
    intellect: {
      high: 'Судя по графику, сегодня интеллектуальный ритм на подъёме. Хороший день для задач, где нужна концентрация.',
      low: 'Интеллектуальный ритм сегодня по графику пониже, если сложно собраться с мыслями, дело может быть не только в тебе.',
    },
  },
  en: {
    physical: {
      high: "Your physical rhythm looks like it's on the rise today — a decent day to add a bit of movement.",
      low: 'Your physical rhythm is tracking closer to a dip today — maybe worth going easier on yourself with the load.',
    },
    emotional: {
      high: 'Your emotional rhythm is up today, so the day might feel a touch more vivid than usual.',
      low: "Your emotional rhythm is running lower today — if something hits harder than usual, it might just be a phase.",
    },
    intellect: {
      high: "Your intellectual rhythm looks like it's on the rise today. A good day for tasks that need focus.",
      low: "Your intellectual rhythm is lower today — if it's hard to gather your thoughts, it might not be just you.",
    },
  },
};

export const BIORHYTHM_INSIGHT_EYEBROW: Record<Language, string> = {
  ru: 'Твой первый инсайт',
  en: 'Your first insight',
};

// Demo-phase insight (2026-09-23, her pick of 4 drafts): matches what Home's
// hand-authored chart shows on its default day (physical at the peak,
// emotional and intellect near the bottom) so the two screens don't
// contradict each other. Shown while USE_HOME_DEMO_INSIGHT is true in
// BiorhythmInsightScreen; the six templates above are the real-formula
// path, to come back once Home runs off the same formula.
export const BIORHYTHM_INSIGHT_DEMO: Record<Language, string> = {
  ru: 'Сегодня по графику много сил в теле. Хороший день, чтобы выйти на прогулку или размяться, а сложные дела лучше отложить.',
  en: "Today's graph shows plenty of physical energy. A good day for a walk or to stretch — better to put off the harder tasks.",
};
