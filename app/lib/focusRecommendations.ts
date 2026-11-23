// Picks which 3 cards Home's "Фокус дня" row shows, instead of it always
// being the same static 3 for everyone - находка №18 follow-up, her
// explicit ask (2026-11-23: "карточки... должны подстраиваться под
// состояние человека и быть полезными именно для его состояния").
//
// Every condition, threshold, priority order, and piece of copy here comes
// straight from the claims-reviewer registry at
// docs/content/правила-рекомендаций.md (scenarios P1-P7, plus P8 as the
// pre-existing default) - this file is the algorithm described there,
// translated into code, not a second place where wording or thresholds get
// decided. If a threshold ever needs tuning, change it there first.
//
// On purpose NOT wired to getOnboardingSupportAreas() (находка №18's other
// half, the "Где тебе нужна поддержка" chips) - her explicit instruction
// this cycle was to leave that unused here; it's a separate, later piece of
// work (see the registry's own "Открытое на будущее" section).
import { getBiorhythmValues, type BirthDate } from './biorhythm';
import { computeEnergy, type EnergyResult } from './energy';
import { getOnboardingCycle, getOnboardingSleep, getTodayMood, type CycleRange, type SleepSchedule } from './onboardingProfile';
import type { GradientIconName } from '../components/icons/GradientIcon';

// Mirrors lib/energy.ts's own private helpers exactly (same LOOP_MIN/
// wraparound math) - duplicated rather than imported since energy.ts
// doesn't export them, and the registry's threshold is on raw sleep
// minutes, not the 0-100 sleepScore energy.ts derives from them.
const LOOP_MIN = 720;
function sleepDurationMinutes(sleep: SleepSchedule): number {
  return ((sleep.waketimeMin - sleep.bedtimeMin + LOOP_MIN) % LOOP_MIN) || LOOP_MIN;
}

function cycleScore(cycle: CycleRange, today: Date): number {
  const dayNumberUTC = (d: { year: number; month: number; day: number }) => Math.floor(Date.UTC(d.year, d.month, d.day) / 86400000);
  const startDay = dayNumberUTC(cycle.start);
  const todayDay = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  const dayOfCycle = (((todayDay - startDay) % 28) + 28) % 28;
  return ((1 - Math.cos((2 * Math.PI * dayOfCycle) / 28)) / 2) * 100;
}

// Registry's own thresholds ("Пороги" section) - her own future tuning
// point if these read too sensitive/insensitive on real data, not a code
// change elsewhere.
const MOOD_LOW_MAX_INDEX = 1; // 0 (veryBad) or 1 (bad)
const SHORT_SLEEP_MAX_MIN = 420; // < 7h
const CYCLE_LOW_MAX = 35;
const BIORHYTHM_LOW_MAX = 35;
const COMPOSITE_LOW_MAX = 40;

export type FocusCardContent = {
  icon: GradientIconName;
  titleKey: string;
  textKey: string;
};

const P1: FocusCardContent = { icon: 'meditationFigure', titleKey: 'focusRecommendations.p1Title', textKey: 'focusRecommendations.p1Text' };
const P2: FocusCardContent = { icon: 'kettle', titleKey: 'focusRecommendations.p2Title', textKey: 'focusRecommendations.p2Text' };
const P3: FocusCardContent = { icon: 'sleep', titleKey: 'focusRecommendations.p3Title', textKey: 'focusRecommendations.p3Text' };
const P4: FocusCardContent = { icon: 'pulse', titleKey: 'focusRecommendations.p4Title', textKey: 'focusRecommendations.p4Text' };
const P5: FocusCardContent = { icon: 'meditationFigure', titleKey: 'focusRecommendations.p5Title', textKey: 'focusRecommendations.p5Text' };
const P6: FocusCardContent = { icon: 'idea', titleKey: 'focusRecommendations.p6Title', textKey: 'focusRecommendations.p6Text' };
const P7: FocusCardContent = { icon: 'breathingCircle', titleKey: 'focusRecommendations.p7Title', textKey: 'focusRecommendations.p7Text' };
// P8 - the pre-existing default 3 cards (home.ts's own focus1/2/3), not
// touched or re-worded here, per the registry's own explicit note.
const P8: FocusCardContent[] = [
  { icon: 'lotus', titleKey: 'home.focus1Title', textKey: 'home.focus1Text' },
  { icon: 'idea', titleKey: 'home.focus2Title', textKey: 'home.focus2Text' },
  { icon: 'broom', titleKey: 'home.focus3Title', textKey: 'home.focus3Text' },
];

export function pickFocusCards({
  birthDate,
  today = new Date(),
}: {
  birthDate: BirthDate | null;
  today?: Date;
}): FocusCardContent[] {
  const sleep = getOnboardingSleep();
  const cycle = getOnboardingCycle();
  const mood = getTodayMood();

  const p1Condition = mood !== null && mood <= MOOD_LOW_MAX_INDEX;
  const p2Condition = !!cycle.range && !cycle.notApplicable && cycleScore(cycle.range, today) < CYCLE_LOW_MAX;
  const p3Condition = !!sleep && sleepDurationMinutes(sleep) < SHORT_SLEEP_MAX_MIN;

  const biorhythm = birthDate ? getBiorhythmValues(birthDate, today) : null;
  const p4Condition = !!biorhythm && biorhythm.physical < BIORHYTHM_LOW_MAX;
  const p5Condition = !p1Condition && !!biorhythm && biorhythm.emotional < BIORHYTHM_LOW_MAX;
  const p6Condition = !!biorhythm && biorhythm.intellect < BIORHYTHM_LOW_MAX;

  const candidates: FocusCardContent[] = [];
  if (p1Condition) candidates.push(P1);
  if (p2Condition) candidates.push(P2);
  if (p3Condition) candidates.push(P3);
  if (p4Condition) candidates.push(P4);
  if (p5Condition) candidates.push(P5);
  if (p6Condition) candidates.push(P6);

  if (candidates.length === 0) {
    const energy: EnergyResult | null = computeEnergy({ birthDate, sleep, cycle, today });
    if (energy && energy.value < COMPOSITE_LOW_MAX) candidates.push(P7);
  }

  const selected = candidates.slice(0, 3);
  let fallbackIndex = 0;
  while (selected.length < 3) {
    selected.push(P8[fallbackIndex]);
    fallbackIndex += 1;
  }
  return selected;
}
