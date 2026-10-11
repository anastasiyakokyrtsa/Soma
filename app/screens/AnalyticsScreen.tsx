import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, gradients, radius } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { GradientIcon, type GradientIconName } from '../components/icons/GradientIcon';
import { BAR_VIEWBOX_W, BAR_VIEWBOX_H } from '../components/BottomBar';

type Stat = {
  title: string;
  value: string;
  icon: GradientIconName;
  available: boolean;
};

// Her own drawn "Analytics screen.png" - 2x3 grid of stat cards. Only
// "Биоритмы" has a real detail screen behind it (BiorhythmsScreen.tsx, from
// WF38) - the other 5 are shown (matching her mockup) but marked "Скоро" and
// not tappable, same treatment as TeaCategoriesScreen's own 4 unbuilt
// categories, per the scenario audit's standing rule on visible-vs-silent
// dead taps (docs/state/findings.md #1).
const STATS: Stat[] = [
  { title: 'Биоритмы', value: '68% сегодня', icon: 'pulse', available: true },
  { title: 'Сон', value: '7ч 32 м', icon: 'sleep', available: false },
  { title: 'Состояния', value: 'Ровный фон', icon: 'battery', available: false },
  { title: 'Луна', value: 'Убывающая', icon: 'moonSymbol', available: false },
  { title: 'Солнце', value: 'Низкая активность', icon: 'sun', available: false },
  { title: 'Паттерны', value: '2 совпадения', icon: 'network', available: false },
];

export function AnalyticsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const cardWidth = (screenWidth - 20 * 2 - 16) / 2;
  // Icon/text/gap sizes below (iconRing 70, its own 20/24 gaps, titles 20px,
  // value 16px) are her literal spec from a 184px reference card (2026-10-01)
  // - but the card itself is screen-width-derived, not a fixed 184, and on
  // most real phones that comes out smaller (168-187px range). Kept as
  // literal numbers, the content didn't shrink with the card and started
  // overflowing it (her catch, 2026-10-09, against her own reference PNG) -
  // same class of bug as FocusCard/MoonSunCard/QuoteCard earlier in this
  // project, same fix: scale everything inside off the card's real size
  // relative to that 184px reference, same pattern those components use.
  const cardScale = cardWidth / 184;
  // Same fix as Home/Care (2026-10-01): a fixed, non-scrolling layout here
  // left whatever empty space the device's actual height happened to leave
  // below the grid, growing or shrinking with the screen instead of landing
  // at a consistent, intentional distance from the bar - wrapping in a
  // ScrollView with the same bar-height-aware bottom padding those two
  // screens use keeps that gap the same everywhere, this screen included.
  const bottomBarHeight = BAR_VIEWBOX_H * (Math.min(screenWidth, BAR_VIEWBOX_W) / BAR_VIEWBOX_W);
  const scrollBottomPadding = bottomBarHeight + insets.bottom + 60;

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingHorizontal: 20, paddingBottom: scrollBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <Svg width="100%" height={40}>
          <Defs>
            <SvgLinearGradient id="analyticsTitleGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
              <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
              <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
            </SvgLinearGradient>
          </Defs>
          <SvgText x="50%" y="32" fontSize={32} fontFamily={fontFamily.bold} textAnchor="middle" fill="url(#analyticsTitleGrad)">
            Аналитика
          </SvgText>
        </Svg>

        <View style={styles.grid}>
          {STATS.map((s) => (
            <Pressable
              key={s.title}
              disabled={!s.available}
              onPress={() => navigation.navigate('Biorhythms')}
              style={({ pressed }) => [
                styles.card,
                { width: cardWidth, height: cardWidth },
                !s.available && styles.cardUnavailable,
                // Same press feedback as Care's own vertical cards
                // (MiniRitualTile: violet border + slight scale-down), not
                // a background tint - her ask, 2026-10-09.
                s.available && pressed && styles.cardPressed,
              ]}
            >
              {/* Real --card-fill-sm port (same recipe MiniRitualTile/
                  MoonSunCard already use), not the flat cardFillSmFallback
                  color - her catch, 2026-10-09: "сделай карточку визуально
                  как в ките, а то сейчас она плоская". */}
              <Svg width={cardWidth} height={cardWidth} style={StyleSheet.absoluteFill}>
                <Defs>
                  <RadialGradient id={`analyticsFill-${s.title}`} cx="50%" cy="50%" r="70.7%">
                    <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
                    <Stop offset="0.212" stopColor="#000000" stopOpacity={0.1} />
                    <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
                  </RadialGradient>
                </Defs>
                <Rect x={0} y={0} width={cardWidth} height={cardWidth} fill={`url(#analyticsFill-${s.title})`} />
              </Svg>
              <View style={styles.whiteWash} pointerEvents="none" />

              {/* Icon pinned 24px from the card's top, text block pinned
                  24px from its bottom (her spec, 2026-10-09: "от иконки до
                  верха... и от текста до низа тоже 24") - `space-between`
                  across exactly these 2 groups (not 3 separate children)
                  keeps the icon-to-title (20px) and title-to-value (6px)
                  gaps fixed while only the slack between the two groups
                  flexes, instead of `space-between` spreading all 3 apart. */}
              <View style={[styles.cardInner, { paddingTop: 24 * cardScale, paddingBottom: 24 * cardScale }]}>
                <View
                  style={[
                    styles.iconRing,
                    { width: 70 * cardScale, height: 70 * cardScale, borderRadius: 35 * cardScale },
                  ]}
                >
                  <GradientIcon name={s.icon} size={32 * cardScale} />
                </View>
                <View style={styles.cardTextBlock}>
                  <Text style={[styles.cardTitle, { fontSize: 20 * cardScale }]}>{s.title}</Text>
                  <Text style={[styles.cardValue, { fontSize: 16 * cardScale, marginTop: 6 * cardScale }]}>{s.value}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  grid: {
    marginTop: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  // No backgroundColor/padding here any more - the real gradient fill
  // (Svg+whiteWash, see call site) are absolute-fill direct children that
  // need to span the card's *full* bounds uncropped by padding; the actual
  // content padding lives on `cardInner` below. `overflow: 'hidden'` clips
  // the gradient Svg's own sharp corners to the card's rounded ones.
  card: {
    borderRadius: radius.card,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // Same press idiom as Care's own vertical cards (MiniRitualTile) - her
  // ask, 2026-10-09: violet border + slight scale-down, not a white tint.
  cardPressed: {
    borderColor: colors.borderVioletFlat,
    transform: [{ scale: 0.98 }],
  },
  whiteWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  // Top-anchored icon / bottom-anchored text block, not centered - her
  // literal spec, 2026-10-01/10-09: "от круга до верха 24 пикселя... от
  // текста до низа тоже 24" (the 24s themselves are applied via
  // `cardScale` at the call site). `space-between` across exactly these 2
  // children keeps the 20px icon-to-title and 6px title-to-value gaps
  // fixed (both live on cardTextBlock/cardValue below) while only the
  // slack between the two groups flexes.
  cardInner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardUnavailable: {
    opacity: 0.55,
  },
  iconRing: {
    borderWidth: 1,
    borderColor: colors.violet300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextBlock: {
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cardValue: {
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
});
