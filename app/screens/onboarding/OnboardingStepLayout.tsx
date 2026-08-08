import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow, type, fontFamily, spacing } from '../../theme';
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
  secondaryButtonLabel,
  onPressSecondary,
  secondaryButtonDisabled = false,
  buttonHeight = 54,
  buttonFontSize = 20,
  buttonRadius = 16,
  bottomInset = 32,
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
  // Optional — Visual style (WF 12) is the first step that needs a second
  // action ("Предпросмотр") above the primary CTA. Ports .btn-secondary:
  // same footprint as the primary button, outline-only fill.
  secondaryButtonLabel?: string;
  onPressSecondary?: () => void;
  secondaryButtonDisabled?: boolean;
  // Button size/radius/bottom-offset — trialed on Visual style alone first
  // ("пока сделай изменения по кнопке только на этом экране"), then approved
  // and rolled out to every step screen as the new default (2026-08-07): was
  // 62px/var(--r-md,20px)/60px, now 54px/16px/32px. Kept as overridable
  // props (not hardcoded) in case a future screen needs its own exception
  // the way Visual style briefly did.
  buttonHeight?: number;
  buttonFontSize?: number;
  buttonRadius?: number;
  bottomInset?: number;
}) {
  const insets = useSafeAreaInsets();
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  // These divider lines only matter once there's something to actually
  // scroll — on most of these screens content fits without scrolling at
  // all, so neither line should ever appear there. Only render one once
  // you've scrolled a few px away from that edge, not permanently.
  const canScroll = contentHeight > layoutHeight + 1;
  const showTopBorder = canScroll && scrollY > 2;
  const showBottomBorder = canScroll && scrollY < contentHeight - layoutHeight - 2;

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

      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.contentInner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={32}
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          onContentSizeChange={(_w, h) => setContentHeight(h)}
          onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        >
          {children}
        </ScrollView>

        {/* Divider lines where scrolling content passes under the fixed
            header/footer, only rendered once there's actually overflow
            content scrolled a few px past that edge (`showTopBorder`/
            `showBottomBorder` above) — invisible the rest of the time, not a
            permanent overlay. A gradient fade was tried here first and
            dropped (2026-08-08 review: "я решила убрать градиент") in favor
            of a plain crisp hairline, positioned close to the header text
            (12px below its last line) rather than at content's own edge.
            pointerEvents:none so it never blocks taps. */}
        {showTopBorder && <View style={styles.topBorder} />}
        {showBottomBorder && <View style={styles.bottomBorder} />}
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + bottomInset }]}>
        {secondaryButtonLabel ? (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { height: buttonHeight, borderRadius: buttonRadius },
              pressed && !secondaryButtonDisabled && styles.secondaryButtonPressed,
              secondaryButtonDisabled && styles.buttonDisabled,
            ]}
            disabled={secondaryButtonDisabled}
            onPress={onPressSecondary}
          >
            <Text
              style={[
                styles.secondaryButtonLabel,
                { fontSize: buttonFontSize, lineHeight: buttonFontSize * 1.1 },
                secondaryButtonDisabled && styles.buttonLabelDisabled,
              ]}
            >
              {secondaryButtonLabel}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { height: buttonHeight, borderRadius: buttonRadius },
            pressed && !buttonDisabled && styles.buttonPressed,
            buttonDisabled && styles.buttonDisabled,
          ]}
          disabled={buttonDisabled}
          onPress={onPressNext}
        >
          <Text
            style={[
              styles.buttonLabel,
              { fontSize: buttonFontSize, lineHeight: buttonFontSize * 1.1 },
              buttonDisabled && styles.buttonLabelDisabled,
            ]}
          >
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
    marginTop: 16, // was 24 (2026-08-08: this whole gap reads as fixed/header, felt too tall)
    position: 'relative',
  },
  // Positioned relative to `content` (marginTop: 16 from the header above) —
  // top:-8 lands the line roughly in the middle of that gap, inside it
  // rather than at content's own edge. Color matches bg0 (2026-08-08 review:
  // "убери белую линию... граница такого же цвета как фон") — invisible by
  // design, same position kept in case this needs a real color again later.
  topBorder: {
    position: 'absolute',
    top: -8,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.bg0,
  },
  // Same idea at the bottom: 12px above where the button block begins.
  bottomBorder: {
    position: 'absolute',
    bottom: 12,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.bg0,
  },
  contentInner: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    // 2026-08-08 review: the header + its marginTop gap both stay fixed
    // while only the ScrollView's own children actually scroll — from the
    // user's point of view that whole zone is "the header", and the first
    // scrollable card sat flush against the end of it with zero breathing
    // room. This 8px is real space before the first child, confirmed via a
    // temporary red-background diagnostic on `top` so we were both looking
    // at the same boundary.
    paddingTop: 8,
    // Guarantees breathing room before the CTA even when content nearly (or
    // fully) fills the available scroll area — relying on leftover flex space
    // alone is fragile (works only by coincidence on some screens/devices,
    // vanishes the moment content is long enough, e.g. an expanded accordion
    // card), so the gap needs to be explicit, not incidental.
    // 24 -> 32 (2026-08-08 review): an expanded ExpandableChoiceCard's own
    // bottom border sat too close to the button block — "нужно чтобы было
    // расстояние между ними".
    paddingBottom: 32,
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
  // Ports .btn-secondary (style.css ~L311) — same footprint as the primary
  // button, outline-only fill treatment.
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(139,124,246,0.23)',
  },
  secondaryButtonLabel: {
    fontFamily: fontFamily.semiBold,
    color: colors.violet400,
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
