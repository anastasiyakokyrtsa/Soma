import { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius } from '../theme';

// Reusable bottom sheet for optional "what does this mean" explanations —
// first use: the biorhythm-model disclaimer (audit findings #3/#9, owner+
// mentor confirmed 2026-09-05/13). Opened from an (i) button, never forced,
// no confirm button — this is reference info, not a choice to agree to.
// Closes on scrim tap or on a real drag-down gesture (below), not just the
// Modal's own programmatic slide - a plain `Modal` has no built-in swipe
// dismissal, so "swipe down to close" needs its own gesture handling.
// Built on core RN Animated + PanResponder rather than
// react-native-gesture-handler - that library isn't a dependency of this
// project (native-stack doesn't need it, unlike the older stack navigator),
// and a simple one-directional drag doesn't need anything more.
const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 1.2;

export function InfoSheet({
  visible,
  onClose,
  title,
  paragraphs,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  paragraphs: string[];
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  // Reset position each time the sheet opens - otherwise a swipe-dismissed
  // close would leave it parked off-screen for the next open.
  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      // Only claims the gesture once it's clearly a vertical drag, not a tap
      // (taps on the sheet itself should do nothing, there's no button to
      // press) and not a horizontal swipe.
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY) {
          Animated.timing(translateY, { toValue: 700, duration: 180, useNativeDriver: true }).start(() => onClose());
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.scrimTap} onPress={onClose} accessibilityRole="button" accessibilityLabel="Закрыть" />
        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + 24, transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {paragraphs.map((p, i) => (
            <Text key={i} style={[styles.paragraph, i > 0 && styles.paragraphSpacing]}>
              {p}
            </Text>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrimTap: {
    flex: 1,
    backgroundColor: 'rgba(3,4,10,0.55)',
  },
  // Tokens matched to BreathingInfoScreen's own bottom card (2026-09-13, her
  // ask) - cardFillFallback/radius.card/32px top padding/centered bold title
  // all come from there, for the two info-panels in the app to feel like one
  // family. Body text switched to textPrimary (2026-09-13, her catch): the
  // original textSecondary reasoning was about the (i) icon competing with
  // other content next to it on Home/Biorhythms - once the sheet itself is
  // open, its text IS the only content on screen, nothing left to be quieter
  // than, so it should read as clearly as Breathing's own description does.
  // Left-aligned, not centered like Breathing's: that's one short line of
  // primary content, this is 3 full paragraphs, and centering multi-line
  // body text makes it harder to read.
  sheet: {
    backgroundColor: colors.cardFillFallback,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.borderDefault,
    marginBottom: 20,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  paragraphSpacing: {
    marginTop: 14,
  },
});
