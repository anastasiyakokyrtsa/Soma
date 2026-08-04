import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow, type, fontFamily, spacing, radius } from '../../theme';
import { StepProgressBar } from '../../components/StepProgressBar';
import { BackIcon } from '../../components/icons/BackIcon';
import { InfoIcon } from '../../components/icons/InfoIcon';
import type { ReactNode } from 'react';

// Shared layout for the profile-setup steps that follow "About app" (WF 6-9:
// Name / Email / Gender / "How to support" — see wireframes folder). Unlike
// OnboardingSlide (the value-prop story slides, chrome-free above the dots),
// these are form-style steps: a step-progress bar, a real back button, a
// question headline, then form content, then a CTA that gates on validity.
// No finished Figma frame exists for this flow (see the "screen-source
// reality" note in memory/project_app_development.md), so layout/tokens are
// assembled from the existing UI Kit vocabulary (field-input, select-chip,
// btn-primary) rather than transcribed from an exact spec.
export function OnboardingStepLayout({
  activeStep,
  totalSteps = 6,
  title,
  description,
  children,
  buttonLabel = 'Продолжить',
  buttonDisabled = false,
  onPressNext,
  onPressBack,
  onPressSkip,
}: {
  activeStep: number;
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
        <StepProgressBar total={totalSteps} activeStep={activeStep} />

        <Pressable style={styles.backButton} onPress={onPressBack} hitSlop={8}>
          <BackIcon />
        </Pressable>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 60 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && !buttonDisabled && styles.buttonPressed,
            buttonDisabled && styles.buttonDisabled,
          ]}
          disabled={buttonDisabled}
          onPress={onPressNext}
        >
          <Text style={[styles.buttonLabel, buttonDisabled && styles.buttonLabelDisabled]}>
            {buttonLabel}
          </Text>
        </Pressable>

        <View style={styles.skipRow}>
          <Pressable style={styles.skipTap} onPress={onPressSkip} hitSlop={6}>
            <Text style={styles.skipText}>Пропустить онбординг</Text>
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
    paddingHorizontal: spacing.screenPadding,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: -12,
  },
  textBlock: {
    gap: 8,
    marginTop: 20,
  },
  title: {
    fontFamily: type.h2.fontFamily,
    fontSize: type.h2.fontSize,
    lineHeight: type.h2.fontSize * 1.0,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: type.bodyL.fontFamily,
    fontSize: type.bodyL.fontSize,
    lineHeight: type.bodyL.fontSize * 1.1,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    marginTop: 24,
  },
  contentInner: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  bottom: {
    paddingHorizontal: spacing.screenPadding,
  },
  button: {
    height: 62,
    borderRadius: radius.md,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}`,
  },
  // Ports .btn-primary:active (style.css ~L307) — was missing entirely before,
  // so the button gave no tactile feedback on press.
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
    fontFamily: type.bodyM.fontFamily,
    fontSize: 14,
    color: colors.violet300,
  },
});
