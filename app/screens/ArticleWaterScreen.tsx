import { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
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
// Icon (28*28/36≈21.8) + 6px gap + one text line (~16px) - used only to
// position the swipe hint's `top` from the card's bottom edge, see below.
const SWIPE_HINT_HEIGHT = 44;

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
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    if (i !== index) setIndex(i);
  };

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

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={32}
        style={[styles.scroll, { top: cardTop, height: cardHeight }]}
      >
        <View style={{ width: screenWidth, height: cardHeight, paddingHorizontal: SIDE_MARGIN }}>
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
          </ArticleCard>
        </View>

        {ARTICLE_WATER_PAGES.map((page, i) => (
          <View key={i} style={{ width: screenWidth, height: cardHeight, paddingHorizontal: SIDE_MARGIN }}>
            <ArticleCard pageIndex={i + 1}>
              <View style={styles.contentSpacerTop} />
              <View style={styles.pageContent}>
                {page.blocks.map((block, bi) => (
                  <ArticleBlockView key={bi} block={block} onLinkPress={() => navigation.goBack()} />
                ))}
              </View>
              <View style={styles.contentSpacerBottom} />
            </ArticleCard>
          </View>
        ))}
      </ScrollView>

      {index < TOTAL_PAGES - 1 ? (
        // `top`, not `bottom` - `bottom` on an absolutely positioned child
        // measures from its container's own layout box, which RN sizes
        // using `window` dimensions, not the `screen` dimensions `cardBottom`
        // is now computed from above; mixing the two would reintroduce the
        // exact Android/iOS mismatch this is fixing. Computing an explicit
        // `top` from `cardBottom` keeps both the card and this hint on the
        // same coordinate basis. SWIPE_HINT_HEIGHT is an estimate (icon +
        // gap + one text line), not measured.
        <View style={[styles.swipeHint, { top: cardBottom - 32 - SWIPE_HINT_HEIGHT }]} pointerEvents="none">
          <SwipeHandIcon size={28} />
          <Text style={styles.swipeHintText}>Свайпни влево</Text>
        </View>
      ) : null}
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
    <View style={[styles.card, pageIndex > 0 && styles.cardBordered]}>
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
  // Border only on page 2+ (her explicit call, 2026-10-07: "на первой
  // странице обводить карточку не надо") - the cover's own photo is bright
  // enough to read as a distinct card against the screen background on its
  // own; only the darker pages need the edge drawn in.
  cardBordered: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
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
  swipeHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 6,
  },
  swipeHintText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.violet300,
  },
});
