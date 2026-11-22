// "Energy of the day" composite (brief 001 / decisions.md 2026-11-21/22 #2) -
// the one number Home's chart area and Care's ResourceRing both now read,
// instead of each hardcoding its own independent constant (criterion:
// "Care получает то же число, а не отдельную независимую константу").
//
// product.md describes the formula in words, not as code ("энергия дня" =
// biorhythm + sleep + cycle, moon/sun stay a secondary layer, not part of
// this number). This file is the one place that turns that description into
// an actual calculation - owning it here, not duplicating it separately in
// HomeScreen.tsx and CareScreen.tsx.
//
// Shape chosen: plain mean of whichever 0-100 components are actually
// available, each normalized the same way biorhythm's own scale already is
// (0 = the cycle's low point, 100 = its high point). Missing components
// (no sleep entered yet, cycle not applicable/not entered) are left out of
// the average entirely rather than defaulting to some fixed number - a
// profile with only a birth date isn't "missing 2/3 of its energy," it just
// doesn't have those inputs yet (decision 2026-11-21/22 #2: no source is
// singled out or treated as "at fault" for being absent).
import { getBiorhythmValues, type BirthDate, type BiorhythmValues } from './biorhythm';
import type { CycleRange, SleepSchedule } from './onboardingProfile';

export type EnergySource = 'biorhythm' | 'sleep' | 'cycle';
export type EnergyResult = { value: number; sources: EnergySource[] };

function biorhythmScore(values: BiorhythmValues): number {
  return (values.physical + values.emotional + values.intellect) / 3;
}

// Mirrors SleepWheelPicker.tsx's own LOOP_MIN/duration convention exactly
// (a single 12h loop is enough range for any realistic sleep duration) -
// not re-deriving a second formula for the same bedtime/waketime shape.
const LOOP_MIN = 720;

function sleepDurationMinutes(sleep: SleepSchedule): number {
  return ((sleep.waketimeMin - sleep.bedtimeMin + LOOP_MIN) % LOOP_MIN) || LOOP_MIN;
}

// Tier A heuristic (claims-reviewer protocol, decisions.md 2026-11-21/22
// #5 - sleep is evidence-backed, a plain heuristic is allowed): 8h scores
// 100, less scores down proportionally, more is never scored *down* - the
// product has no grounds to tell someone they slept "too much," and
// product.md's own CJM barriers warn against anything that reads as a
// judgment on a single number.
function sleepScore(sleep: SleepSchedule): number {
  const minutes = sleepDurationMinutes(sleep);
  return Math.min(100, (minutes / 480) * 100);
}

function dayNumberUTC(d: { year: number; month: number; day: number }): number {
  return Math.floor(Date.UTC(d.year, d.month, d.day) / 86400000);
}

// Tier A heuristic (same protocol): one gentle cosine over a standard
// 28-day cycle, low point on day 0 (the entered period start date), high
// point around day 14 - product.md's own description ("фаза перед
// менструацией обычно означает меньше энергии, овуляция — больше"), not a
// cycle-phase diagnosis or a fertility/ovulation prediction.
function cycleScore(cycle: CycleRange, today: Date): number {
  const startDay = dayNumberUTC(cycle.start);
  const todayDay = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  const dayOfCycle = (((todayDay - startDay) % 28) + 28) % 28;
  return ((1 - Math.cos((2 * Math.PI * dayOfCycle) / 28)) / 2) * 100;
}

export function computeEnergy({
  birthDate,
  sleep,
  cycle,
  today = new Date(),
}: {
  birthDate: BirthDate | null;
  sleep: SleepSchedule | null;
  cycle: { range: CycleRange | null; notApplicable: boolean };
  today?: Date;
}): EnergyResult | null {
  // Birth date is the one hard gate (decision 2026-11-21/22 #2) - the only
  // source every profile could in principle have before anything else is
  // entered, and the only one the other two can't stand in for.
  if (!birthDate) return null;

  const sources: EnergySource[] = ['biorhythm'];
  const scores: number[] = [biorhythmScore(getBiorhythmValues(birthDate, today))];

  if (sleep) {
    sources.push('sleep');
    scores.push(sleepScore(sleep));
  }
  if (cycle.range && !cycle.notApplicable) {
    sources.push('cycle');
    scores.push(cycleScore(cycle.range, today));
  }

  const value = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return { value: Math.round(value), sources };
}
