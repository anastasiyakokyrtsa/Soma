import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily, radius, glow } from '../theme';
import { BackIcon } from '../components/icons/BackIcon';
import { CheckmarkIcon } from '../components/icons/CheckmarkIcon';
import { StarsBackground } from '../components/StarsBackground';
import { useT } from '../i18n/useT';

// Completion screen for a meditation session - same shape as
// BreathingCompleteScreen (her own recipe for "a practice just ended"),
// not a shared component: this one's whole body is ~15 lines different
// (own copy, own CTA destination) and BreathingCompleteScreen is owned by
// an unrelated flow that shouldn't need to change if this one does later.
export function MeditationCompleteScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const t = useT();

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={styles.center}>
        <View style={styles.circle}>
          <View style={styles.halo} />
          <CheckmarkIcon size={64} color={colors.violet400} glow />
        </View>
        <Text style={styles.title}>{t('practices.meditationCompleteTitle')}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, { marginBottom: insets.bottom + 40 }, pressed && styles.ctaPressed]}
        onPress={() => navigation.navigate('MeditationList')}
      >
        <Text style={styles.ctaLabel}>{t('practices.meditationCompleteButton')}</Text>
      </Pressable>
    </Animated.View>
  );
}

const CIRCLE_SIZE = 220;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(139,124,246,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    boxShadow:
      '0px 0px 50px 12px rgba(139,124,246,0.16), 0px 0px 90px 26px rgba(255,198,241,0.07), inset 0px 0px 60px 22px rgba(139,124,246,0.18), inset 0px 0px 32px 8px rgba(255,198,241,0.12)',
  },
  title: {
    marginTop: 32,
    fontFamily: fontFamily.semiBold,
    fontSize: 22,
    lineHeight: 22 * 1.3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cta: {
    marginHorizontal: 16,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  ctaPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  ctaLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.bg0,
  },
});
