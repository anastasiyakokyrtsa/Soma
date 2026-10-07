import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Resource Meter" (.resource-ring/.rr-*, style.css ~L843) for
// WF's Home screen "42% Низкий ресурс" card.
//
// 2026-10-01, real progress arc: the ring used to always draw as a full
// circle regardless of `value` - a spinning gradient outline, purely
// decorative, with no actual connection between the number in the middle and
// how much of the ring was "filled" (her catch: "несмотря на то что ресурс
// низкий, прогресс бар этого не отражает"). Demoed two directions in a
// standalone web artifact first (per her ask, before touching app code) - a
// real dasharray/dashoffset arc sized to `value` (same technique as
// BiorhythmChart's own rings) vs. a procedural "energy orb" - she picked the
// arc. The continuous spin animation this used to have doesn't survive the
// change: a gradient spinning around a *partial* arc would constantly move
// the arc's own start/end points, undermining the one thing this is now for
// (reading the arc's length as the actual value) - dropped rather than kept
// alongside, not an oversight.
const RING_STROKE = 2;
// Same round-cap-bulge floor as BiorhythmChart's rings (MIN_VISIBLE_GAP) -
// a strokeLinecap="round" cap bulges roughly half the stroke width past the
// path's own end, which can fully close a very-near-100% gap or fully hide a
// very-near-0% sliver. Floors the visible arc so it's never literally
// invisible at low real values, without faking a value that isn't 0 at
// genuine 0 (floor only kicks in strictly above it).
const MIN_VISIBLE_ARC_PCT = 1.5;

export function ResourceRing({ value, caption, size = 244 }: { value: number; caption: string; size?: number }) {
  const r = size / 2 - RING_STROKE;
  const circumference = 2 * Math.PI * r;
  const pct = value <= 0 ? 0 : Math.max(value, MIN_VISIBLE_ARC_PCT);
  const dashoffset = circumference * (1 - pct / 100);

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
      {/* Rotated -90deg so the arc starts at 12 o'clock and sweeps clockwise
          as `value` grows - the same convention BiorhythmChart's rings and
          MoodScale's thumb-coordinate system already use everywhere else in
          this app, not a new one invented here. */}
      <Svg width={size} height={size} style={[styles.ringSvg, { transform: [{ rotate: '-90deg' }] }]}>
        <Defs>
          <LinearGradient id="rrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset={0} stopColor={colors.violet400} />
            <Stop offset={0.47} stopColor="#FFC6F1" />
            <Stop offset={0.5} stopColor="#FFE3F6" />
            <Stop offset={0.53} stopColor="#FFC6F1" />
            <Stop offset={1} stopColor={colors.violet400} />
          </LinearGradient>
        </Defs>
        {/* Faint full-circle track behind the arc, same recipe/opacity as
            BiorhythmChart's own ring track - without it, a low value's short
            arc would read as floating on nothing. */}
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(139,124,246,0.14)" strokeWidth={RING_STROKE} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#rrGrad)"
          strokeWidth={RING_STROKE + 0.5}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashoffset}
        />
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
