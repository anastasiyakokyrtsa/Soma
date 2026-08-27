import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Breathing Session" orb (index.html #breathing, style.css
// ~L959-975, js/main.js ~L305-372) - a real, Figma-effect-sourced component
// that was sitting unused in the kit (never wired into the app) until this
// screen needed it. 5 size/glow presets (A-E) and a 12-step box-breathing
// sequence (Вдох 4-3-2-1, Задержка 4-3-2-1, Выдох 4-3-2-1, one step per
// second - matches the kit's own "12 steps... matches the 12 reference
// frames exactly"), transcribed from the kit's own preset table, decomposed
// into numeric blur/opacity fields (rather than the kit's pre-built CSS
// strings) so they can be smoothly interpolated here instead of only
// snapping between presets.
//
// Driven by a plain rAF clock, not Reanimated - this orb's own "glow"
// visual is a boxShadow string recomputed every frame from the current
// interpolated preset, which is exactly the class of continuous, per-frame,
// non-transform animation this app's established pattern already covers
// (see ResourceRing.tsx/PersonalizationIllustration.tsx's own
// useAnimationClock) - no need to introduce a second animation system
// (Reanimated) just for this one component. `paused` freezes the clock in
// place rather than hiding the animation, so resuming continues smoothly
// from wherever the cycle actually was.
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

const CYCLE_MS = STEPS.length * 1000;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useAnimationClock(paused: boolean) {
  const [time, setTime] = useState(0);
  const pausedAtRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    let raf: number;
    const base = Date.now() - pausedAtRef.current;
    const tick = () => {
      const elapsed = Date.now() - base;
      pausedAtRef.current = elapsed;
      setTime(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return time;
}

function boxShadowFor(size: number, inset1Blur: number, inset1Op: number, inset2Blur: number, inset2Op: number, outerBlur: number, outerOp: number) {
  return `inset 0px 0px ${inset1Blur}px rgba(139,124,246,${inset1Op}), inset 0px 0px ${inset2Blur}px rgba(139,124,246,${inset2Op}), 0px 0px ${outerBlur}px rgba(139,124,246,${outerOp})`;
}

export function BreathingOrb({
  running,
  wrapSize = 300,
  showInstruction = false,
}: {
  // false = calm "ready" preview (Info screen) - level A, no phase cycling.
  running: boolean;
  wrapSize?: number;
  // Adds the "Вдыхай через нос 4 секунды"-style line below the orb - only
  // meaningful while running (see instructionFor below).
  showInstruction?: boolean;
}) {
  const time = useAnimationClock(running);

  let size = LEVELS.A.size;
  let boxShadow = boxShadowFor(LEVELS.A.size, LEVELS.A.inset1Blur, LEVELS.A.inset1Op, LEVELS.A.inset2Blur, LEVELS.A.inset2Op, LEVELS.A.outerBlur, LEVELS.A.outerOp);
  let phase = 'Вдыхай';
  let seconds: number | null = null;

  if (running) {
    const cycleMs = time % CYCLE_MS;
    const stepIndex = Math.floor(cycleMs / 1000) % STEPS.length;
    const localT = (cycleMs % 1000) / 1000;
    const cur = STEPS[stepIndex];
    const next = STEPS[(stepIndex + 1) % STEPS.length];
    const curLevel = LEVELS[cur.level];
    const nextLevel = LEVELS[next.level];

    size = lerp(curLevel.size, nextLevel.size, localT);
    boxShadow = boxShadowFor(
      size,
      lerp(curLevel.inset1Blur, nextLevel.inset1Blur, localT),
      lerp(curLevel.inset1Op, nextLevel.inset1Op, localT),
      lerp(curLevel.inset2Blur, nextLevel.inset2Blur, localT),
      lerp(curLevel.inset2Op, nextLevel.inset2Op, localT),
      lerp(curLevel.outerBlur, nextLevel.outerBlur, localT),
      lerp(curLevel.outerOp, nextLevel.outerOp, localT)
    );
    phase = cur.name;
    seconds = cur.sec;
  }

  return (
    <View style={styles.column}>
      <View style={[styles.wrap, { width: wrapSize, height: wrapSize }]}>
        <View style={[styles.orb, { width: size, height: size, borderRadius: size / 2, boxShadow }]} />
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
  const s = `${sec} ${declineSeconds(sec)}`;
  if (phase === 'Вдох') return `Вдыхай через нос ${s}`;
  if (phase === 'Задержка') return `Задержи дыхание на ${s}`;
  return `Выдыхай через рот ${s}`;
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    backgroundColor: 'rgba(5,8,22,0.03)',
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
