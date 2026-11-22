// One-line insight shown right after date-of-birth entry in onboarding
// (2026-09-15, habit-designer's recommendation for finding #7 - real value
// before the onboarding flow finishes, not just at the end on Home). 6
// hand-written templates (3 cycles x 2 directions), same register/hedging
// as HomeScreen's DAY_PARAGRAPHS (audit findings #3/#9 - attribute the read
// to the graph, not assert it as fact about the person) - shown once per
// install, so no need for DAY_PARAGRAPHS' 9-way variety.
import type { CycleId, BiorhythmValues } from '../lib/biorhythm';
import type { Language } from '../i18n/LanguageContext';
import { getDayValues } from '../components/BiorhythmChart';

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
      high: "Your physical rhythm looks like it's on the rise today. A decent day to add a bit of movement.",
      low: 'Your physical rhythm is tracking closer to a dip today, maybe worth going easier on yourself with the load.',
    },
    emotional: {
      high: 'Your emotional rhythm is up today, so the day might feel a touch more vivid than usual.',
      low: "Your emotional rhythm is running lower today. If something hits harder than usual, it might just be a phase.",
    },
    intellect: {
      high: "Your intellectual rhythm looks like it's on the rise today. A good day for tasks that need focus.",
      low: "Your intellectual rhythm is lower today. If it's hard to gather your thoughts, it might not be just you.",
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
  en: "Today's graph shows plenty of physical energy. A good day for a walk or to stretch, better to put off the harder tasks.",
};

// 2026-11-22 (brief 001, real-data reactivity): Home used to pick its day
// paragraph by a literal calendar-day number (10-18, the kit's own demo
// month) out of i18n/dictionaries/home.ts's dayParagraphs. Now that Home
// runs off real computed values for the real current date, there's no
// "day number" to look up any more - instead, match today's real
// (physical, emotional, intellect) reading against whichever of those same
// 9 templates' own original pattern (BiorhythmChart.tsx's getDayValues) best
// fits it.
//
// First pass here matched on raw Euclidean distance between the three
// numbers - wrong, caught on-device 2026-11-22: the hand-authored demo set
// only ever has physical and emotional trade off against each other (one
// high while the other is low), since that's how its own fixed bezier
// curves happen to be phased. A real pair of independent sine waves has no
// such constraint - physical and emotional can land high at the same real
// calendar date, a combination the demo set never represents at the
// matching absolute magnitudes. Raw-distance matching then picked whichever
// demo day was numerically closest on paper (e.g. day 18, "intellect's the
// highlight") even when that day's own *qualitative* claim is false for the
// real numbers (intellect was actually the lowest of the three, not the
// highest) - a text contradicting the rings right above it on screen.
//
// Fixed by matching on each cycle's RANK among the three first (which one
// is highest, which is middle, which is lowest - a coarser, more robust
// signal than raw magnitude, and the thing every one of the 9 texts is
// actually describing), falling back to Euclidean distance only to break
// ties among demo days that share the same rank order. This can't produce
// a text whose central claim is wrong: whichever demo day shares today's
// real highest-to-lowest order is the one written about that same shape.
const TEMPLATE_DAYS = [10, 11, 12, 13, 14, 15, 16, 17, 18];
const CYCLE_KEYS = ['physical', 'emotional', 'intellect'] as const;

function rankOrder(values: BiorhythmValues): string {
  return [...CYCLE_KEYS].sort((a, b) => values[b] - values[a]).join(',');
}

export function pickDayParagraphTemplate(values: BiorhythmValues): number {
  const targetRank = rankOrder(values);
  let best = TEMPLATE_DAYS[0];
  let bestDist = Infinity;
  let bestRankMatches = false;
  for (const day of TEMPLATE_DAYS) {
    const t = getDayValues(day);
    const rankMatches = rankOrder(t) === targetRank;
    const dist = (t.physical - values.physical) ** 2 + (t.emotional - values.emotional) ** 2 + (t.intellect - values.intellect) ** 2;
    // A rank match always wins over a closer-but-differently-ordered demo
    // day; among same-rank candidates (or if nothing matches the rank at
    // all, as a last resort), fall back to whichever is numerically nearest.
    const better = rankMatches && !bestRankMatches ? true : rankMatches === bestRankMatches && dist < bestDist;
    if (better) {
      bestDist = dist;
      best = day;
      bestRankMatches = rankMatches;
    }
  }
  return best;
}
