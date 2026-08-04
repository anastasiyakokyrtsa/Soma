import { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { colors, fontFamily, radius } from '../theme';

const LABEL_TOP_IDLE = 22;
const LABEL_TOP_FLOAT = 8;

// Ports UI Kit's .field-input (style.css ~L430). Feedback rounds baked in
// (2026-08-03):
//
// Round 1: border thinned 1.5 -> 1.05 (30% thinner), idle border/label unified
// on colors.borderDefault, label floats up on focus/value.
//
// Round 2 attempted a smooth fontSize interpolation (18 -> 12) via
// useAnimatedStyle — still clipped the label the instant the field was
// tapped (before any typing), on every screen that uses this component. Root
// cause: animating `fontSize` on a Text node forces a native text
// remeasure every frame, and Android/Fabric doesn't reliably keep that in
// sync with an absolutely-positioned parentless Text — the box can render
// with a stale (too-narrow) width mid-animation and clip. Fixed by no longer
// animating anything that requires remeasurement: `top` and `fontSize` are
// now both static per-state (idle vs floated, no interpolation), and the
// *only* animated property is `transform: translateY` — a pure paint-time
// operation that never touches layout/measurement, so there's nothing left
// for the remeasure race to corrupt. Position still slides smoothly; size
// now snaps instantly between the two states, which reads fine at 180ms.
//
// Round 2 also changes when the label is visible at all, not just its color:
// filled + blurred now hides the label entirely (opacity 0) rather than
// showing it in a quieter color — once there's a committed value sitting in
// the field, the label is redundant and was just adding visual noise. It's
// only ever on screen while the field is empty (as a placeholder) or while
// actively focused (as a caption confirming what you're typing).
//
// Round 3: the typed value's own vertical position now depends on whether
// space needs to stay reserved for a floated label above it — bottom-anchored
// (wrapper justifyContent:'flex-end') only while focused, since that's the
// only state where the label is both floated *and* visible up top; otherwise
// (empty-idle or filled-blurred, label hidden) the value/placeholder centers
// normally in the full field height.
export function TextField({
  label,
  value,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps & { label: string }) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!(value && String(value).length > 0);
  const floated = focused || hasValue;
  const labelVisible = focused || !hasValue;

  const progress = useSharedValue(floated ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(floated ? 1 : 0, { duration: 180, easing: Easing.out(Easing.cubic) });
  }, [floated, progress]);

  const labelPositionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, LABEL_TOP_FLOAT - LABEL_TOP_IDLE]) }],
  }));

  const borderColor = focused ? colors.violet400 : colors.borderDefault;
  const labelColor = focused ? colors.violet300 : colors.borderDefault;

  return (
    <View
      style={[
        styles.wrapper,
        { borderColor, justifyContent: focused ? 'flex-end' : 'center' },
        style,
      ]}
    >
      <Animated.Text
        style={[
          styles.label,
          labelPositionStyle,
          {
            fontSize: floated ? 12 : 18,
            color: labelColor,
            opacity: labelVisible ? 1 : 0,
          },
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        {...rest}
        value={value}
        style={[styles.input, { paddingBottom: focused ? 12 : 0 }]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.bg0,
    borderWidth: 1.05,
    paddingHorizontal: 20,
    width: '100%',
  },
  label: {
    position: 'absolute',
    left: 20,
    top: LABEL_TOP_IDLE,
    fontFamily: fontFamily.medium,
  },
  input: {
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
    fontSize: 18,
    paddingTop: 0,
  },
});
