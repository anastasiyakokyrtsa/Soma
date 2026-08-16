import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow, fontFamily, spacing } from '../../theme';
import { InfoIcon } from '../../components/icons/InfoIcon';

// WF16 "Profile - Start" — the intro screen between Personalization and the
// 4-step profile-data mini-flow (WF17-20). No finished Figma frame (built
// from the wireframe + kit vocabulary, see ProfileStepLayout.tsx's note).
//
// Illustration: a real AI-generated image (glowing violet astrolabe
// dissolving into stardust), not code-drawn — she supplied the final file
// herself after several generation rounds (`Claude AI/v2/Для создания ui
// kit/Элементы и экраны/Astrolabe.png`). Real alpha extracted from its own
// near-black background (alpha = pixel brightness, floor/ceiling + gamma
// tuned so the background grain zeroes out but faint structure lines stay
// visible; RGB left untouched, NOT the moon/sun cutouts' "un-premultiply"
// recipe — that would blow the soft gradient glow out to flat brightness
// and kill the hazy look) — a flat color-match wasn't enough on-device, the
// image's own grain/vignette texture still read as a square against the
// screen's flat bg0 (2026-08-16 review).
const ASTROLABE = require('../../assets/onboarding/astrolabe.png');
export function ProfileStartScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  // Bled past the standard text margin on purpose (2026-08-16: "еще
  // больше") - it's art, not text needing a readable column, and the image
  // already has its own internal breathing room (the disc doesn't touch its
  // own canvas edge), so a tight 12px margin reads as full-bleed without
  // actually clipping anything. Height cap is a safety ceiling so the
  // square never crowds the title/button on short screens, not a visual choice.
  const illustrationWidth = Math.min(width - spacing.sp3 * 2, height * 0.58);

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}
    >
      <View style={[styles.top, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.title}>Еще немного твоих данных</Text>
        <Text style={styles.description}>
          Пара ответов и ты уже увидишь первую аналитику. Ты можешь продолжить сейчас или вернуться к
          заполнению профиля позже
        </Text>

        <View style={styles.illustrationWrap}>
          <Image
            source={ASTROLABE}
            style={{ width: illustrationWidth, height: illustrationWidth }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('ProfileDateOfBirth')}
        >
          <Text style={styles.buttonLabel}>Поехали</Text>
        </Pressable>

        <View style={styles.skipRow}>
          <Pressable style={styles.skipTap} onPress={() => navigation.replace('Main')} hitSlop={6}>
            <Text style={styles.skipText}>Заполнить позже</Text>
          </Pressable>
          <InfoIcon size={18} color={colors.violet300} />
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
  top: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: 26,
    lineHeight: 26,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: colors.textPrimary,
    marginTop: 8,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    paddingHorizontal: spacing.screenPadding,
  },
  button: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}`,
  },
  buttonPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  buttonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.1,
    color: colors.bg0,
  },
  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  skipTap: {},
  skipText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.violet300,
  },
});
