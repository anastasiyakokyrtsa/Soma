import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily, radius, glow } from '../theme';
import { CloseIcon } from '../components/icons/CloseIcon';
import { GradientIcon } from '../components/icons/GradientIcon';
import { StarsBackground } from '../components/StarsBackground';
import { MEDITATIONS } from '../content/meditations';
import { useT } from '../i18n/useT';
import { useLanguage } from '../i18n/LanguageContext';

const CIRCLE_SIZE = 180;

// Info screen for one meditation - same role/shape as BreathingInfoScreen
// (title/duration/description/start button over a calm glowing circle),
// just with a static icon standing in for BreathingOrb's own at-rest
// preview (no equivalent "orb" object exists for meditation, and this
// practice has no running-state animation to preview ahead of starting).
export function MeditationInfoScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const t = useT();
  const { language } = useLanguage();
  const id = route?.params?.id;
  const meditation = MEDITATIONS.find((m) => m.id === id) ?? MEDITATIONS[0];

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.closeButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <CloseIcon />
      </Pressable>

      <View style={[styles.circleWrap, { marginTop: insets.top + 96 }]}>
        <View style={styles.circle}>
          <View style={styles.halo} />
          <GradientIcon name={meditation.icon} size={72} />
        </View>
      </View>
      <View style={{ flex: 1 }} />

      <View style={[styles.card, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>{meditation.title[language]}</Text>
        <Text style={styles.duration}>{meditation.duration[language]}</Text>
        <Text style={styles.description}>{meditation.description[language]}</Text>

        <View style={styles.whyBox}>
          <Text style={styles.whyLabel}>{t('practices.whyItHelpsLabel')}</Text>
          <Text style={styles.whyText}>{meditation.whyItHelps[language]}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => navigation.navigate('MeditationSession', { id: meditation.id })}
        >
          <Text style={styles.ctaLabel}>{t('practices.startButton')}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrap: {
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(139,124,246,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Same halo recipe as BreathingCompleteScreen/ResourceRing's own glow.
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    boxShadow:
      '0px 0px 40px 10px rgba(139,124,246,0.16), 0px 0px 70px 20px rgba(255,198,241,0.07), inset 0px 0px 48px 18px rgba(139,124,246,0.18), inset 0px 0px 26px 6px rgba(255,198,241,0.12)',
  },
  card: {
    backgroundColor: colors.cardFillFallback,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  duration: {
    marginTop: 8,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  description: {
    marginTop: 20,
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  whyBox: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  whyLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.violet300,
  },
  whyText: {
    marginTop: 6,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: colors.textSecondary,
  },
  cta: {
    marginTop: 24,
    width: '100%',
    height: 60,
    borderRadius: 16,
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
    fontSize: 18,
    color: colors.bg0,
  },
});
