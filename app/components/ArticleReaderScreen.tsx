import { View, Text, Pressable, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { Image, type ImageProps } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, radius } from '../theme';
import { ChevronIcon } from './icons/ChevronIcon';
import { HourglassIcon } from './icons/HourglassIcon';
import { SwipeHandIcon } from './icons/SwipeHandIcon';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';
import type { ArticleBlock, ArticlePage } from '../content/articleWater';
import { useT } from '../i18n/useT';

// Generic swipe-through article reader - extracted 2026-11-23 (brief 003)
// from what used to be ArticleWaterScreen.tsx's own body, verbatim in
// behavior, so "Свет и внутренние часы"/"Паузы и восстановление" (the two
// new articles this brief adds) don't need a second/third 500-line copy of
// this screen, per CLAUDE-team.md's "don't hardcode, don't duplicate"
// instinct applied to a whole screen rather than just a style value.
// ArticleWaterScreen.tsx itself is now a thin ~20-line wrapper over this
// component (see that file) - nothing about its own visual behavior changed
// in the extraction, only where the code lives.
//
// One real addition over the original Water-only version: `image` is now
// optional. Water has a real licensed/owned photo (water.jpg); Light and
// Pauses don't have a commissioned photo yet (she'll supply her own art
// later per decisions.md 2026-11-21/22 #6's "следующий цикл" split for tea
// visuals - same situation). Rather than fake a stock photo for a topic
// that doesn't have one, a missing `image` falls back to this app's own
// established "icon on a radial violet gradient" cover language (the same
// --card-fill recipe NavChip/AnalyticsScreen already use for icon-led
// surfaces), driven by `icon`.
export type ArticleReaderContent = {
  image?: ImageProps['source'];
  icon?: GradientIconName;
  series: string;
  title: string;
  subtitle: string;
  readTime: string;
  pages: ArticlePage[];
};

const SIDE_MARGIN = 16;
const NAV_ROW_HEIGHT = 24;
const CARD_GLOW_PAD = 16;
const DEPTH_MIN_SCALE = 0.75;
const DEPTH_MIN_ALPHA = 0.5;
const DEPTH_PULLBACK_RATIO = 0.06;

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
    const distance = Math.min(Math.abs(position), 1);
    const scale = interpolate(distance, [0, 1], [1, DEPTH_MIN_SCALE], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [0, 1], [1, DEPTH_MIN_ALPHA], Extrapolation.CLAMP);
    const translateX = interpolate(position, [-1, 0, 1], [width * DEPTH_PULLBACK_RATIO, 0, -width * DEPTH_PULLBACK_RATIO], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

export function ArticleReaderScreen({ navigation, content }: { navigation: any; content: ArticleReaderContent }) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const t = useT();
  const { image, icon, series, title, subtitle, readTime, pages } = content;
  const totalPages = 1 + pages.length;
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const navTop = insets.top + 40;
  const cardTop = navTop + NAV_ROW_HEIGHT + 16;
  const screenPhysicalHeight = Dimensions.get('screen').height;
  const cardBottom = screenPhysicalHeight - 16;
  const cardHeight = cardBottom - cardTop;

  return (
    <View style={styles.container}>
      <View style={[styles.topRow, { top: navTop }]} pointerEvents="box-none">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
          <ChevronIcon direction="left" size={14} color={colors.textPrimary} />
          <Text style={styles.topLabel}>{t('common.allArticles')}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.topLabel}>{t('common.close')}</Text>
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
          <ArticleCard pageIndex={0} totalPages={totalPages} image={image} icon={icon} series={series}>
            <View style={styles.contentSpacerTop} />
            <View style={styles.coverContent}>
              <CoverTitle text={title} />
              <Text style={styles.coverSubtitle}>{subtitle}</Text>
              <View style={styles.readTimeRow}>
                <HourglassIcon size={8} />
                <Text style={styles.readTime}>{readTime}</Text>
              </View>
            </View>
            <View style={styles.contentSpacerBottom} />
            <View style={styles.swipeHint} pointerEvents="none">
              <SwipeHandIcon size={28} />
              <Text style={styles.swipeHintText}>{t('common.swipeLeft')}</Text>
            </View>
          </ArticleCard>
        </DepthPage>

        {pages.map((page, i) => (
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
            <ArticleCard pageIndex={i + 1} totalPages={totalPages} image={image} icon={icon} series={series}>
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

function ArticleCard({
  pageIndex,
  totalPages,
  image,
  icon,
  series,
  children,
}: {
  pageIndex: number;
  totalPages: number;
  image?: ImageProps['source'];
  icon?: GradientIconName;
  series: string;
  children: React.ReactNode;
}) {
  const imageOpacity = pageIndex === 0 ? 1 : 0.55;

  return (
    <View style={[styles.cardGlowWrap, pageIndex > 0 && styles.cardGlowActive]}>
      <View style={styles.card}>
        {image ? (
          <Image
            source={image}
            style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          // No real photo for this topic yet (see this file's top comment) -
          // the app's own icon-on-radial-gradient card-fill language instead
          // of a fabricated stock photo. Same RadialGradient recipe as
          // NavChip/AnalyticsScreen (0.1 black near-edge -> violet300 0.2 at
          // the far corner), just applied full-bleed here.
          <View style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient id="articleFallbackFill" cx="50%" cy="50%" r="70.7%">
                  <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
                  <Stop offset="0.318" stopColor="#000000" stopOpacity={0.1} />
                  <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.35} />
                </RadialGradient>
              </Defs>
              <Rect x={0} y={0} width="100%" height="100%" fill="url(#articleFallbackFill)" />
            </Svg>
            {/* Cover only, not every content page - checked on-device
                proportions (2026-11-23): a sharp, centered glyph sitting
                right behind centered body text on every page fought with
                the text for attention in a way Water's own photo texture
                never did (a photo is a uniform backdrop; this icon is one
                discrete shape). Content pages keep just the gradient wash
                above, same role as Water's own darkened photo there -
                "this card belongs to this article", not a competing
                graphic. */}
            {icon && pageIndex === 0 ? (
              <View style={styles.fallbackIconWrap}>
                <GradientIcon name={icon} size={96} />
              </View>
            ) : null}
          </View>
        )}
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
              <Text style={styles.tagText}>{series.toUpperCase()}</Text>
              <View style={styles.tagDot} />
            </View>
          ) : (
            <View />
          )}
          <View style={styles.counter}>
            <Text style={styles.counterNum}>{String(pageIndex + 1).padStart(2, '0')}</Text>
            <View style={styles.counterLine} />
            <Text style={styles.counterNum}>{String(totalPages).padStart(2, '0')}</Text>
          </View>
        </View>

        {children}
      </View>
    </View>
  );
}

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
  card: {
    flex: 1,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  cardGlowWrap: {
    flex: 1,
    borderRadius: radius.card,
  },
  cardGlowActive: {
    boxShadow: `0px 0px 10px 1px rgba(255,255,255,0.4)`,
  },
  fallbackIconWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  coverTitle: {
    marginBottom: 4,
    fontFamily: fontFamily.regular,
    fontSize: 40,
    lineHeight: 40 * 1.05,
    color: colors.textPrimary,
  },
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
  readTime: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.violet300,
  },
  pageContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
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
