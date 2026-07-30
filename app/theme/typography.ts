// Ported from the UI Kit's Typography section (audited against real component
// usage 2026-07-29 — see UI Kit/index.html #typography and memory/project_ui_kit.md
// for how each value was sourced). Nunito Sans everywhere — no second font.
//
// React Native doesn't do `font-weight` on top of one variable font file the way
// CSS does — each weight is its own loaded font file, so every type style below
// names the exact font family for its weight (registered in App.tsx via useFonts).

export const fontFamily = {
  light: 'NunitoSans_300Light',
  regular: 'NunitoSans_400Regular',
  medium: 'NunitoSans_500Medium',
  semiBold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  extraBold: 'NunitoSans_800ExtraBold',
} as const;

export const type = {
  display: { fontFamily: fontFamily.light, fontSize: 48, lineHeight: 48 },
  h1: { fontFamily: fontFamily.regular, fontSize: 32, lineHeight: 32 },
  h2: { fontFamily: fontFamily.extraBold, fontSize: 26, lineHeight: 31 },
  h3: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 26 },
  bodyL: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 21 },
  bodyM: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 18 },
  bodyS: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 17 },
  caption: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 12 * 0.08,
    textTransform: 'uppercase' as const,
  },
} as const;
