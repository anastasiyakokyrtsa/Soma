import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow, fontFamily, spacing } from '../../theme';
import { BackIcon } from '../../components/icons/BackIcon';
import { InfoIcon } from '../../components/icons/InfoIcon';
import type { ReactNode } from 'react';

// Shared layout for the post-Personalization profile-data mini-flow (WF
// 17-20: Date of birth / Sleep schedule / Menstrual cycle / Mood — a
// distinct 4-step flow with its own header style, not a continuation of
// OnboardingStepLayout's Name/Email/Gender/Support flow). No finished Figma
// frame exists for these (screen-source reality, see
// memory/project_app_development.md) — built from the wireframes
// (`Вайрфреймы/17-20 WF Profile - *.png`) plus the kit's existing
// vocabulary, not transcribed from an exact spec.
//
// The one real visual difference from OnboardingStepLayout: the wireframe
// header is a literal centered "Шаг X/4" text counter, not the dot/segment
// StepProgressBar used by the earlier Name/Email/Gender/Support flow -
// respected as a real distinction, not force-fit onto the existing bar.
export function ProfileStepLayout({
  step,
  totalSteps = 4,
  title,
  description,
  children,
  buttonLabel = 'Продолжить',
  buttonDisabled = false,
  onPressNext,
  onPressBack,
  onPressSkip,
}: {
  step: number;
  totalSteps?: number;
  title: string;
  description?: string;
  children: ReactNode;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  onPressNext: () => void;
  onPressBack: () => void;
  onPressSkip: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}
    >
      <View style={[styles.top, { paddingTop: insets.top + 40 }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onPressBack} hitSlop={8}>
            <BackIcon />
          </Pressable>
          <Text style={styles.stepCounter}>
            Шаг {step}/{totalSteps}
          </Text>
          {/* Invisible spacer, same footprint as the back button, so the
              counter text is truly centered on the row instead of centered
              between the back button and the screen's right edge. */}
          <View style={styles.backButton} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        <View style={styles.content}>{children}</View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && !buttonDisabled && styles.buttonPressed, buttonDisabled && styles.buttonDisabled]}
          disabled={buttonDisabled}
          onPress={onPressNext}
        >
          <Text style={[styles.buttonLabel, buttonDisabled && styles.buttonLabelDisabled]}>{buttonLabel}</Text>
        </Pressable>

        <View style={styles.skipRow}>
          <Pressable style={styles.skipTap} onPress={onPressSkip} hitSlop={6}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  stepCounter: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  // 20px, matching the arrow-row -> title gap in OnboardingStepLayout.tsx
  // (SupportScreen etc.) — same header shape, same spacing.
  textBlock: {
    gap: 8,
    marginTop: 20,
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
  },
  // 16px, matching OnboardingStepLayout.tsx's header->content gap (already
  // tuned down from 24 there for the same "too tall" reason).
  content: {
    flex: 1,
    marginTop: 16,
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
  buttonDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    boxShadow: 'none',
  },
  buttonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.1,
    color: colors.bg0,
  },
  buttonLabelDisabled: {
    color: colors.textDisabled,
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
