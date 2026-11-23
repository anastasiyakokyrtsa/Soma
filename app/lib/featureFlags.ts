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

// Brief 003 / decisions.md 2026-11-21/22 #6 - the two brand-new, unvoiced
// practice flows this cycle adds behind Care's "Медитации"/"Сказки" chips
// (MeditationList -> Info -> Session -> Complete, StoriesList -> StoryReader).
// One flag for both since they shipped together in the same cycle and share
// the same risk profile (a new, not-yet-production-reviewed content surface)
// - split into two flags later only if one needs pulling without the other.
// `true` = shipped; flip to `false` to instantly fall back to the chips'
// previous dead-tap state (CareScreen checks this before wiring their
// onPress) without a code revert.
export const FEATURE_CARE_PRACTICES = true;

// ADR 001 "3. Чай ×4 категории" / decisions.md 2026-11-21/22 #6 - turns
// TeaCategoriesScreen's 4 "Скоро" cards (soft energy, focus, warmth,
// intuitive choice) into real destinations and parametrizes
// TeaCeremonyScreen by category instead of its old single hardcoded
// "Успокоение на вечер" SLIDES array (content/teaCategories.ts). `false`
// restores the exact previous behavior (only "Успокоение на вечер"
// available, the other 4 cards shown with the "Скоро" badge and disabled) -
// kept separate from FEATURE_CARE_PRACTICES since illustrations for
// categories 2-4 are still a placeholder (owner's real art lands next
// cycle), a materially different risk/completeness profile than the
// meditation/story flows.
export const FEATURE_TEA_FULL_CATEGORIES = true;
