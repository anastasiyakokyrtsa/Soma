import type { ImageSourcePropType } from 'react-native';

// Content model for "Чай как ритуал" (TeaCategoriesScreen -> TeaCeremonyScreen),
// by category - built for the brief that turned the single hardcoded
// "Успокоение на вечер" story into 4 real categories + the "Интуитивный
// выбор" mechanic (ADR 001 "3. Чай ×4 категории"; decisions.md
// 2026-11-21/22 #6). Replaces TeaCeremonyScreen's own old module-local
// `SLIDES` array, which only ever knew about one category.
//
// Text lives in i18n/dictionaries/tea.ts as usual (useT() keys) - this file
// only holds the *shape* (which herbs, in which order, with which image/
// recipe-icon set), same split TeaCeremonyScreen's old SLIDES already used
// (titleKey/descKey, not literal strings).
//
// Illustrations: category 1 ("Успокоение на вечер") keeps its own real
// per-herb art, ported as-is - it was already live content, nothing here
// changes its text or images. Categories 2-4 are brand new this cycle and
// have no real illustrations yet (owner said she'll send art later -
// decisions.md 2026-11-21/22 #6: "без иллюстраций ... оставить место под
// них"). Per tech-lead's own suggested alternative in the ADR ("переиспользовать
// уменьшенную категорийную картинку вместо уникальной иллюстрации травы"),
// every intro/herb slide in categories 2-4 reuses that category's own
// thumbnail (the same image already shown on TeaCategoriesScreen's card) as
// a visibly-repeated stand-in, not a hand-drawn placeholder pretending to be
// final art - `isPlaceholderImage: true` tells the screen to also show a
// small "Иллюстрация появится позже" caption under it, so nothing here reads
// as a finished (but wrong) illustration.
export type TeaRecipeIconName = 'spoon' | 'kettle' | 'clock';

export type TeaHerbContent = {
  // Stable id, never shown to the user - only used to build the flat pool
  // for "Интуитивный выбор" (category 5) and as a React key.
  id: string;
  titleKey: string;
  descKey: string;
  spoonKey: string;
  kettleKey: string;
  clockKey: string;
  image: ImageSourcePropType;
  imageRatio: number;
  isPlaceholderImage?: boolean;
};

export type TeaCategoryContent = {
  id: TeaCategoryId;
  introTitleLine1Key: string;
  introTitleLine2Key: string;
  introDescKey: string;
  introImage: ImageSourcePropType;
  introImageRatio: number;
  introIsPlaceholderImage?: boolean;
  herbs: TeaHerbContent[];
};

// 4 "real" categories - category 5 ("Интуитивный выбор") isn't one of these:
// it has no herb list of its own, it draws from all of them (see
// ALL_TEA_HERBS below and TeaIntuitiveChoiceScreen.tsx).
export const TEA_CATEGORY_IDS = ['calming', 'softEnergy', 'focus', 'warmth'] as const;
export type TeaCategoryId = (typeof TEA_CATEGORY_IDS)[number];

const categorySoftEnergyImage = require('../assets/tea/category-soft-energy.png');
const categoryFocusImage = require('../assets/tea/category-focus.png');
const categoryWarmthImage = require('../assets/tea/category-warmth.png');

// Same ratios TeaCategoriesScreen's own CATEGORIES array already uses for
// these 3 thumbnails - not re-measured, just reused for the exact same file.
const SOFT_ENERGY_RATIO = 734 / 686;
const FOCUS_RATIO = 686 / 686;
const WARMTH_RATIO = 686 / 686;

export const TEA_CATEGORIES: Record<TeaCategoryId, TeaCategoryContent> = {
  // Real, already-shipped content - ported verbatim from the old SLIDES
  // array, text untouched.
  calming: {
    id: 'calming',
    introTitleLine1Key: 'tea.introTitleLine1',
    introTitleLine2Key: 'tea.introTitleLine2',
    introDescKey: 'tea.introDesc',
    introImage: require('../assets/tea/intro.png'),
    introImageRatio: 358 / 669,
    herbs: [
      {
        id: 'camomile',
        titleKey: 'tea.camomileTitle',
        descKey: 'tea.camomileDesc',
        spoonKey: 'tea.camomileSpoon',
        kettleKey: 'tea.camomileKettle',
        clockKey: 'tea.camomileClock',
        image: require('../assets/tea/camomille.png'),
        imageRatio: 228 / 468,
      },
      {
        id: 'melissa',
        titleKey: 'tea.melissaTitle',
        descKey: 'tea.melissaDesc',
        spoonKey: 'tea.melissaSpoon',
        kettleKey: 'tea.melissaKettle',
        clockKey: 'tea.melissaClock',
        image: require('../assets/tea/melissa.png'),
        imageRatio: 235 / 514,
      },
      {
        id: 'lavender',
        titleKey: 'tea.lavenderTitle',
        descKey: 'tea.lavenderDesc',
        spoonKey: 'tea.lavenderSpoon',
        kettleKey: 'tea.lavenderKettle',
        clockKey: 'tea.lavenderClock',
        image: require('../assets/tea/lavender.png'),
        imageRatio: 144 / 489,
      },
      {
        id: 'valerian',
        titleKey: 'tea.valerianTitle',
        descKey: 'tea.valerianDesc',
        spoonKey: 'tea.valerianSpoon',
        kettleKey: 'tea.valerianKettle',
        clockKey: 'tea.valerianClock',
        image: require('../assets/tea/valeriana.png'),
        imageRatio: 146 / 406,
      },
      {
        id: 'linden',
        titleKey: 'tea.lindenTitle',
        descKey: 'tea.lindenDesc',
        spoonKey: 'tea.lindenSpoon',
        kettleKey: 'tea.lindenKettle',
        clockKey: 'tea.lindenClock',
        image: require('../assets/tea/linden.png'),
        imageRatio: 157 / 406,
      },
    ],
  },

  // New this cycle - text/recipes real, illustrations placeholder (see file
  // header note).
  softEnergy: {
    id: 'softEnergy',
    introTitleLine1Key: 'tea.cat2IntroTitleLine1',
    introTitleLine2Key: 'tea.cat2IntroTitleLine2',
    introDescKey: 'tea.cat2IntroDesc',
    introImage: categorySoftEnergyImage,
    introImageRatio: SOFT_ENERGY_RATIO,
    introIsPlaceholderImage: true,
    herbs: [
      {
        id: 'lemongrass',
        titleKey: 'tea.lemongrassTitle',
        descKey: 'tea.lemongrassDesc',
        spoonKey: 'tea.lemongrassSpoon',
        kettleKey: 'tea.lemongrassKettle',
        clockKey: 'tea.lemongrassClock',
        image: categorySoftEnergyImage,
        imageRatio: SOFT_ENERGY_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'fireweed',
        titleKey: 'tea.fireweedTitle',
        descKey: 'tea.fireweedDesc',
        spoonKey: 'tea.fireweedSpoon',
        kettleKey: 'tea.fireweedKettle',
        clockKey: 'tea.fireweedClock',
        image: categorySoftEnergyImage,
        imageRatio: SOFT_ENERGY_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'rosehip',
        titleKey: 'tea.rosehipTitle',
        descKey: 'tea.rosehipDesc',
        spoonKey: 'tea.rosehipSpoon',
        kettleKey: 'tea.rosehipKettle',
        clockKey: 'tea.rosehipClock',
        image: categorySoftEnergyImage,
        imageRatio: SOFT_ENERGY_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'seaBuckthorn',
        titleKey: 'tea.seaBuckthornTitle',
        descKey: 'tea.seaBuckthornDesc',
        spoonKey: 'tea.seaBuckthornSpoon',
        kettleKey: 'tea.seaBuckthornKettle',
        clockKey: 'tea.seaBuckthornClock',
        image: categorySoftEnergyImage,
        imageRatio: SOFT_ENERGY_RATIO,
        isPlaceholderImage: true,
      },
    ],
  },

  focus: {
    id: 'focus',
    introTitleLine1Key: 'tea.cat3IntroTitleLine1',
    introTitleLine2Key: 'tea.cat3IntroTitleLine2',
    introDescKey: 'tea.cat3IntroDesc',
    introImage: categoryFocusImage,
    introImageRatio: FOCUS_RATIO,
    introIsPlaceholderImage: true,
    herbs: [
      {
        id: 'rosemary',
        titleKey: 'tea.rosemaryTitle',
        descKey: 'tea.rosemaryDesc',
        spoonKey: 'tea.rosemarySpoon',
        kettleKey: 'tea.rosemaryKettle',
        clockKey: 'tea.rosemaryClock',
        image: categoryFocusImage,
        imageRatio: FOCUS_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'tulsi',
        titleKey: 'tea.tulsiTitle',
        descKey: 'tea.tulsiDesc',
        spoonKey: 'tea.tulsiSpoon',
        kettleKey: 'tea.tulsiKettle',
        clockKey: 'tea.tulsiClock',
        image: categoryFocusImage,
        imageRatio: FOCUS_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'lemonVerbena',
        titleKey: 'tea.lemonVerbenaTitle',
        descKey: 'tea.lemonVerbenaDesc',
        spoonKey: 'tea.lemonVerbenaSpoon',
        kettleKey: 'tea.lemonVerbenaKettle',
        clockKey: 'tea.lemonVerbenaClock',
        image: categoryFocusImage,
        imageRatio: FOCUS_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'peppermint',
        titleKey: 'tea.peppermintTitle',
        descKey: 'tea.peppermintDesc',
        spoonKey: 'tea.peppermintSpoon',
        kettleKey: 'tea.peppermintKettle',
        clockKey: 'tea.peppermintClock',
        image: categoryFocusImage,
        imageRatio: FOCUS_RATIO,
        isPlaceholderImage: true,
      },
    ],
  },

  warmth: {
    id: 'warmth',
    introTitleLine1Key: 'tea.cat4IntroTitleLine1',
    introTitleLine2Key: 'tea.cat4IntroTitleLine2',
    introDescKey: 'tea.cat4IntroDesc',
    introImage: categoryWarmthImage,
    introImageRatio: WARMTH_RATIO,
    introIsPlaceholderImage: true,
    herbs: [
      {
        id: 'ginger',
        titleKey: 'tea.gingerTitle',
        descKey: 'tea.gingerDesc',
        spoonKey: 'tea.gingerSpoon',
        kettleKey: 'tea.gingerKettle',
        clockKey: 'tea.gingerClock',
        image: categoryWarmthImage,
        imageRatio: WARMTH_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'cinnamon',
        titleKey: 'tea.cinnamonTitle',
        descKey: 'tea.cinnamonDesc',
        spoonKey: 'tea.cinnamonSpoon',
        kettleKey: 'tea.cinnamonKettle',
        clockKey: 'tea.cinnamonClock',
        image: categoryWarmthImage,
        imageRatio: WARMTH_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'clove',
        titleKey: 'tea.cloveTitle',
        descKey: 'tea.cloveDesc',
        spoonKey: 'tea.cloveSpoon',
        kettleKey: 'tea.cloveKettle',
        clockKey: 'tea.cloveClock',
        image: categoryWarmthImage,
        imageRatio: WARMTH_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'turmeric',
        titleKey: 'tea.turmericTitle',
        descKey: 'tea.turmericDesc',
        spoonKey: 'tea.turmericSpoon',
        kettleKey: 'tea.turmericKettle',
        clockKey: 'tea.turmericClock',
        image: categoryWarmthImage,
        imageRatio: WARMTH_RATIO,
        isPlaceholderImage: true,
      },
      {
        id: 'dandelionRoot',
        titleKey: 'tea.dandelionRootTitle',
        descKey: 'tea.dandelionRootDesc',
        spoonKey: 'tea.dandelionRootSpoon',
        kettleKey: 'tea.dandelionRootKettle',
        clockKey: 'tea.dandelionRootClock',
        image: categoryWarmthImage,
        imageRatio: WARMTH_RATIO,
        isPlaceholderImage: true,
      },
    ],
  },
};

// Flat pool for "Интуитивный выбор" (category 5) - 5+4+4+5 = 18 herbs across
// categories 1-4. Not its own category: it's a mechanic
// (TeaIntuitiveChoiceScreen.tsx) that picks one random entry from this list -
// see that screen for why the result never names which category it came
// from (her spec: "сюрприз важнее категоризации").
export const ALL_TEA_HERBS: TeaHerbContent[] = TEA_CATEGORY_IDS.flatMap((id) => TEA_CATEGORIES[id].herbs);
