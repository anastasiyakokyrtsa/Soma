// Ported from the UI Kit's Typography section (audited against real component
// usage 2026-07-29, not the original aspirational placeholders — see
// UI Kit/index.html #typography and memory/project_ui_kit.md for how each value
// was sourced). Primary font is Nunito Sans — nearly everything in the kit uses it;
// Manrope (`fontManrope`) is only for a handful of interactive-chrome controls
// (buttons, inputs, segmented control).
//
// Fonts still need loading via expo-font (@expo-google-fonts/nunito-sans +
// @expo-google-fonts/manrope) before first render — not wired up yet.

export const fontFamily = {
  nunito: 'NunitoSans_400Regular', // swap per-weight once @expo-google-fonts is installed
  manrope: 'Manrope_400Regular',
} as const;

export const type = {
  display: { fontSize: 48, fontWeight: '300' as const, lineHeight: 48 },
  h1: { fontSize: 32, fontWeight: '400' as const, lineHeight: 32 },
  h2: { fontSize: 26, fontWeight: '800' as const, lineHeight: 31 },
  h3: { fontSize: 22, fontWeight: '700' as const, lineHeight: 26 },
  bodyL: { fontSize: 16, fontWeight: '500' as const, lineHeight: 21 },
  bodyM: { fontSize: 14, fontWeight: '400' as const, lineHeight: 18 },
  bodyS: { fontSize: 13, fontWeight: '400' as const, lineHeight: 17 },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 12 * 0.08,
    textTransform: 'uppercase' as const,
  },
} as const;
