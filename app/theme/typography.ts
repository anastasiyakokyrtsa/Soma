// Ported from the UI Kit's Typography section (audited against real component
// usage 2026-07-29 — see UI Kit/index.html #typography and memory/project_ui_kit.md
// for how each value was sourced). Nunito Sans everywhere, except genuine
// screen/section headlines (bold/extraBold), which are Onest - her call
// after trying a few full-swap pairs, 2026-10-09 ("пусть в заголовках будет
// Onest, а все остальное Nunito Sans как было").
//
// React Native doesn't do `font-weight` on top of one variable font file the way
// CSS does — each weight is its own loaded font file, so every type style below
// names the exact font family for its weight (registered in App.tsx via useFonts).

export const fontFamily = {
  light: 'NunitoSans_300Light',
  regular: 'NunitoSans_400Regular',
  medium: 'NunitoSans_500Medium',
  semiBold: 'NunitoSans_600SemiBold',
  // Headline weights only - every real bold/extraBold usage in this app is a
  // 24px+ screen/section title (greeting, screen titles, card titles like
  // MoonSunCard's, mood title), with one deliberate exception: BottomBar's
  // 10px active-tab label was bold only for emphasis at nav-chrome scale, so
  // it was moved to `semiBold` instead of pulling Onest in for one tiny
  // label (see BottomBar.tsx).
  bold: 'Onest_700Bold',
  extraBold: 'Onest_800ExtraBold',
  // True italic font files, not `fontStyle: 'italic'` on an upright family -
  // iOS doesn't synthesize/slant a custom font the way Android does, so
  // `fontStyle: 'italic'` on e.g. `regular` renders upright on iOS and only
  // actually looks italic on Android (QuoteCard's catch, 2026-10-01). Same
  // "load the real italic file" fix already used for CormorantGaramond on
  // the visual-style preview screen (see App.tsx) - just applied here too,
  // for the two weights QuoteCard actually needs.
  regularItalic: 'NunitoSans_400Regular_Italic',
  mediumItalic: 'NunitoSans_500Medium_Italic',
} as const;

export const type = {
  display: { fontFamily: fontFamily.light, fontSize: 48, lineHeight: 48 },
  h1: { fontFamily: fontFamily.regular, fontSize: 32, lineHeight: 32 },
  h2: { fontFamily: fontFamily.extraBold, fontSize: 26, lineHeight: 31 },
  h3: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 26 },
  // 18, not 16 - her memory of the subtitle-under-a-heading size across the
  // app, restored 2026-10-10 (OnboardingStepLayout's description, and every
  // other "title + description" screen header at this role, got bumped to
  // match - see those files).
  bodyL: { fontFamily: fontFamily.medium, fontSize: 18, lineHeight: 24 },
  bodyM: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 18 },
  bodyS: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 17 },
  caption: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 12 * 0.08,
    textTransform: 'uppercase' as const,
  },
} as const;
