import { Image, View, Text, StyleSheet, type ImageSourcePropType } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, radius } from '../theme';

const CARD_W = 336;
const CARD_H = 487;

// Ports UI Kit's "Moon and Sun Activity" card (.moonsun-card/-title/-img/
// -date/-phase/-rows/-row/-note, style.css ~L262-289) verbatim.
export function MoonSunCard({
  title,
  image,
  date,
  phase,
  rows,
  note,
}: {
  title: string;
  image: ImageSourcePropType;
  date: string;
  phase: string;
  rows: { label: string; value: string }[];
  note: string;
}) {
  return (
    <View style={styles.card}>
      {/* real port of --card-fill (a translucent radial gradient over
          whatever sits behind the card, not an opaque fill - the flat
          colors.cardFillFallback stand-in this used before made the card
          read as a solid box with zero depth and blocked the stars behind
          it entirely, caught on-device 2026-08-20). r=70.7% (objectBoundingBox
          normalized corner distance, sqrt(0.5^2+0.5^2)) reproduces CSS
          "farthest-corner"; the 45% CSS stop becomes 0.45*70.7%=31.8% here. */}
      <Svg width={CARD_W} height={CARD_H} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="moonsunFill" cx="50%" cy="50%" r="70.7%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.318" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={CARD_W} height={CARD_H} fill="url(#moonsunFill)" />
      </Svg>
      <View style={styles.whiteWash} pointerEvents="none" />
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        <Image source={image} style={styles.img} resizeMode="cover" />
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.phase}>{phase}</Text>
        <View style={styles.rows}>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={styles.rowLabel} numberOfLines={1}>
                {r.label}
              </Text>
              <Text style={styles.rowValue}>{r.value}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>{note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // unpadded - the radial-gradient background layer needs to span the whole
  // 336x487 face, including the area under the padding. `padding` moved to
  // `inner` instead of `card` itself (see 2026-08-20 comment above) so the
  // absolutely-positioned Svg's own top:0/left:0/right:0/bottom:0 anchors
  // to the true card corners, not to a padding-inset content box.
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  // second --card-fill layer (the CSS linear-gradient(rgba(255,255,255,.02)...)
  // flat wash sitting on top of the radial gradient) - too subtle for its own
  // gradient, just a uniform tint.
  whiteWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  title: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 22 * 1.2,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  img: {
    width: 110,
    height: 110,
    borderRadius: radius.sm,
    marginBottom: 16,
  },
  date: {
    fontFamily: fontFamily.light,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  phase: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  rows: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 28,
  },
  // minWidth (not a fixed width): "Освещенность" is real, long enough that
  // a hard 110px wrapped it mid-word ("Освещенност/ь") on-device - letting
  // it grow past 110 for just that one label (numberOfLines={1} above keeps
  // it from ever wrapping again) beats forcing every label wider just to
  // fit the one outlier (2026-08-17 review).
  rowLabel: {
    minWidth: 110,
    flexShrink: 0,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
  },
  rowValue: {
    fontFamily: fontFamily.light,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
  },
  note: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.3,
    color: colors.textPrimary,
  },
});
