import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Resource Meter" (.resource-ring/.rr-*, style.css ~L843) -
// a single always-the-same violet/pink ring (no progress-arc logic, purely
// decorative), for WF's Home screen "42% Низкий ресурс" card. The kit's own
// ring color is a spinning conic-gradient (no RN equivalent) - approximated
// here as a static diagonal linear gradient across the ring's own stroke,
// the same technique already used for SleepWheelPicker's arc. Spin
// animation intentionally skipped - Figma's own static frame doesn't call
// for it, and it's a pure nice-to-have on top of an already-faithful ring.
//
// 2026-08-20: an animated (rotating gradient) + color-matched rotating glow
// version of this was built and then explicitly reverted the same day
// ("верни прогресс бар таким какой он был до того как я попросила свечение
// сделать другим и заанимировать") - back to this static version. Don't
// re-add the spin/glow-rotation without her asking again.
export function ResourceRing({ value, caption, size = 244 }: { value: number; caption: string; size?: number }) {
  const stroke = 2;
  const r = size / 2 - stroke;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* kit's `.rr-halo` is a plain circular div (border-radius:50%) with
          a 4-layer box-shadow (2 outward + 2 inset) - CSS box-shadow
          follows an element's own border-radius, so a *circular* View with
          borderRadius set here renders this correctly, unlike the SVG/View
          without any radius this used before (a boxShadow on an unrounded
          box/Svg always shadows its literal rectangular bounds, which is
          what made it look like a square glow behind the ring - caught
          2026-08-20, "свечение похоже вокруг квадрата сделал, а не по
          кругу"). Full 4-layer recipe ported now too (previously only the
          2 outward layers were here, the 2 inset ones were missing
          entirely). */}
      <View style={[styles.halo, { width: size, height: size, borderRadius: size / 2 }]} />
      <Svg width={size} height={size} style={styles.ringSvg}>
        <Defs>
          <LinearGradient id="rrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset={0} stopColor={colors.violet400} />
            <Stop offset={0.47} stopColor="#FFC6F1" />
            <Stop offset={0.5} stopColor="#FFE3F6" />
            <Stop offset={0.53} stopColor="#FFC6F1" />
            <Stop offset={1} stopColor={colors.violet400} />
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
