import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, radius } from '../theme';
import { ChevronIcon } from '../components/icons/ChevronIcon';
import { HourglassIcon } from '../components/icons/HourglassIcon';
import { SwipeHandIcon } from '../components/icons/SwipeHandIcon';
import {
  ARTICLE_WATER_SERIES,
  ARTICLE_WATER_TITLE,
  ARTICLE_WATER_SUBTITLE,
  ARTICLE_WATER_READ_TIME,
  ARTICLE_WATER_PAGES,
  type ArticleBlock,
} from '../content/articleWater';

const WATER_IMAGE = require('../assets/articles/water.jpg');
const TOTAL_PAGES = 1 + ARTICLE_WATER_PAGES.length;
const SIDE_MARGIN = 16;
// Literal row height for the "Все статьи / Закрыть" row, used only to
// compute the card's own top offset below - not a measured value, close
// enough to that row's real text+hitSlop height that the 16px gap below it
// (her spec) doesn't visibly drift.
const NAV_ROW_HEIGHT = 24;
// ScrollView clips to its own declared height/viewport (standard behavior,
// not configurable away) - the card's glow (cardGlowActive below) had zero
// vertical room to bleed into since the card's own height fills the
// ScrollView's exactly, so it only ever showed on the left/right (where the
// page's own 16px side padding gave it somewhere to go). The ScrollView's
// canvas is padded by this much on top/bottom, shifted to compensate, and
// each page adds the same amount back as its own vertical padding - same
// "grow the canvas + fold it back" fix as every other glow-clipping bug
// tonight, just applied to a ScrollView instead of an SVG.
const CARD_GLOW_PAD = 16;
// Depth page transition (her ask, 2026-10-09: the page you're swiping away
// from should recede/shrink while the incoming one reads as "closer") -
// same shape as Android's own well-known DepthPageTransformer sample.
// MIN_SCALE/MIN_ALPHA tuned close to the Android reference sample.
// Reverted here from a 0.92/0.03 attempt (2026-10-09) that closed the
// "hole" between cards but flattened the depth effect enough that it
// barely read at all - back to the values that still looked like real
// depth, just with the smaller pullback from the two rounds before that.
const DEPTH_MIN_SCALE = 0.75;
const DEPTH_MIN_ALPHA = 0.5;
const DEPTH_PULLBACK_RATIO = 0.06;

// One page's outer slot, with the depth transform applied to the *whole*
// slot (card + its padding) rather than just the card - driven by `scrollX`,
// a Reanimated shared value updated on the UI thread every frame of the
// gesture (useAnimatedScrollHandler below), not JS-thread state. Tonight's
// Personalization-screen lesson applies here too: anything that has to
// track a continuous gesture smoothly belongs on a shared value, not
// per-frame React state.
function DepthPage({
  pageIndex,
  scrollX,
  width,
  style,
  children,
}: {
  pageIndex: number;
  scrollX: SharedValue<number>;
  width: number;
  style: object;
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollX.value / width - pageIndex;
    // Symmetric now (was outgoing-only) - her follow-up, 2026-10-09: the
    // *incoming* page should also arrive from depth (small/dim/held back)
    // and only reach full size exactly as it settles into place, not slide
    // in already at 1x. `distance` is 0 at the centered/settled position
    // and 1 a full page away on either side.
    const distance = Math.min(Math.abs(position), 1);
    const scale = interpolate(distance, [0, 1], [1, DEPTH_MIN_SCALE], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [0, 1], [1, DEPTH_MIN_ALPHA], Extrapolation.CLAMP);
    // Without this, each page would just slide at the scroll's own 1:1 rate
    // like normal paging. Pulling the outgoing page back (and holding the
    // incoming one further away, catching up as it nears position 0) makes
    // both read as moving through depth rather than sliding flat.
    const translateX = interpolate(position, [-1, 0, 1], [width * DEPTH_PULLBACK_RATIO, 0, -width * DEPTH_PULLBACK_RATIO], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

// Swipe-through article reader (her explicit format choice, 2026-09-16,
// over ux-architect/ui-designer's continuous-scroll recommendation for
// long-form prose) - real horizontal paging via core RN ScrollView
// (`pagingEnabled`), not react-native-gesture-handler. No gesture-handler
// saga needed here: `pagingEnabled` is a native ScrollView feature, not a
// custom gesture, and this screen isn't hosted inside a Modal (the actual
// root cause of InfoSheet's 3-round swipe bug) - genuinely simpler case.
//
// 9 pages total (cover + 8 content pages), down from a stricter 12-page
// "1-2 paragraphs per screen" split - agreed with her directly, combining
// only adjacent short content under the same heading, never merging two
// different section headings onto one page.
//
// First article built this way - the block-based content model
// (content/articleWater.ts's ArticleBlock union) is intentionally generic
// so "Свет и внутренние часы"/"Паузы и восстановление" (already drafted in
// docs/content/статьи.md) can reuse this same screen shape later without
// rebuilding it, even though only Water is wired up for now.
//
// 2026-10-07, take 2 against her reference screenshots - the structural
// change that actually mattered: the water photo + tag pill + page counter
// used to be ONE shared overlay positioned outside the horizontal
// ScrollView, with only its opacity/text driven by `index` state after a
// swipe settled. That's why dragging only moved the *text* - the "card"
// behind it was a fixed backdrop, never part of the paged content at all.
// Each page now renders its own full ArticleCard (image, fade, pill,
// counter) *inside* the ScrollView, so the whole card genuinely pans with
// the gesture and the next page's card is visible mid-drag, the same way
// native paging always behaves for content that's actually inside it - not
// a new effect bolted on, just no longer faking it from outside.
export function ArticleWaterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // Real-time scroll position on the UI thread, feeding each page's own
  // depth transform (DepthPage above) every frame of the gesture.
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  // Her literal spec, 2026-10-07: nav row 40px from the top, the card 16px
  // below *that* row (not below the status bar), 16px margins on both
  // sides instead of edge-to-edge.
  const navTop = insets.top + 40;
  const cardTop = navTop + NAV_ROW_HEIGHT + 16;
  // Literal 16px from the true bottom edge of the *physical display*, not
  // `useWindowDimensions()`'s own `height` - her side-by-side screenshots,
  // 2026-10-07, showed a visibly bigger gap on Android than iOS despite
  // identical code, the same root cause already chased down for BottomBar:
  // RN's "window" dimensions (what useWindowDimensions reports) can be
  // smaller than the real display on Android when system bars reserve
  // space, while iOS's "window" and "screen" sizes are always identical.
  // `Dimensions.get('screen')` reports the true physical display height on
  // both platforms, so the card's own math uses that instead.
  const screenPhysicalHeight = Dimensions.get('screen').height;
  const cardBottom = screenPhysicalHeight - 16;
  const cardHeight = cardBottom - cardTop;

  return (
    <View style={styles.container}>
      <View style={[styles.topRow, { top: navTop }]} pointerEvents="box-none">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
          <ChevronIcon direction="left" size={14} color={colors.textPrimary} />
          <Text style={styles.topLabel}>Все статьи</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.topLabel}>Закрыть</Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={[styles.scroll, { top: cardTop - CARD_GLOW_PAD, height: cardHeight + CARD_GLOW_PAD * 2 }]}
      >
        <DepthPage
          pageIndex={0}
          scrollX={scrollX}
          width={screenWidth}
          style={{
            width: screenWidth,
            height: cardHeight + CARD_GLOW_PAD * 2,
            paddingHorizontal: SIDE_MARGIN,
            paddingVertical: CARD_GLOW_PAD,
          }}
        >
          <ArticleCard pageIndex={0}>
            <View style={styles.contentSpacerTop} />
            <View style={styles.coverContent}>
              <CoverTitle text={ARTICLE_WATER_TITLE} />
              <Text style={styles.coverSubtitle}>{ARTICLE_WATER_SUBTITLE}</Text>
              <View style={styles.readTimeRow}>
                {/* size=8 (was 7) - readTime went 14->16px right after the
                    original consult, scaled to keep the same ~77%
                    cap-height ratio (ui-designer, 2026-10-07): ~12.3px tall
                    next to 16px text. */}
                <HourglassIcon size={8} />
                <Text style={styles.readTime}>{ARTICLE_WATER_READ_TIME}</Text>
              </View>
            </View>
            <View style={styles.contentSpacerBottom} />
            {/* Attached to the cover's own card now (was a separate
                screen-level overlay, positioned off `cardBottom`) - her ask,
                2026-10-09: it should move/scale/fade *with* the card during
                the swipe, not float independently over it. Only ever
                rendered here, on the cover - no `index` check needed, this
                JSX simply doesn't exist on the other pages. */}
            <View style={styles.swipeHint} pointerEvents="none">
              <SwipeHandIcon size={28} />
              <Text style={styles.swipeHintText}>Свайпни влево</Text>
            </View>
          </ArticleCard>
        </DepthPage>

        {ARTICLE_WATER_PAGES.map((page, i) => (
          <DepthPage
            key={i}
            pageIndex={i + 1}
            scrollX={scrollX}
            width={screenWidth}
            style={{
              width: screenWidth,
              height: cardHeight + CARD_GLOW_PAD * 2,
              paddingHorizontal: SIDE_MARGIN,
              paddingVertical: CARD_GLOW_PAD,
            }}
          >
            <ArticleCard pageIndex={i + 1}>
              <View style={styles.contentSpacerTop} />
              <View style={styles.pageContent}>
                {page.blocks.map((block, bi) => (
                  <ArticleBlockView key={bi} block={block} onLinkPress={() => navigation.goBack()} />
                ))}
              </View>
              <View style={styles.contentSpacerBottom} />
            </ArticleCard>
          </DepthPage>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

// One page's full card - photo, bottom-fade, tag pill (cover only) + page
// counter, and whatever content the caller passes as children. `pageIndex`
// alone determines the photo's opacity and the counter's number, both
// computed directly from it rather than from the screen's `index` state -
// that's what lets this card live *inside* the paged ScrollView and still
// show the right fade/number for whichever page it is, mid-drag, before any
// scroll-settle state update ever fires.
function ArticleCard({ pageIndex, children }: { pageIndex: number; children: React.ReactNode }) {
  // Flat, not a progressive fade to nothing - her ask, 2026-10-07: every
  // content page should carry the same slightly-darkened photo page 2 had
  // (0.55), not fade further page over page until there's no image left by
  // page 4 (the old `1 - pageIndex*0.45` formula hit 0 there) - page 3 in
  // particular read as "сильно затемнено" at the old formula's 0.1.
  const imageOpacity = pageIndex === 0 ? 1 : 0.55;

  return (
    // Outer wrap carries the glow (needs no overflow clipping, same split
    // QuoteCard already uses for its own outward glow) - `card` itself
    // keeps `overflow: 'hidden'` to clip the photo to the rounded corners,
    // and a boxShadow on that same element would get clipped by its own
    // overflow instead of bleeding outward.
    <View style={[styles.cardGlowWrap, pageIndex > 0 && styles.cardGlowActive]}>
      <View style={styles.card}>
        {/* expo-image, not core RN Image (her 2026-10-07 catch, "до этого
            картинка нормальная была") - today's rewrite moved the photo from
            one shared Image to 9 (one per page, all mounted at once since
            ScrollView doesn't virtualize), and RN's own Image decodes its
            source fresh per instance - 9 simultaneous full decodes of the
            same photo is real memory pressure, and the OS answering with a
            visibly lower-quality decode to cope is a known failure mode, not
            a cache/asset issue (confirmed: the file itself and the bundled
            copy are both sharp). expo-image caches the *decoded* bitmap by
            source, so all 9 instances share one real decode instead of each
            paying for their own. */}
        <Image
          source={WATER_IMAGE}
          style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        {/* locations pushed later (was 0.32/0.82) - that fade was tuned for
            the old full-screen-height image; applied to this card's now much
            shorter height, the same *fractions* darkened the photo far
            sooner, both proportionally and in absolute px, reading as a
            washed-out haze instead of the crisp photo in her reference
            (2026-10-07: "куда ты дел нормальную картинку воды?"). Starting
            the fade later keeps the photo clear through the pill/counter
            zone and only darkens toward where the text actually sits now
            that content isn't bottom-anchored any more. */}
        <LinearGradient
          colors={['transparent', colors.bg0]}
          locations={[0.5, 0.92]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.cardMeta} pointerEvents="none">
          {pageIndex === 0 ? (
            <View style={styles.tagPill}>
              <View style={styles.tagDot} />
              <Text style={styles.tagText}>{ARTICLE_WATER_SERIES.toUpperCase()}</Text>
              <View style={styles.tagDot} />
            </View>
          ) : (
            <View />
          )}
          <View style={styles.counter}>
            <Text style={styles.counterNum}>{String(pageIndex + 1).padStart(2, '0')}</Text>
            <View style={styles.counterLine} />
            <Text style={styles.counterNum}>{String(TOTAL_PAGES).padStart(2, '0')}</Text>
          </View>
        </View>

        {children}
      </View>
    </View>
  );
}

// Plain white Text, not the gradient SVG this used before - her reference
// screenshots (2026-10-07, "вот прям точно так же"): the cover title reads
// as plain white and notably lighter than a bold/extraBold weight, not the
// pink-violet gradient treatment this had. Dropped the gradient outright
// rather than keeping it alongside a lighter weight - the reference has no
// visible color shift across the title at all.
function CoverTitle({ text }: { text: string }) {
  return <Text style={styles.coverTitle}>{text}</Text>;
}

function ArticleBlockView({ block, onLinkPress }: { block: ArticleBlock; onLinkPress: () => void }) {
  switch (block.type) {
    case 'heading':
      return <Text style={styles.heading}>{block.text}</Text>;
    case 'subheading':
      return <Text style={styles.subheading}>{block.text}</Text>;
    case 'paragraph':
      return <Text style={styles.paragraph}>{block.text}</Text>;
    case 'bullets':
      return (
        <View style={styles.bulletList}>
          {block.items.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'link':
      return (
        <Pressable onPress={onLinkPress} style={styles.linkWrap} hitSlop={8}>
          <Text style={styles.linkText}>{block.text}</Text>
        </Pressable>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  topRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  scroll: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  // Rounded on all four corners now the card has a real 16px gap on every
  // side (was top-only, flush to the bottom edge - her 2026-10-07 catch:
  // "у карточки внизу не видно краев").
  card: {
    flex: 1,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  // Carries the glow (see cardGlowActive) - needs its own `flex: 1` always
  // (the cover has no glow, so its style array drops the second entry, but
  // this one must stay so `card`'s own `flex: 1` below still has something
  // to fill) and the same borderRadius as `card` so a boxShadow follows the
  // rounded shape instead of the wrapper's own rectangular bounds.
  cardGlowWrap: {
    flex: 1,
    borderRadius: radius.card,
  },
  // Soft violet glow, not a flat border - ui-designer consult, 2026-10-07:
  // on page 2+ the photo fades to `colors.bg0` at its own bottom edge, so a
  // hairline border was the only thing keeping the card's edge from
  // visually dissolving into the screen background - needed, but a plain
  // white 1px line reads as a generic "card in a list" pattern, not this
  // app's own "glowing object in the dark" language (every other
  // card-like surface in Soma signals "distinct object" with glow, not a
  // stroke). Cover (page 1) still gets neither - its own photo is bright
  // enough to read as a separate object without help.
  // Thinner, more concentrated, white instead of violet - her catch,
  // 2026-10-07: the wider 28px violet blur also only had horizontal room to
  // bleed into (the page's own 16px side padding), not vertical (the card's
  // height fills its parent exactly), so it only read on the left/right
  // edges. A smaller blur needs less room to begin with, on every side.
  cardGlowActive: {
    boxShadow: `0px 0px 10px 1px rgba(255,255,255,0.4)`,
  },
  cardMeta: {
    position: 'absolute',
    top: 32,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  // Real dot Views either side of the label, not inline "•" glyphs - more
  // reliably centered/sized across fonts than relying on a bullet
  // character's own glyph metrics. Border violet (was a white-ish
  // rgba(255,255,255,0.4)) and text/dots white (was textSecondary gray) -
  // her close-up reference (2026-10-07) shows a lavender border and plain
  // white label, not a gray/white-bordered pill - color was the actual
  // remaining mismatch after the dot fix.
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.violet300,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  tagDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textPrimary,
  },
  tagText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.textPrimary,
  },
  counter: {
    alignItems: 'center',
  },
  counterNum: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  counterLine: {
    width: 16,
    height: 1.5,
    backgroundColor: colors.violet400,
    marginVertical: 3,
  },
  // Content no longer bottom-anchored (was `flex:1, justifyContent:
  // 'flex-end'`) - her reference has it sitting a bit above the card's own
  // middle, on both the cover and the content pages (page 2's screenshot
  // shows the same thing, even though she only wrote this up for the
  // cover). contentSpacerTop/Bottom below do the positioning; these two
  // just hold the content's own internal layout.
  contentSpacerTop: {
    flex: 0.85,
  },
  contentSpacerBottom: {
    flex: 1.3,
  },
  coverContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // 34 -> 40 - her ask, 2026-10-07: "заголовок можно крупнее".
  // lineHeight ratio 1.15 -> 1.05 (46px -> 42px at this fontSize) - her
  // catch, 2026-10-07: the gap between lines read as too loose for a 3-line
  // display headline at this size.
  coverTitle: {
    marginBottom: 4,
    fontFamily: fontFamily.regular,
    fontSize: 40,
    lineHeight: 40 * 1.05,
    color: colors.textPrimary,
  },
  // 16 -> 18 - her ask, 2026-10-07 ("не сильно ли маленького шрифта
  // текст?").
  coverSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: colors.textPrimary,
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // 14 -> 16 - her ask, 2026-10-07: "сколько она пикселей? нельзя так мало
  // делать?".
  readTime: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.violet300,
  },
  pageContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // 24 -> 28 - her reference screenshot's big statement heading ("Мы часто
  // ищем сложные решения...") reads noticeably larger than this was,
  // closer to the cover title's own size than to a section sub-header.
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 28 * 1.3,
    color: colors.textPrimary,
  },
  subheading: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 18 * 1.3,
    color: colors.textPrimary,
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
  },
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bulletDot: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.violet300,
  },
  bulletText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
  },
  linkWrap: {
    marginTop: 8,
    alignSelf: 'center',
  },
  linkText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.violet300,
    textDecorationLine: 'underline',
  },
  // Column now (icon above label), not a row - her reference, 2026-10-07.
  // Positioned relative to the cover card itself now (was a screen-level
  // overlay with its own computed `top`) - 32px up from the card's own
  // bottom edge, her original spec, now trivial since it's a normal
  // absolutely-positioned child of the card instead of a sibling needing
  // its own coordinate math.
  swipeHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: 'center',
    gap: 6,
  },
  swipeHintText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.violet300,
  },
});
