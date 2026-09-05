import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions, type ImageSourcePropType, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { StoryProgress } from '../components/StoryProgress';
import { TeaRecipeRow } from '../components/TeaRecipeRow';
import { BackIcon } from '../components/icons/BackIcon';

type Slide = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  // Each PNG is now cropped tight to its own real drawn content (no more
  // invisible margin baked into a shared canvas size - see the note above
  // SLIDES) - its own real width/height ratio, not a shared one, so a single
  // fixed display height actually renders every plant at the same true
  // visual size instead of just the same bounding box.
  imageRatio: number;
  recipe?: { icon: 'spoon' | 'kettle' | 'clock'; label: string }[];
};

// WF 29-35 "Чай как ритуал", her own drawn screens (Claude AI/v2/.../Calming
// teas screens) - copy ported verbatim from those, not reworded (only
// glued with non-breaking spaces per the project's standing "hanging
// prepositions" rule - see feedback_rn_app_ui_defaults.md). Only one
// category is actually designed content-wise ("Успокоение на вечер"); the
// other 4 category cards on WF29 have no herb screens behind them yet, so
// this screen goes straight there - her explicit framing 2026-09-06: "в
// наших условиях сейчас, если учитывать что у человека ресурс не очень и
// надо успокоиться" - not a real state->category engine, just today's one
// real path. The WF29 category-picker screen itself is skipped entirely.
//
// Image files were originally a Figma "image fill" export: every plant sat
// on the same fixed 941x1672 canvas regardless of how much of it the actual
// drawing used, so a fixed display box made some plants (e.g. the intro's
// tall multi-sprig composition) look much bigger than others (e.g. one
// single herb) even at the identical box size - invisible on an opaque
// background, but obvious once the background was made transparent
// (2026-09-06: "увеличь сами изображения трав так, чтобы они визуально были
// такой же высоты как трава на экране 'Успокоение на вечер'"). Cropped each
// PNG to its own real alpha bounding box (+6px breathing room) instead, so
// `imageRatio` below is each plant's own true width/height.
const SLIDES: Slide[] = [
  {
    title: 'Успокоение\nна вечер',
    description: 'Этот набор трав помогает телу замедлиться, снизить напряжение и мягко перейти к отдыху',
    image: require('../assets/tea/intro.png'),
    imageRatio: 358 / 669,
  },
  {
    title: 'Ромашка',
    description:
      'Ромашка известна своим мягким расслабляющим действием, помогает снизить внутреннее напряжение и поддерживает спокойное состояние.',
    image: require('../assets/tea/camomille.png'),
    imageRatio: 228 / 468,
    recipe: [
      { icon: 'spoon', label: '1–2 ч. л. на чашку' },
      { icon: 'kettle', label: 'Горячая, но не кипящая вода' },
      { icon: 'clock', label: 'Настаивать 5–7 минут' },
    ],
  },
  {
    title: 'Мелисса',
    description:
      'Мелисса часто используется при эмоциональном напряжении и беспокойстве. Её аромат и вкус создают ощущение уюта и безопасности.',
    image: require('../assets/tea/melissa.png'),
    imageRatio: 235 / 514,
    recipe: [
      { icon: 'spoon', label: '1 ч. л. на чашку' },
      { icon: 'kettle', label: 'Температура воды до 90°C' },
      { icon: 'clock', label: 'Настаивать 5 минут' },
    ],
  },
  {
    title: 'Лаванда',
    description: 'Лаванда помогает телу перейти в состояние покоя и расслабления. Подходит для вечерних ритуалов и перед сном.',
    image: require('../assets/tea/lavender.png'),
    imageRatio: 144 / 489,
    recipe: [
      { icon: 'spoon', label: '½–1 ч. л.' },
      { icon: 'kettle', label: 'Залить горячей водой' },
      { icon: 'clock', label: 'Настаивать 3–5 минут' },
    ],
  },
  {
    title: 'Валериана',
    description: 'Валериана традиционно используется для поддержки спокойствия и снятия внутреннего напряжения.',
    image: require('../assets/tea/valeriana.png'),
    imageRatio: 146 / 406,
    recipe: [
      { icon: 'spoon', label: 'Небольшое количество' },
      { icon: 'kettle', label: 'Залить горячей водой' },
      { icon: 'clock', label: 'Настаивать 10 минут' },
    ],
  },
  {
    title: 'Липовый цвет',
    description: 'Липа создаёт ощущение тепла и расслабления. Часто используется в вечерних ритуалах заботы о себе.',
    image: require('../assets/tea/linden.png'),
    imageRatio: 157 / 406,
    recipe: [
      { icon: 'spoon', label: '1 ст. л.' },
      { icon: 'kettle', label: 'Горячая вода' },
      { icon: 'clock', label: 'Настаивать 7–10 минут' },
    ],
  },
];

// Fixed from the safe area instead of vertically centering the whole
// (variable-height) content block - centering made herb slides' title sit
// higher than the intro slide's, since their extra recipe rows made that
// centered block taller (2026-09-06: "заголовки на след сторис... сейчас
// они задраны высоко"). Same fixed-offset pattern as breathing's own
// ORB_TOP_OFFSET, tuned to land the title where it read correctly on the
// intro slide.
const TITLE_TOP_OFFSET = 80;

// Baseline for the herb slides (1-5). Sized down 20% from the first pass -
// at full size, with a 3-row recipe list below, there was no room left for
// any bottom margin at all before hitting the screen edge (2026-09-07: "между
// рецептом и низом экрана вообще нет расстояния").
const IMAGE_HEIGHT = 244 * 0.8;

// Intro slide (no recipe below it, so there's real room) gets its plant
// grown until its description lands exactly 160px above the literal screen
// edge - the same flat "160" convention Home/Care already use for their own
// last element (2026-09-07: "травку на первой сторис сделаем значительно
// побольше, чтобы текст описание был в 160 пикселях от нижнего края").
// Solved from a real measured description height (word-wrap isn't
// predictable from character count alone), not guessed - same "measure,
// don't eyeball" approach as MoodScale's hidden label twins.
const INTRO_TITLE_HEIGHT = 30 * 1.15 * 2; // always exactly 2 lines ("Успокоение\nна вечер")
const INTRO_BOTTOM_GAP = 160;

export function TeaCeremonyScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  // No completion screen exists for this flow yet (unlike breathing's own
  // BreathingComplete) - advancing past the last herb just returns to Care,
  // same destination as backing out of the very first slide. Flagged to her
  // as an assumption, not a drawn spec.
  const goNext = () => (index < SLIDES.length - 1 ? setIndex(index + 1) : navigation.goBack());
  const goBack = () => (index > 0 ? setIndex(index - 1) : navigation.goBack());

  const [introDescHeight, setIntroDescHeight] = useState<number | null>(null);
  const introImageHeight = introDescHeight
    ? screenHeight - INTRO_BOTTOM_GAP - introDescHeight - 20 - (insets.top + TITLE_TOP_OFFSET + INTRO_TITLE_HEIGHT + 20)
    : IMAGE_HEIGHT * 1.6; // reasonable placeholder for the one frame before the real measurement lands
  const imageHeight = index === 0 ? introImageHeight : IMAGE_HEIGHT;

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />

      <View style={[styles.progressWrap, { top: insets.top + 16 }]}>
        <StoryProgress total={SLIDES.length} activeIndex={index} />
      </View>

      {/* Moved above `content` (was below it) - `content` needs to render
          AFTER this tap-catching layer so its own "К другим чаям" link (a
          real Pressable) wins touch priority in its own small area, same
          reasoning as the back button below: a later sibling wins touch
          priority over an earlier one at the same screen position. Every
          other part of `content` has no Pressable of its own, so touches
          there still fall through to these zones as before. */}
      <View style={styles.tapZones} pointerEvents="box-none">
        <Pressable style={styles.tapZoneLeft} onPress={goBack} />
        <Pressable style={styles.tapZoneRight} onPress={goNext} />
      </View>

      {/* Herb slides (with a recipe list): paddingBottom matches the fixed
          insets.bottom+40 this app already uses for a non-scrolling
          single-focus screen's last element (BreathingInfoScreen/
          BreathingCompleteScreen's own CTA). The intro slide gets none here -
          its own bottom gap is already solved exactly via introImageHeight
          above, adding this on top would overshoot her literal "160" ask. */}
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + TITLE_TOP_OFFSET, paddingBottom: index === 0 ? 0 : insets.bottom + 40 },
        ]}
      >
        <Text style={styles.title}>{slide.title}</Text>
        <Image
          source={slide.image}
          resizeMode="contain"
          style={{ width: imageHeight * slide.imageRatio, height: imageHeight, marginTop: 20 }}
        />
        <Text style={styles.description}>{slide.description}</Text>
        {slide.recipe ? (
          <View style={styles.recipeList}>
            {slide.recipe.map((r, i) => (
              <TeaRecipeRow key={i} icon={r.icon} label={r.label} />
            ))}
          </View>
        ) : null}
        {/* Only on the last herb - her ask 2026-09-07: "на последней сторис
            сделаем внизу под рецептом слово-ссылку 'К другим чаям'". Same
            text-link style Care/Home already use for "Все статьи" (the
            closest existing analog: a link below a list, to see more of the
            same kind of thing), not the separate violet-300-no-underline
            "ghost button" convention (feedback_rn_app_ui_defaults.md) - that
            one's for a distinct action, not a see-more link. */}
        {index === SLIDES.length - 1 ? (
          <Pressable onPress={() => navigation.navigate('TeaCategories')} hitSlop={8}>
            <Text style={styles.otherTeasLink}>К другим чаям</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Invisible twin, real width but off-screen - measures the intro
          description's actual wrapped height so introImageHeight above can
          solve for an exact "160px to the screen edge" instead of a guess
          (word-wrap isn't predictable from character count alone, same
          reasoning as MoodScale's own hidden label twins). */}
      <Text
        style={[styles.description, styles.hiddenMeasure, { width: screenWidth - 48 }]}
        onLayout={(e: LayoutChangeEvent) => setIntroDescHeight(e.nativeEvent.layout.height)}
      >
        {SLIDES[0].description}
      </Text>

      {/* Visible only on the entry slide, matching her own drawn screens
          (the back chevron only appears on WF30's intro, not the herb
          slides) - herb-to-herb navigation relies on the tap zones alone,
          same convention OnboardingSlide already uses for its own story-like
          flow. */}
      {index === 0 ? (
        <Pressable style={[styles.backButton, { top: insets.top + 56 }]} onPress={() => navigation.goBack()} hitSlop={8}>
          <BackIcon />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  progressWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
    lineHeight: 30 * 1.15,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    marginTop: 20,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  // No card/border - round 2 after a bordered card still read wrong to her
  // (2026-09-07: "не нравится как оформлены"). The title/illustration/
  // description above never sit in a box either; a boxed recipe was the one
  // chrome element on an otherwise open, starfield-backed screen. Quiet
  // list instead, spacing doing all the grouping work.
  recipeList: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  // Same "Все статьи" text-link style Care/Home already use (see
  // CareScreen.tsx's own `allArticles`) - the closest existing analog.
  otherTeasLink: {
    marginTop: 24,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#E0DBFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  hiddenMeasure: {
    position: 'absolute',
    opacity: 0,
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
  },
  tapZoneLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '35%',
  },
  tapZoneRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '65%',
  },
});
