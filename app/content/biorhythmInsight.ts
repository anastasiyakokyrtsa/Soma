// One-line insight shown right after date-of-birth entry in onboarding
// (2026-09-15, habit-designer's recommendation for finding #7 - real value
// before the onboarding flow finishes, not just at the end on Home). 6
// hand-written templates (3 cycles x 2 directions), same register/hedging
// as HomeScreen's DAY_PARAGRAPHS (audit findings #3/#9 - attribute the read
// to the graph, not assert it as fact about the person) - shown once per
// install, so no need for DAY_PARAGRAPHS' 9-way variety.
import type { CycleId } from '../lib/biorhythm';

export const BIORHYTHM_INSIGHTS: Record<CycleId, Record<'high' | 'low', string>> = {
  physical: {
    high: 'Судя по графику, твой физический ритм сегодня на подъёме, неплохой день, чтобы добавить немного движения.',
    low: 'Физический ритм сегодня по графику ближе к спаду, возможно, стоит быть к себе бережнее в нагрузках.',
  },
  emotional: {
    high: 'Эмоциональный ритм сегодня по графику наверху, день может ощущаться немного живее обычного.',
    low: 'Эмоциональный ритм сегодня по графику пониже, если что-то заденет сильнее обычного, это вполне может быть просто фаза.',
  },
  intellect: {
    high: 'Интеллектуальный ритм сегодня по графику на подъёме, неплохое время для сосредоточенных задач.',
    low: 'Интеллектуальный ритм сегодня по графику пониже, если сложно собраться с мыслями, дело может быть не только в тебе.',
  },
};

export const BIORHYTHM_INSIGHT_EYEBROW = 'Твой первый инсайт';
