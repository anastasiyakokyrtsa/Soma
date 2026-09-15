import { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily, gradients } from '../theme';
import { ChevronIcon } from '../components/icons/ChevronIcon';
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
export function ArticleWaterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    if (i !== index) setIndex(i);
  };

  // The water photo is vivid on the cover, then fades out over the next
  // couple of pages and stays fully dark for the rest - matches her own
  // reference screens (page 3 already mostly black) and resolves
  // ui-designer's readability concern (a busy photo behind 1500 words)
  // without dropping the image outright, which she wanted to keep.
  const imageOpacity = Math.max(0, 1 - index * 0.45);

  return (
    <View style={styles.container}>
      <Image
        source={WATER_IMAGE}
        style={[styles.bgImage, { width: screenWidth, height: screenHeight, opacity: imageOpacity }]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', colors.bg0]}
        locations={[0.32, 0.82]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={[styles.topRow, { paddingTop: insets.top + 16 }]} pointerEvents="box-none">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
          <ChevronIcon direction="left" size={14} color={colors.textPrimary} />
          <Text style={styles.topLabel}>Все статьи</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.topLabel}>Закрыть</Text>
        </Pressable>
      </View>

      <View style={[styles.metaRow, { top: insets.top + 68 }]} pointerEvents="none">
        {index === 0 ? (
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>• {ARTICLE_WATER_SERIES.toUpperCase()} •</Text>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.counter}>
          <Text style={styles.counterNum}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={styles.counterLine} />
          <Text style={styles.counterNum}>{String(TOTAL_PAGES).padStart(2, '0')}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={32}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={{ width: screenWidth, height: screenHeight }}>
          <View style={[styles.coverContent, { paddingBottom: insets.bottom + 96 }]}>
            <CoverTitle text={ARTICLE_WATER_TITLE} />
            <Text style={styles.coverSubtitle}>{ARTICLE_WATER_SUBTITLE}</Text>
            <Text style={styles.readTime}>⏳  {ARTICLE_WATER_READ_TIME}</Text>
          </View>
        </View>

        {ARTICLE_WATER_PAGES.map((page, i) => (
          <View key={i} style={{ width: screenWidth, height: screenHeight }}>
            <View style={[styles.pageContent, { paddingBottom: insets.bottom + 96 }]}>
              {page.blocks.map((block, bi) => (
                <ArticleBlockView key={bi} block={block} onLinkPress={() => navigation.goBack()} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {index < TOTAL_PAGES - 1 ? (
        <View style={[styles.swipeHint, { bottom: insets.bottom + 32 }]} pointerEvents="none">
          <ChevronIcon direction="left" size={14} color={colors.violet300} />
          <Text style={styles.swipeHintText}>Свайпни влево</Text>
        </View>
      ) : null}
    </View>
  );
}

// Gradient title reserved for this one "screen identity" moment (the
// cover), same reasoning ui-designer gave for why in-page section
// headings stay plain white - matches how HomeScreen's own greeting is
// the one gradient heading on that screen, not every heading on it.
function CoverTitle({ text }: { text: string }) {
  const lines = text.split('\n');
  const lineHeight = 40;
  return (
    <Svg width="100%" height={lineHeight * lines.length + 8} style={styles.coverTitleSvg}>
      <Defs>
        <SvgLinearGradient id="articleTitleGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
          <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
          <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
        </SvgLinearGradient>
      </Defs>
      {lines.map((line, i) => (
        <SvgText key={i} x={0} y={lineHeight * (i + 1) - 8} fontSize={34} fontFamily={fontFamily.extraBold} fill="url(#articleTitleGrad)">
          {line}
        </SvgText>
      ))}
    </Svg>
  );
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
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
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
  metaRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  tagPill: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tagText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.textSecondary,
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
  coverContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    gap: 16,
  },
  coverTitleSvg: {
    marginBottom: 4,
  },
  coverSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.textPrimary,
  },
  readTime: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.violet300,
  },
  pageContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    gap: 16,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 24 * 1.3,
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
  swipeHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  swipeHintText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.violet300,
  },
});
