// The onboarding answers that later steps AND Home/Care now depend on.
// Plain in-memory module state - there is no persistence/state layer in the
// app yet (see backlog, and brief 001's explicit non-goal: this cycle wires
// *within-session* answers through, not across app restarts). Everything
// here is only ever read after the screen that set it has already
// navigated away (onboarding is a straight-line stack, Home/Care are only
// reached after it), so plain module state needs no subscribe/notify layer
// to be "reactive enough" - a screen that reads one of these getters in its
// render body already sees the latest value on every one of its own
// mounts/re-renders, which is the only time any of this ever needs to
// change on screen. Replace with the real profile store (expo-secure-store,
// per decisions.md 2026-09-18) when persistence is actually built.
import type { BirthDate } from './biorhythm';
import type { CalendarDate } from '../components/CalendarRangePicker';

export type Gender = 'female' | 'male';
export type SleepSchedule = { bedtimeMin: number; waketimeMin: number };
export type CycleRange = { start: CalendarDate; end: CalendarDate };

let gender: Gender | null = null;
let birthDate: BirthDate | null = null;
let sleep: SleepSchedule | null = null;
let cycleRange: CycleRange | null = null;
// Three-state, not two (brief 001, decision 2026-11-21/22 #3): a profile can
// have a real range, no answer yet (both null, `false`), or an explicit "this
// doesn't apply to me right now" (`true`, range cleared) - the cycle step's
// new no-regular-cycle option needs to be told apart from "hasn't gotten to
// this step yet," not collapsed into the same "no data" bucket, even though
// both currently mean "skip the cycle component of the energy composite."
let cycleNotApplicable = false;
// Set by MoodCheckIn.tsx (see its own comment) - lifted up here so it's not
// stranded in that one component's local useState, per this brief's ask,
// even though the Home/Care energy composite itself doesn't use it (see
// lib/energy.ts) - product.md's "energy of the day" formula is biorhythm +
// sleep + cycle, mood isn't one of its inputs. This exists so any screen can
// ask "did today get a mood answer yet" without re-deriving it.
let todayMoodIndex: number | null = null;

export function setOnboardingGender(value: Gender) {
  gender = value;
}

export function getOnboardingGender() {
  return gender;
}

export function includesCycleStep() {
  return gender === 'female';
}

// "Шаг X/N" of the profile mini-flow: date of birth, sleep, [cycle], mood.
export function profileStepTotal() {
  return includesCycleStep() ? 4 : 3;
}

export function setOnboardingBirthDate(value: BirthDate) {
  birthDate = value;
}

export function getOnboardingBirthDate() {
  return birthDate;
}

export function setOnboardingSleep(value: SleepSchedule) {
  sleep = value;
}

export function getOnboardingSleep() {
  return sleep;
}

export function setOnboardingCycleRange(range: CycleRange) {
  cycleRange = range;
  cycleNotApplicable = false;
}

// The cycle step's "У меня сейчас нет регулярного цикла" button (brief 001)
// - a real answer ("doesn't apply"), not a skip, so it's stored distinctly
// from `cycleRange` staying null.
export function setOnboardingCycleNotApplicable() {
  cycleRange = null;
  cycleNotApplicable = true;
}

export function getOnboardingCycle(): { range: CycleRange | null; notApplicable: boolean } {
  return { range: cycleRange, notApplicable: cycleNotApplicable };
}

export function setTodayMood(index: number) {
  todayMoodIndex = index;
}

export function getTodayMood() {
  return todayMoodIndex;
}
