import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Shared between the crisp ring and its glow duplicate below, so the two
// gradients can't drift out of sync with each other.
const RING_GRADIENT_STOPS = [
  { offset: 0, color: colors.violet400 },
  { offset: 0.47, color: '#FFC6F1' },
  { offset: 0.5, color: '#FFE3F6' },
  { offset: 0.53, color: '#FFC6F1' },
  { offset: 1, color: colors.violet400 },
];

// Ports UI Kit's "Resource Meter" (.resource-ring/.rr-*, style.css ~L843) -
// a single always-the-same violet/pink ring (no progress-arc logic, purely
// decorative), for WF's Home screen "42% Низкий ресурс" card. The kit's own
// ring color is a spinning conic-gradient (no RN equivalent) - approximated
// here as a static diagonal linear gradient across the ring's own stroke,
// the same technique already used for SleepWheelPicker's arc.
//
// Spin animation (2026-08-20, "нужно анимировать... прогресс бар") - kit's
// own `.rr-ring` spec (`rrSpin`, style.css ~L887): one full rotation every
// 5s, `linear infinite` - "5s" is the loop *duration*, "infinite" means it
// never stops (her explicit ask: "анимация не 5 секунд, она должна
// бесконечно идти" - confirming this reads as a single 5s play then stop,
// not a forever loop). Driven by a plain requestAnimationFrame clock (not
// Reanimated-into-a-Skia-prop, the confirmed-broken bridge on this Expo Go
// SDK - see [[project-skia-reanimated-bridge]] - though this is
// react-native-svg not Skia; kept on the app's one proven rAF-clock pattern
// anyway for architectural consistency, same shape as PersonalizationScreen's
// own `useAnimationClock`). The angle is `elapsed % SPIN_DURATION_MS`, not
// raw elapsed time, so it wraps cleanly forever instead of the number
// (harmlessly, since only its value-mod-360 ever matters, but still worth
// keeping bounded) growing without limit for as long as the screen stays
// mounted. No throttle on the tick rate - a slow/calm rotation shows
// dropped frames more, not less, than fast motion (see PersonalizationScreen's
// own TICK_MS=0 lesson), so every rAF frame updates the clock.
const SPIN_DURATION_MS = 5000;

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

export function ResourceRing({ value, caption, size = 244 }: { value: number; caption: string; size?: number }) {
  const stroke = 2;
  const r = size / 2 - stroke;
  const time = useAnimationClock();
  const angle = ((time % SPIN_DURATION_MS) / SPIN_DURATION_MS) * 360;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* kit's `.rr-halo` - plain circular div (border-radius:50%), 4-layer
          box-shadow (2 outward + 2 inset), a circular View's boxShadow
          follows its own borderRadius correctly (unlike the earlier
          unrounded SVG/View version, which read as a square glow - fixed
          2026-08-20). Stays a flat, uncolored ambient bloom - the kit's own
          halo doesn't track the ring's gradient hue or its rotation, that's
          a separate ask (below). */}
      <View style={[styles.halo, { width: size, height: size, borderRadius: size / 2 }]} />
      {/* New: a wider, blurred duplicate of the ring's own gradient stroke,
          rotating with the exact same `angle` as the crisp ring below it -
          her follow-up ask, 2026-08-20: "свечение же под цвет кольца?
          хотелось бы... и чтобы во время вращения, вращение свечения тоже
          было видно". The flat `halo` above can't show this on its own
          (a symmetric blur around a circle looks identical at any rotation
          angle - there's nothing angular in it to rotate) - this layer
          gives the glow real angular color variation (the same violet/pink/
          glint gradient) so its own rotation is genuinely visible, in sync
          with the ring. Same FeGaussianBlur-on-a-stroke technique already
          proven safe in this app for a ring at this scale (BiorhythmChart's
          own rings), not the large-filter-region case that caused trouble
          on BottomBar. */}
      <Svg width={size} height={size} style={[styles.glowSvg, { transform: [{ rotate: `${angle}deg` }] }]}>
        <Defs>
          <LinearGradient id="rrGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {RING_GRADIENT_STOPS.map((s, i) => (
              <Stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </LinearGradient>
          <Filter id="rrGlowBlur" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation={8} />
          </Filter>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="url(#rrGlowGrad)" strokeWidth={18} strokeOpacity={0.55} filter="url(#rrGlowBlur)" fill="none" />
      </Svg>
      <Svg width={size} height={size} style={[styles.ringSvg, { transform: [{ rotate: `${angle}deg` }] }]}>
        <Defs>
          <LinearGradient id="rrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {RING_GRADIENT_STOPS.map((s, i) => (
              <Stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="url(#rrGrad)" strokeWidth={stroke} fill="none" />
      </Svg>

      <View style={[StyleSheet.absoluteFill, styles.content]}>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.pct}>%</Text>
        </View>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  // kit's .rr-halo, all 4 layers (2 outward + 2 inset) - a circular View's
  // own boxShadow follows its borderRadius correctly, so this genuinely
  // renders as a ring-shaped glow now, not a square one. First use of
  // outward+inset mixed together in one boxShadow string in this app
  // (inset alone already works, e.g. QuoteCard) - worth a quick on-device
  // look to confirm all 4 layers actually render, not just assumed safe.
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    boxShadow:
      '0px 0px 50px 12px rgba(139,124,246,0.16), 0px 0px 90px 26px rgba(255,198,241,0.07), inset 0px 0px 60px 22px rgba(139,124,246,0.18), inset 0px 0px 32px 8px rgba(255,198,241,0.12)',
  },
  glowSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  ringSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  value: {
    fontFamily: fontFamily.semiBold,
    fontSize: 64,
    lineHeight: 64 * 1.1,
    color: colors.textPrimary,
  },
  pct: {
    fontFamily: fontFamily.semiBold,
    fontSize: 36,
    lineHeight: 64 * 1.1,
    color: colors.textPrimary,
  },
  caption: {
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: colors.textPrimary,
  },
});
