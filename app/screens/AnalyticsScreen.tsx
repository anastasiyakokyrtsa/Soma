import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily, gradients, radius } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { GradientIcon, type GradientIconName } from '../components/icons/GradientIcon';

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

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <View style={{ paddingTop: insets.top + 40, paddingHorizontal: 20 }}>
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
                { width: cardWidth },
                !s.available && styles.cardUnavailable,
                s.available && pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.iconRing}>
                <GradientIcon name={s.icon} size={32} />
              </View>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.cardValue}>{s.value}</Text>
            </Pressable>
          ))}
        </View>
      </View>
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
  card: {
    height: 184,
    borderRadius: radius.card,
    backgroundColor: colors.cardFillSmFallback,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardPressed: {
    backgroundColor: colors.cardFillFallback,
  },
  cardUnavailable: {
    opacity: 0.55,
  },
  iconRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.violet300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cardValue: {
    marginTop: 6,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
});
