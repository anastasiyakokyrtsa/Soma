import { View, Text, Image, Pressable, StyleSheet, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow, type, fontFamily, spacing } from '../../theme';
import { ProgressDots } from '../../components/ProgressDots';

// Shared layout for the "About app" onboarding slides (Figma: About app / About
// app 2 / About app 3) — same structure, varying only image/copy/button label.
// Positions are ported as responsive flex, not fixed pixels off the 412x917
// reference frame: dots pinned near the top (safe-area + 40, matching the
// reference's 92px - 52px status bar), art fills the middle, text+CTA block is
// bottom-anchored — this adapts across real device heights instead of one frame.
//
// Tap-to-navigate: the whole area above the text block (dots + art) is split
// into left/right halves — tap right = next (same as the button), tap left =
// back, when a back target is given. Story-style navigation, chosen over a
// back arrow so the screen stays free of chrome beyond the dots (see
// memory/project_app_development.md for the reasoning).
//
// Screen-transition smoothness: native-stack's per-screen `animationDuration`
// is iOS-only (Android always uses its own default fade timing/curve, which
// read as too abrupt) — so the actual "smooth fade" is this component's own
// entering animation instead, identical on both platforms.
export function OnboardingSlide({
  image,
  title,
  description,
  buttonLabel,
  activeIndex,
  totalDots = 3,
  onPressNext,
  onPressBack,
  onPressLogin,
}: {
  image: ImageSourcePropType;
  title: string;
  description: string;
  buttonLabel: string;
  activeIndex: number;
  totalDots?: number;
  onPressNext: () => void;
  onPressBack?: () => void;
  onPressLogin: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}
    >
      <View style={[styles.dotsRow, { paddingTop: insets.top + 40 }]}>
        <ProgressDots count={totalDots} activeIndex={activeIndex} />
      </View>

      <View style={styles.imageZone}>
        <Image source={image} style={styles.image} resizeMode="cover" />

        <View style={styles.tapZones} pointerEvents="box-none">
          <Pressable
            style={styles.tapZoneLeft}
            disabled={!onPressBack}
            onPress={onPressBack}
          />
          <Pressable style={styles.tapZoneRight} onPress={onPressNext} />
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 60 }]}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onPressNext}
        >
          <Text style={styles.buttonLabel}>{buttonLabel}</Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>У меня уже есть аккаунт </Text>
          <Pressable onPress={onPressLogin}>
            <Text style={styles.loginLink}>Войти</Text>
          </Pressable>
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
  dotsRow: {
    alignItems: 'center',
  },
  imageZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tapZoneLeft: {
    flex: 2,
  },
  tapZoneRight: {
    flex: 3,
  },
  bottom: {
    paddingHorizontal: spacing.screenPadding,
  },
  textBlock: {
    gap: 4,
    marginBottom: 40,
  },
  title: {
    fontFamily: type.h3.fontFamily,
    fontSize: type.h3.fontSize,
    lineHeight: type.h3.fontSize * 1.0,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: fontFamily.regular, // Nunito Sans Regular, per Figma spec (not bodyL/medium)
    fontSize: 20,
    lineHeight: 20 * 1.1,
    color: colors.textPrimary,
  },
  button: {
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    // supported cross-platform (iOS + Android) by RN's Fabric renderer
    boxShadow: `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}`,
  },
  // Ports .btn-primary:active (style.css ~L307) — was missing here too (same
  // gap as OnboardingStepLayout's button, fixed 2026-08-04).
  buttonPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  buttonLabel: {
    fontFamily: fontFamily.semiBold, // Nunito Sans SemiBold, per Figma spec
    fontSize: 20,
    lineHeight: 20 * 1.1,
    color: colors.bg0,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontFamily: type.bodyM.fontFamily,
    fontSize: 16,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  loginLink: {
    fontFamily: type.h3.fontFamily, // Bold
    fontSize: 16,
    lineHeight: 32,
    color: colors.violet300,
    textDecorationLine: 'underline',
  },
});
