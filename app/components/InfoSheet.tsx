import { useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors, fontFamily, radius } from '../theme';

// Reusable bottom sheet for optional "what does this mean" explanations —
// first use: the biorhythm-model disclaimer (audit findings #3/#9, owner+
// mentor confirmed 2026-09-05/13). Opened from an (i) button, never forced,
// no confirm button — this is reference info, not a choice to agree to.
//
// Swipe-to-dismiss history worth knowing before touching this again: a
// plain `Modal` has no built-in swipe gesture at all (first miss - it was
// only ever described as working, never wired). A follow-up attempt used
// core RN `Animated` + `PanResponder`, which didn't respond on her real
// device (legacy responder-system gestures are known to be flaky under
// React Native's newer default architecture). This version uses
// `react-native-gesture-handler`'s modern Gesture API instead - it's
// actually bundled in this Expo Go SDK (confirmed via
// expo/bundledNativeModules.json, same check used for the Skia bridge
// issue) and is the standard, well-tested way to do this, not a guess.
// Requires `<GestureHandlerRootView>` wrapping the app root (App.tsx) -
// gestures silently no-op without it.
const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 800;

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
  const translateY = useSharedValue(0);

  // Reset position each time the sheet opens - otherwise a swipe-dismissed
  // close would leave it parked off-screen for the next open.
  useEffect(() => {
    if (visible) translateY.value = 0;
  }, [visible, translateY]);

  const close = () => onClose();

  const pan = Gesture.Pan()
    .onChange((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        translateY.value = withTiming(700, { duration: 180 }, () => runOnJS(close)());
      } else {
        translateY.value = withSpring(0, { damping: 18 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {/* Modal renders its content on its own native surface, separate from
          the app's root - the <GestureHandlerRootView> in App.tsx doesn't
          reach in here, so this Modal needs its own, or the gesture below
          silently never fires. Documented gesture-handler + Modal
          limitation, not something specific to this screen. */}
      <GestureHandlerRootView style={styles.root}>
        <Pressable style={styles.scrimTap} onPress={onClose} accessibilityRole="button" accessibilityLabel="Закрыть" />
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }, sheetStyle]}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            {paragraphs.map((p, i) => (
              <Text key={i} style={[styles.paragraph, i > 0 && styles.paragraphSpacing]}>
                {p}
              </Text>
            ))}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
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
  // family. Body text is textPrimary (2026-09-13, her catch): the earlier
  // textSecondary reasoning was about the (i) icon competing with other
  // content next to it on Home/Biorhythms - once the sheet itself is open,
  // its text IS the only content on screen, nothing left to be quieter
  // than. Left-aligned, not centered like Breathing's: that's one short
  // line of primary content, this is 3 full paragraphs of reading, and
  // centering multi-line body text makes it harder to read.
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
