// Ported 1:1 from --sp-1..--sp-10 in UI Kit/css/style.css.
export const spacing = {
  sp1: 4,
  sp2: 8,
  sp3: 12,
  sp4: 16,
  sp5: 20,
  sp6: 24,
  sp7: 32,
  sp8: 40,
  sp9: 48,
  sp10: 64,
} as const;

// Ported 1:1 from --r-* in UI Kit/css/style.css, plus the `card` swatch added
// 2026-07-29 for the 30px radius used by nav-chip/stat-card/mini-tile/list-row/
// article-card/quote-card/tea-category-card (a real, frequently-used value distinct
// from --r-lg, which stays 28px for the separately-verified Moon/Sun card).
export const radius = {
  xs: 10,
  sm: 14,
  md: 20,
  lg: 28,
  card: 30,
  xl: 36,
  pill: 999,
} as const;
