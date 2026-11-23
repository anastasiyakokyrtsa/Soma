import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { colors, fontFamily, glow } from '../theme';
import { BackIcon } from '../components/icons/BackIcon';
import { GradientIcon } from '../components/icons/GradientIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { StarsBackground } from '../components/StarsBackground';
import { MEDITATIONS } from '../content/meditations';
import { useTimedReveal, estimateReadMs } from '../lib/useTimedReveal';
import { useLanguage } from '../i18n/LanguageContext';

const CIRCLE_SIZE = 220;
// How long the last sentence stays on screen, fully revealed, before the
// session auto-advances to the complete screen - same "auto-navigate on
// completion" idiom BreathingSessionScreen already uses for its own
// cycle-based end, just time-based here instead of cycle-based.
const HOLD_AFTER_LAST_MS = 4000;

function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// No Skia here (confirmed broken in this Expo Go SDK, see
// memory/project_skia_reanimated_bridge.md and other screens' own
// comments) - the slow "breathing" pulse on the circle below is a plain
// Reanimated transform loop on a View, not a canvas.
function PulsingCircle({ icon }: { icon: Parameters<typeof GradientIcon>[0]['name'] }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.04, { duration: 2600 }), withTiming(1, { duration: 2600 })), -1, false);
  }, [scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.circle, style]}>
      <View style={styles.halo} />
      <GradientIcon name={icon} size={88} />
    </Animated.View>
  );
}

// Active session for one meditation - no audio (brief 003's explicit
// "БЕЗ озвучки"), so the practice's text is the only thing pacing the
// person through it: one sentence on screen at a time, crossfading to the
// next on its own timer (useTimedReveal, paced by reading length via
// estimateReadMs - see lib/useTimedReveal.ts) rather than all of
// content/meditations.ts's `sentences` dumped on screen at once.
export function MeditationSessionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { language } = useLanguage();
  const id = route?.params?.id;
  const meditation = MEDITATIONS.find((m) => m.id === id) ?? MEDITATIONS[0];
  const sentences = meditation.sentences[language];
  const totalSeconds = meditation.durationMinutes * 60;

  const [paused, setPaused] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { revealed, finished } = useTimedReveal(
    sentences.length,
    (i) => estimateReadMs(sentences[i - 1], { msPerWord: 260, settleMs: 1200, minMs: 2800, maxMs: 11000 }),
    paused,
  );

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (!finished) return;
    const timer = setTimeout(() => navigation.replace('MeditationComplete', { id: meditation.id }), HOLD_AFTER_LAST_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const progress = Math.min(1, elapsedSeconds / totalSeconds);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={[styles.circleWrap, { marginTop: insets.top + 72 }]}>
        <PulsingCircle icon={meditation.icon} />
      </View>

      <View style={styles.textWrap}>
        <Animated.Text key={revealed} entering={FadeIn.duration(700)} exiting={FadeOut.duration(400)} style={styles.sentence}>
          {sentences[revealed - 1]}
        </Animated.Text>
      </View>

      <View style={{ flex: 1 }} />

      <View style={[styles.bottom, { marginBottom: insets.bottom + 24 }]}>
        <Text style={styles.timeLabel}>
          {formatMMSS(elapsedSeconds)} / {formatMMSS(totalSeconds)}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Pressable style={styles.fab} onPress={() => setPaused((v) => !v)} hitSlop={8}>
          {paused ? <PlayIcon size={22} color={colors.bg0} /> : <PauseIcon size={22} color={colors.bg0} />}
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
  backButton: {
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
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    boxShadow:
      '0px 0px 50px 12px rgba(139,124,246,0.16), 0px 0px 90px 26px rgba(255,198,241,0.07), inset 0px 0px 60px 22px rgba(139,124,246,0.18), inset 0px 0px 32px 8px rgba(255,198,241,0.12)',
  },
  textWrap: {
    marginTop: 40,
    paddingHorizontal: 32,
    minHeight: 110,
    justifyContent: 'center',
  },
  sentence: {
    fontFamily: fontFamily.medium,
    fontSize: 20,
    lineHeight: 20 * 1.5,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 16,
  },
  timeLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.violet400,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
});
