export type BirthDate = { day: number; month: number; year: number };
export type BiorhythmValues = { physical: number; emotional: number; intellect: number };

// Classical biorhythm formula (physical 23-day / emotional 28-day /
// intellectual 33-day cycles from date of birth) - genuinely computed from
// the date entered, not the hand-authored 9-day demo curve BiorhythmChart.tsx
// uses on Home. First real use: the onboarding insight screen right after
// date-of-birth entry (2026-09-15) - showing something "as if" computed
// would contradict the whole point of that screen and everything already
// decided about honest claims (audit findings #3/#9).
//
// `month` is 0-indexed, same as JS Date - not a second convention to track
// (ProfileDateOfBirthScreen.tsx converts to/from a real Date for the native
// date picker, this shape is just the plain-data form carried between
// screens).
//
// Scale: 0-100, 50 = the cycle's zero-crossing, not a negative/positive
// split - matches BiorhythmChart's own established "no negatives" convention
// (see that file's yToPct comment, 2026-08-19: "уберу минусы").
export function getBiorhythmValues(birth: BirthDate, on: Date = new Date()): BiorhythmValues {
  const birthUTC = Date.UTC(birth.year, birth.month, birth.day);
  const onUTC = Date.UTC(on.getFullYear(), on.getMonth(), on.getDate());
  const daysSinceBirth = Math.floor((onUTC - birthUTC) / 86400000);

  const cyclePct = (periodDays: number) => {
    const phase = (2 * Math.PI * daysSinceBirth) / periodDays;
    return ((Math.sin(phase) + 1) / 2) * 100;
  };

  return {
    physical: cyclePct(23),
    emotional: cyclePct(28),
    intellect: cyclePct(33),
  };
}

export type CycleId = 'physical' | 'emotional' | 'intellect';

// Which of the 3 cycles reads most extreme today (furthest from the 50
// crossing point, either direction) - the one worth mentioning in a single
// one-line insight, rather than all three at once (habit-designer's call,
// 2026-09-15: a full 3-line chart is noise for someone who doesn't yet know
// what biorhythms are).
export function getStandoutCycle(values: BiorhythmValues): { cycle: CycleId; direction: 'high' | 'low' } {
  const entries: [CycleId, number][] = [
    ['physical', values.physical],
    ['emotional', values.emotional],
    ['intellect', values.intellect],
  ];
  const [cycle, value] = entries.reduce((most, entry) => (Math.abs(entry[1] - 50) > Math.abs(most[1] - 50) ? entry : most));
  return { cycle, direction: value >= 50 ? 'high' : 'low' };
}
