// First real feature-flag in this codebase - no existing flag/remote-config
// infra to extend (grepped before adding this; the closest precedent is a
// handful of one-off local override constants like
// ProfileDateOfBirthScreen.tsx's FORCE_IOS_WHEEL_PREVIEW or
// BiorhythmInsightScreen.tsx's USE_HOME_DEMO_INSIGHT). Kept intentionally
// tiny - a plain exported boolean, no remote config/AB-testing service - so
// a new scenario can ship behind something flip-able (CLAUDE-team.md's
// standing rule) without pulling in a whole flag-service dependency for a
// still-mid-build single-dev app. Flip to `false` to instantly restore the
// FAB's previous no-op behavior if brief 002's quick-log needs to be pulled
// without a code revert.
export const FEATURE_FAB_QUICK_LOG = true;
