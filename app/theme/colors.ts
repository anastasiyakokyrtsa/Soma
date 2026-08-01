// Ported 1:1 from UI Kit/css/style.css :root — keep in sync, don't fork values.
// card-fill/-sm are CSS radial-gradients with no direct RN equivalent; approximated
// here as flat fallback colors — build the real look with expo-linear-gradient or
// Skia's RadialGradient when implementing the Card component, using the recipe
// documented next to --card-fill in style.css.

export const colors = {
  bg0: '#050816',

  cardFillFallback: '#0B0E1F',
  cardFillSmFallback: '#0C1022',

  borderSoft: 'rgba(255,255,255,0.08)',
  borderDefault: 'rgba(255,255,255,0.24)',
  borderVioletFlat: 'rgba(168,156,248,0.85)',
  borderVioletStrong: 'rgba(139,124,246,0.55)',

  violet200: '#C9BBFA',
  violet300: '#A89CF8',
  violet400: '#8B7CF6',
  violet500: '#7B6FF0',
  violet600: '#6355D6',
  violet700: '#4C41B0',
  // inactive progress-dot fill — from the "About app" onboarding screens (Figma),
  // distinct from violet200, not seen in the kit's own token set before this
  dotInactive: '#E0DBFF',

  pink300: '#FBD3F1',
  pink400: '#F3A6E0',
  pink500: '#E285D1',

  green300: '#B7F5D8',
  green400: '#6EE7B7',
  green500: '#4ADE9A',

  red400: '#F0847F',

  textPrimary: '#FFFFFF',
  textSecondary: '#A6ABC6',
  textTertiary: '#6E7390',
  textDisabled: '#454A63',
} as const;

// Gradient stop lists for expo-linear-gradient (colors + locations), ported from
// the CSS gradient tokens of the same name.
export const gradients = {
  headingText: {
    colors: ['#FFC6F1', '#A89CF8', '#8B7CF6'],
    locations: [0.25, 0.7, 1] as [number, number, number],
  },
  borderGradient: {
    colors: ['rgba(168,156,248,1)', 'rgba(168,156,248,0.8)'],
  },
  borderGradient50: {
    colors: ['rgba(168,156,248,0.5)', 'rgba(168,156,248,0.4)'],
  },
} as const;

// box-shadow / filter:drop-shadow tokens — RN has no colored-glow shadow on Android
// without extra work; use Skia (shadow/glow filters) or a blurred-view trick per
// platform. Kept here as the source values so nothing has to be re-measured.
export const glow = {
  card: { color: 'rgba(0,0,0,0.45)', offset: { x: 0, y: 8 }, blur: 30 },
  btn: { color: '#8B7CF6', blur: 15 },
  // onboarding primary button specifically specs a softer 7.5px glow, not the
  // kit-wide 15px --glow-btn — kept as its own literal value per Figma
  btnSoft: { color: '#8B7CF6', blur: 7.5 },
  chartGreen: { color: '#7DE8C4', blur: 6 },
  chartPink: { color: '#FFD8F6', blur: 6 },
  chartViolet: { color: '#B6ABFF', blur: 6 },
  iconGradient: { color: '#8B7CF6', blur: 5 }, // exact spec: drop-shadow 0 0 5px #8B7CF6 100%
} as const;
