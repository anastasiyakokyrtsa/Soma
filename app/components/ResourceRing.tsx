import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Resource Meter" (.resource-ring/.rr-*, style.css ~L843) -
// a single always-the-same violet/pink ring (no progress-arc logic, purely
// decorative), for WF's Home screen "42% Низкий ресурс" card. The kit's own
// ring color is a spinning conic-gradient (no RN equivalent) - approximated
// here as a static diagonal linear gradient across the ring's own stroke,
// the same technique already used for SleepWheelPicker's arc. The kit's
// 4-layer halo (outward + inward blur, box-shadow) is approximated as one
// soft outward glow, since RN's boxShadow here doesn't reliably support
// multiple comma-separated/inset shadows the way the kit's CSS does. Spin
// animation intentionally skipped - Figma's own static frame doesn't call
// for it, and it's a pure nice-to-have on top of an already-faithful ring.
export function ResourceRing({ value, caption, size = 244 }: { value: number; caption: string; size?: number }) {
  const stroke = 2;
  const r = size / 2 - stroke;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.glow}>
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
  glow: {
    boxShadow: '0px 0px 50px 12px rgba(139,124,246,0.16), 0px 0px 90px 26px rgba(255,198,241,0.07)',
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
