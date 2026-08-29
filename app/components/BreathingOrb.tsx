import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Breathing Session" orb (index.html #breathing, style.css
// ~L959-975, js/main.js ~L305-372) - a real, Figma-effect-sourced component
// that was sitting unused in the kit (never wired into the app) until this
// screen needed it. 5 size/glow presets (A-E), decomposed into numeric
// blur/opacity fields (rather than the kit's pre-built CSS strings) so they
// can be smoothly interpolated instead of only snapping between presets.
//
// Cycle is 4 phases x 4-3-2-1 seconds = 16 steps, not the kit's own 12 -
// her explicit ask, 2026-08-28: the kit (and this component's first pass)
// only has Вдох/Задержка/Выдох, going straight back into the next inhale
// with no hold after the exhale - real box breathing holds on BOTH empty
// and full lungs. Added a second "Задержка" phase after Выдох, held flat
// at level A (resting size, no pulse within the hold itself - unlike the
// post-inhale hold, which peaks at E/D since the lungs are actually full).
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
  { name: 'Задержка', sec: 4, level: 'A' },
  { name: 'Задержка', sec: 3, level: 'A' },
  { name: 'Задержка', sec: 2, level: 'A' },
  { name: 'Задержка', sec: 1, level: 'A' },
];

// Slow idle "alive" pulse for whenever the orb is at rest (Info screen
// while she reads, Session screen before pressing play) - her explicit ask,
// 2026-08-28: "слово из шара на этом моменте убрать, и хочется анимации
// добавить, чтобы этот шар планету оживить... как-то натурально, как
// космическое тело". A calm, slow breathe of glow between level A and this
// slightly bigger/brighter point - not the real counted breathing cycle
// (that starts only once `running`), just ambient life. 4.5s each way,
// matching the unhurried pace of someone reading the info card below.
// Size itself no longer animates here (her follow-up: "убери анимацию
// увеличения и уменьшения сферы... оставь только дыхание свечением") -
// only IDLE_HIGH's glow fields are actually used now, `size` stays fixed
// at LEVELS.A.size.
const IDLE_HIGH = { size: 158, inset1Blur: 42, inset1Op: 0.5, inset2Blur: 205, inset2Op: 0.16, outerBlur: 95, outerOp: 0.28 };

// Same-round follow-up: her actual ask was about the orb's own violet
// glow/shadow itself coming alive, not a separate decorative element -
// "ты видишь что у шара есть фиолетовая окантовка? вот эта тень... нафига
// ты мне вставил кольцо какое-то". A first attempt added a rotating
// gradient-stroked ring around the orb (ResourceRing's own technique) to
// fake a "traveling wave" - wrong read of the ask, reverted entirely.
// This is a second, faster oscillation layered ON TOP of the slow idle
// pulse above, applied only to the glow's own opacity/blur (not size) -
// a subtle shimmer/flicker within the SAME shadow, still purely boxShadow,
// no new shape. `shimmerAmt` swings -1..1; the small per-field multipliers
// below keep it a gentle flicker, not a distracting strobe.
const SHIMMER_DURATION_MS = 1700;

function useAnimationClock() {
  const [time, setTime] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const now = Date.now();
      if (startRef.current === null) startRef.current = now;
      setTime(now - startRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return time;
}

// Shared by every breathing-flow screen so the orb sits at the exact same
// vertical position on all of them (measured from the safe area) - her
// explicit ask, 2026-08-27: the Info screen's orb had drifted higher than
// the Session screen's own position ("поставь его туда где он и на
// последующих экранах находится").
export const ORB_TOP_OFFSET = 100;

function clamp01(v: number) {
  'worklet';
  return Math.min(1, Math.max(0, v));
}

function boxShadowFor(inset1Blur: number, inset1Op: number, inset2Blur: number, inset2Op: number, outerBlur: number, outerOp: number) {
  'worklet';
  return `inset 0px 0px ${inset1Blur}px rgba(139,124,246,${clamp01(inset1Op)}), inset 0px 0px ${inset2Blur}px rgba(139,124,246,${clamp01(inset2Op)}), 0px 0px ${outerBlur}px rgba(139,124,246,${clamp01(outerOp)})`;
}

function subtitleFor(phase: string) {
  if (phase === 'Вдох') return 'Вдыхай через нос';
  if (phase === 'Задержка') return 'Задержи дыхание';
  return 'Выдыхай через рот';
}

export function BreathingOrb({
  running,
  wrapSize = 300,
  showInstruction = false,
  onCycleComplete,
  onStepChange,
}: {
  // false = calm "ready" preview (level A, no phase cycling).
  running: boolean;
  wrapSize?: number;
  // Adds the phase title/subtitle/seconds block below the orb - only
  // meaningful while running.
  showInstruction?: boolean;
  // Fires every time a full 16-step cycle finishes, with the running total
  // completed so far - lets the screen own "how many of N reps" without
  // duplicating the step-advance clock here.
  onCycleComplete?: (completedCycles: number) => void;
  // Fires every step (once/second while running) with progress through the
  // *current* cycle (0 = just started, close to 1 = about to wrap) - lets
  // a progress bar fill the in-progress segment smoothly instead of only
  // jumping at cycle boundaries.
  onStepChange?: (fraction: number) => void;
}) {
  // Continuously-incrementing "step position" (0,1,2,3,...), animated 1
  // unit at a time over 1s so useAnimatedStyle can read a smooth
  // in-between value - not wrapped to 0-15 at the driving level, only when
  // reading it (see the worklet below), so each new withTiming call is a
  // simple "+1 from wherever we are" with no seam at the cycle wrap.
  const stepProgress = useSharedValue(0);
  const stepRef = useRef(0);
  const cycleRef = useRef(0);
  const [stepIndex, setStepIndex] = useState(0);
  // Idle pulse, 0->1->0 forever while at rest - see IDLE_HIGH above.
  const idleProgress = useSharedValue(0);
  // Faster secondary flicker layered onto the idle glow - see SHIMMER_DURATION_MS above.
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (!running) {
      cancelAnimation(stepProgress);
      idleProgress.value = withRepeat(withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.sin) }), -1, true);
      shimmer.value = withRepeat(withTiming(1, { duration: SHIMMER_DURATION_MS, easing: Easing.inOut(Easing.sin) }), -1, true);
      return () => {
        cancelAnimation(idleProgress);
        cancelAnimation(shimmer);
      };
    }
    cancelAnimation(idleProgress);
    cancelAnimation(shimmer);
    idleProgress.value = 0;
    shimmer.value = 0;
    const advance = () => {
      stepRef.current += 1;
      stepProgress.value = withTiming(stepRef.current, { duration: 1000, easing: Easing.linear });
      const idx = stepRef.current % STEPS.length;
      setStepIndex(idx);
      onStepChange?.((idx + 1) / STEPS.length);
      if (idx === 0) {
        cycleRef.current += 1;
        onCycleComplete?.(cycleRef.current);
      }
    };
    advance();
    const interval = setInterval(advance, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const animatedStyle = useAnimatedStyle(() => {
    if (running) {
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
    }
    const t = idleProgress.value;
    const cur = LEVELS.A;
    const next = IDLE_HIGH;
    const size = cur.size;
    // -1..1, a gentle flicker riding on top of the slow breathe - glow only.
    const shimmerAmt = (shimmer.value - 0.5) * 2;
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      boxShadow: boxShadowFor(
        cur.inset1Blur + (next.inset1Blur - cur.inset1Blur) * t + shimmerAmt * 6,
        cur.inset1Op + (next.inset1Op - cur.inset1Op) * t + shimmerAmt * 0.06,
        cur.inset2Blur + (next.inset2Blur - cur.inset2Blur) * t + shimmerAmt * 10,
        cur.inset2Op + (next.inset2Op - cur.inset2Op) * t + shimmerAmt * 0.03,
        cur.outerBlur + (next.outerBlur - cur.outerBlur) * t + shimmerAmt * 6,
        cur.outerOp + (next.outerOp - cur.outerOp) * t + shimmerAmt * 0.05
      ),
    };
  }, [running]);

  const phase = running ? STEPS[stepIndex].name : '';
  const seconds = running ? STEPS[stepIndex].sec : null;

  return (
    <View style={styles.column}>
      <View style={[styles.wrap, { width: wrapSize, height: wrapSize }]}>
        <Animated.View style={[styles.orb, animatedStyle]} />
      </View>
      {/* Text hierarchy redesigned per her Mobbin reference, 2026-08-28:
          "иерархия текста - заголовок побольше, ниже текст менее яркого
          цвета и внизу секунды" - moved out of the orb entirely (the
          reference's own orb has no text on it at all) into a plain title
          -> subtitle -> seconds stack below, each a visibly different
          weight/size/color instead of the old single all-in-one sentence. */}
      {showInstruction && running && seconds !== null ? (
        <View style={styles.textBlock}>
          <Text style={styles.phaseTitle}>{phase}</Text>
          <Text style={styles.phaseSubtitle}>{subtitleFor(phase)}</Text>
          <Text style={styles.phaseSeconds}>{seconds} сек</Text>
        </View>
      ) : null}
    </View>
  );
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
  textBlock: {
    marginTop: 28,
    alignItems: 'center',
    gap: 6,
  },
  phaseTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
    color: colors.textPrimary,
  },
  phaseSubtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  phaseSeconds: {
    marginTop: 6,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textTertiary,
  },
});
