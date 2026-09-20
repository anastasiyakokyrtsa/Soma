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
  const { width } = useWindowDimensions();
  // 16px is the target distance from screen edge to the *visible* drawing,
  // not to the (transparent, invisible) square canvas edge (her 2026-09-20
  // clarification - "пускай края картинки выходят, частицы всё равно в
  // рамках"). The drawing itself sits inside a real empty margin baked into
  // the source file, bigger than it first looked on-screen - min(width-8,
  // height*ratio) and later a real-onLayout-height version both landed
  // short of what she wanted ("ты её меньше сделал"), because both were
  // still capping the CANVAS at roughly screen width. To get the *drawing*
  // near the edge, the canvas has to genuinely overflow past the screen -
  // deliberate, not a bug, per her explicit go-ahead. +64 is a first real
  // attempt at that overflow amount, not a measured value (screenshots
  // compress/resize, so exact px math off one isn't reliable) - check on
  // device and say if it needs to go further.
  const illustrationWidth = width + 64;

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
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.violet300,
  },
});
