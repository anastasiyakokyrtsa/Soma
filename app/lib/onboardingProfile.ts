// The onboarding answers that later steps AND Home/Care now depend on.
// Plain in-memory module state - there is no persistence/state layer in the
// app yet (see backlog, and brief 001's explicit non-goal: this cycle wires
// *within-session* answers through, not across app restarts). Brief 001's own
// assumption was that these only ever change while the screen reading them is
// unmounted (onboarding is a straight-line stack, Home/Care only mount after
// it) - true for onboarding itself, but brief 002's FAB quick-log breaks that
// assumption on purpose: it edits sleep/cycle from a sheet opened *on top of*
// an already-mounted, already-focused Home or Care, which needs to see the
// new number the instant the sheet closes, not on some later unrelated
// re-render. Hence the small notify/subscribe layer below - still not a real
// store (no selectors, no persistence), just enough so a screen can ask to be
// told "something that feeds the energy composite changed." Replace with the
// real profile store (expo-secure-store, per decisions.md 2026-09-18) when
// persistence is actually built.
import type { BirthDate } from './biorhythm';
import type { CalendarDate } from '../components/CalendarRangePicker';
import type { SupportOptionId } from '../i18n/dictionaries/onboarding';

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

// Home/Care (and anything else reading the energy composite) subscribe here
// instead of polling - returns an unsubscribe function, the usual
// useEffect-cleanup shape.
export function subscribeOnboardingProfile(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

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
// stranded in that one component's local useState, per this brief's ask.
// product.md's "energy of the day" formula (biorhythm + sleep + cycle)
// still doesn't read this - but lib/focusRecommendations.ts's P1 now does
// (находка №18 follow-up, 2026-11-23: mood is Tier A, highest-priority
// signal for Home's "Фокус дня" cards), so `notify()` on set is no longer
// optional the way the original comment here assumed - without it, marking
// today's mood wouldn't make Home's focus cards update until something
// else happened to re-render the screen.
let todayMoodIndex: number | null = null;
// SupportScreen's "Где тебе нужна поддержка больше всего?" (находка №18,
// 2026-11-23) - was collected into the screen's own local useState and
// discarded the moment it navigated onward, the only onboarding step whose
// answer never made it here. Stored as stable ids (SupportOptionId), not the
// displayed strings, same reasoning as the comment on supportOptionIds. Not
// consumed by anything yet (FocusCard personalization is separate, follow-up
// work) - this only stops the answer from being thrown away before that
// work exists to read it.
let supportAreas: SupportOptionId[] = [];

export function setOnboardingGender(value: Gender) {
  gender = value;
}

export function getOnboardingGender() {
  return gender;
}

export function includesCycleStep() {
  return gender === 'female';
}

// Brief 002 (FAB quick-log) - single source of truth for "does this profile
// have a cycle component the + button should offer at all." Not just
// `includesCycleStep()`: a profile that already answered "у меня сейчас нет
// регулярного цикла" (setOnboardingCycleNotApplicable) is a real, explicit
// answer too, not a female profile still waiting on cycle data - the FAB
// shouldn't keep surfacing a Cycle tile for an answer that's already "this
// doesn't apply to me."
export function hasRelevantCycle() {
  return includesCycleStep() && !cycleNotApplicable;
}

// "Шаг X/N" of the profile mini-flow: date of birth, sleep, [cycle], mood.
export function profileStepTotal() {
  return includesCycleStep() ? 4 : 3;
}

export function setOnboardingBirthDate(value: BirthDate) {
  birthDate = value;
  notify();
}

export function getOnboardingBirthDate() {
  return birthDate;
}

export function setOnboardingSleep(value: SleepSchedule) {
  sleep = value;
  notify();
}

export function getOnboardingSleep() {
  return sleep;
}

export function setOnboardingCycleRange(range: CycleRange) {
  cycleRange = range;
  cycleNotApplicable = false;
  notify();
}

// The cycle step's "У меня сейчас нет регулярного цикла" button (brief 001)
// - a real answer ("doesn't apply"), not a skip, so it's stored distinctly
// from `cycleRange` staying null.
export function setOnboardingCycleNotApplicable() {
  cycleRange = null;
  cycleNotApplicable = true;
  notify();
}

export function getOnboardingCycle(): { range: CycleRange | null; notApplicable: boolean } {
  return { range: cycleRange, notApplicable: cycleNotApplicable };
}

export function setOnboardingSupportAreas(ids: SupportOptionId[]) {
  supportAreas = ids;
  notify();
}

export function getOnboardingSupportAreas() {
  return supportAreas;
}

export function setTodayMood(index: number) {
  todayMoodIndex = index;
  notify();
}

export function getTodayMood() {
  return todayMoodIndex;
}
