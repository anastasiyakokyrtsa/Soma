import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Breathing Session" orb (index.html #breathing, style.css
// ~L959-975, js/main.js ~L305-372) - a real, Figma-effect-sourced component
// that was sitting unused in the kit (never wired into the app) until this
// screen needed it. 5 size/glow presets (A-E) and a 12-step box-breathing
// sequence (Вдох 4-3-2-1, Задержка 4-3-2-1, Выдох 4-3-2-1, one step per
// second - matches the kit's own "12 steps... matches the 12 reference
// frames exactly"), transcribed from the kit's own preset table, decomposed
// into numeric blur/opacity fields (rather than the kit's pre-built CSS
// strings) so they can be smoothly interpolated instead of only snapping
// between presets.
//
// Take 2: first pass drove this off a plain rAF clock + `useState` (the
// pattern ResourceRing/PersonalizationIllustration use for their own
// per-frame animation) - on her device it didn't visibly animate at all
// ("вначале должно быть состояние Плей... а анимация... её просто нет").
// Those other components animate a `transform` (rotate) or repaint a Skia
// canvas; this one was re-rendering width/height/boxShadow (real layout-
// triggering properties) via plain JS `setState` every frame, which is a
// much heavier ask of the JS thread/reconciler than a transform-only
// re-render and apparently didn't hold up on-device. Switched to
// Reanimated `withTiming`, chained one 1-second step at a time (matching
// the kit's own "transition ... 1s linear" applied per-step) and read back
// inside `useAnimatedStyle` - real UI-thread-driven animation, the same
// class of technique already proven elsewhere in this app
// (StyleSwatch/ProgressDots), just applied to width/height/boxShadow
// instead of transform/opacity. `cancelAnimation` on pause freezes the
// orb at exactly its current interpolated state rather than letting the
// in-flight 1s step finish first.
type LevelKey = 'A' | 'B' | 'C' | 'D' | 'E';

const LEVELS: Record<LevelKey, { size: number; inset1Blur: number; inset1Op: number; inset2Blur: number; inset2Op: number; outerBlur: number; outerOp: number }> = {
  A: { size: 140, inset1Blur: 24, inset1Op: 0.4, inset2Blur: 192, inset2Op: 0.1, outerBlur: 80, outerOp: 0.2 },
  B: { size: 180, inset1Blur: 110, inset1Op: 0.5, inset2Blur: 30, inset2Op: 0.4, outerBlur: 80, outerOp: 0.3 },
  C: { size: 220, inset1Blur: 150, inset1Op: 0.7, inset2Blur: 40, inset2Op: 0.5, outerBlur: 80, outerOp: 0.4 },
  D: { size: 260, inset1Blur: 220, inset1Op: 1, inset2Blur: 50, inset2Op: 0.7, outerBlur: 90, outerOp: 0.6 },
  E: { size: 300, inset1Blur: 250, inset1Op: 1, inset2Blur: 50, inset2Op: 0.7, outerBlur: 90, outerOp: 0.7 },
};

const STEPS: { name: string; sec: number; level: LevelKey }[] = [
  { name: 'Вдох', sec: 4, level: 'A' },
  { name: 'Вдох', sec: 3, level: 'B' },
  { name: 'Вдох', sec: 2, level: 'C' },
  { name: 'Вдох', sec: 1, level: 'D' },
  { name: 'Задержка', sec: 4, level: 'E' },
  { name: 'Задержка', sec: 3, level: 'D' },
  { name: 'Задержка', sec: 2, level: 'E' },
  { name: 'Задержка', sec: 1, level: 'D' },
  { name: 'Выдох', sec: 4, level: 'D' },
  { name: 'Выдох', sec: 3, level: 'C' },
  { name: 'Выдох', sec: 2, level: 'B' },
  { name: 'Выдох', sec: 1, level: 'A' },
];

// Shared by every breathing-flow screen so the orb sits at the exact same
// vertical position on all of them (measured from the safe area) - her
// explicit ask, 2026-08-27: the Info screen's orb had drifted higher than
// the Session screen's own position ("поставь его туда где он и на
// последующих экранах находится").
export const ORB_TOP_OFFSET = 100;

function boxShadowFor(inset1Blur: number, inset1Op: number, inset2Blur: number, inset2Op: number, outerBlur: number, outerOp: number) {
  'worklet';
  return `inset 0px 0px ${inset1Blur}px rgba(139,124,246,${inset1Op}), inset 0px 0px ${inset2Blur}px rgba(139,124,246,${inset2Op}), 0px 0px ${outerBlur}px rgba(139,124,246,${outerOp})`;
}

export function BreathingOrb({
  running,
  wrapSize = 300,
  showInstruction = false,
}: {
  // false = calm "ready" preview (level A, no phase cycling).
  running: boolean;
  wrapSize?: number;
  // Adds the "Вдыхай через нос 4 секунды"-style line below the orb - only
  // meaningful while running (see instructionFor below).
  showInstruction?: boolean;
}) {
  // Continuously-incrementing "step position" (0,1,2,3,...), animated 1
  // unit at a time over 1s so useAnimatedStyle can read a smooth
  // in-between value - not wrapped to 0-11 at the driving level, only when
  // reading it (see the worklet below), so each new withTiming call is a
  // simple "+1 from wherever we are" with no seam at the 12->0 wrap.
  const stepProgress = useSharedValue(0);
  const stepRef = useRef(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!running) {
      cancelAnimation(stepProgress);
      return;
    }
    const advance = () => {
      stepRef.current += 1;
      stepProgress.value = withTiming(stepRef.current, { duration: 1000, easing: Easing.linear });
      setStepIndex(stepRef.current % STEPS.length);
    };
    advance();
    const interval = setInterval(advance, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = stepProgress.value % STEPS.length;
    const idx = Math.floor(t);
    const localT = t - idx;
    const cur = LEVELS[STEPS[idx].level];
    const next = LEVELS[STEPS[(idx + 1) % STEPS.length].level];
    const size = cur.size + (next.size - cur.size) * localT;
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      boxShadow: boxShadowFor(
        cur.inset1Blur + (next.inset1Blur - cur.inset1Blur) * localT,
        cur.inset1Op + (next.inset1Op - cur.inset1Op) * localT,
        cur.inset2Blur + (next.inset2Blur - cur.inset2Blur) * localT,
        cur.inset2Op + (next.inset2Op - cur.inset2Op) * localT,
        cur.outerBlur + (next.outerBlur - cur.outerBlur) * localT,
        cur.outerOp + (next.outerOp - cur.outerOp) * localT
      ),
    };
  }, [running]);

  const phase = running ? STEPS[stepIndex].name : 'Вдыхай';
  const seconds = running ? STEPS[stepIndex].sec : null;

  return (
    <View style={styles.column}>
      <View style={[styles.wrap, { width: wrapSize, height: wrapSize }]}>
        <Animated.View style={[styles.orb, animatedStyle]} />
        <View style={styles.textWrap} pointerEvents="none">
          <Text style={styles.phase}>{phase}</Text>
          {seconds !== null ? <Text style={styles.timer}>{seconds} сек</Text> : null}
        </View>
      </View>
      {/* Richer per-phase instruction below the orb (WF 26/27: "Вдыхай через
          нос 4 секунды") - single source of truth for the current
          phase/seconds stays here rather than duplicating the clock/step
          math in the screen that wants this line. */}
      {showInstruction && seconds !== null ? <Text style={styles.instruction}>{instructionFor(phase, seconds)}</Text> : null}
    </View>
  );
}

function declineSeconds(n: number) {
  return n === 1 ? 'секунду' : 'секунды';
}

function instructionFor(phase: string, sec: number) {
  const s = `${sec} ${declineSeconds(sec)}`;
  if (phase === 'Вдох') return `Вдыхай через нос ${s}`;
  if (phase === 'Задержка') return `Задержи дыхание на ${s}`;
  return `Выдыхай через рот ${s}`;
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Solid/opaque now, not the kit's own near-transparent rgba(5,8,22,.03) -
  // her explicit ask, 2026-08-27: "не будем делать шар прозрачным, чтобы
  // звезды не было видно через него, чтобы это было как планета". The kit
  // gets away with a near-invisible fill because its own page background is
  // a flat dark color; this app's screens sit on a starfield with visible
  // individual stars, which showed straight through the orb's core at 3%
  // opacity - all other settings (the box-shadow glow itself) unchanged.
  orb: {
    backgroundColor: colors.bg0,
  },
  textWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  phase: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  timer: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  instruction: {
    marginTop: 24,
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
