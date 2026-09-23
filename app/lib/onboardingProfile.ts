// The one answer from earlier onboarding that later steps depend on: the
// cycle step is shown only when "Женщина" was chosen on GenderScreen (her
// rule, 2026-09-23; matches scenarios/01-онбординг.md "только для женщин").
// Plain in-memory module state - there is no persistence/state layer in the
// app yet (see backlog), and this is only read at navigation time, so no
// reactivity is needed. Replace with the real profile store when it exists.
export type Gender = 'female' | 'male';

let gender: Gender | null = null;

export function setOnboardingGender(value: Gender) {
  gender = value;
}

export function includesCycleStep() {
  return gender === 'female';
}

// "Шаг X/N" of the profile mini-flow: date of birth, sleep, [cycle], mood.
export function profileStepTotal() {
  return includesCycleStep() ? 4 : 3;
}
