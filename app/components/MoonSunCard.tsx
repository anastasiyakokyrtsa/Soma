import { Image, View, Text, StyleSheet, type ImageSourcePropType } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, radius } from '../theme';

const CARD_W = 336;

// Ports UI Kit's "Moon and Sun Activity" card (.moonsun-card/-title/-img/
// -date/-phase/-rows/-row/-note, style.css ~L262-289) verbatim.
export function MoonSunCard({
  width = CARD_W,
  title,
  image,
  date,
  phase,
  rows,
  note,
}: {
  // 336 only holds exactly on the Figma reference width (412) - HomeScreen
  // derives a real per-device value so the 60px trailing gap she measured
  // in Figma survives on narrower phones instead of the card nearly
  // touching the screen edge (2026-08-20).
  width?: number;
  title: string;
  image: ImageSourcePropType;
  date: string;
  phase: string;
  rows: { label: string; value: string }[];
  note: string;
}) {
  // Every internal size below (font/line-height/gaps/image/padding) was
  // literal, tuned for a 336-wide card - once `width` started shrinking to
  // fit real (narrower-than-Figma's 412 reference) screens, the same fixed
  // numbers made the card look "вытянутые" (elongated): text wrapping into
  // more lines than the design intended, since font size stayed full-size
  // on a narrower box. Scaling everything by the same ratio the card itself
  // shrank by keeps the original proportions/wrap pattern instead (same
  // technique as BiorhythmChart/BottomBar's own `scale` factor) - only
  // shrinks below 1 (never grows past the original 336 design), and is
  // gentle in practice since real widths land close to 336 anyway.
  const scale = Math.min(width, CARD_W) / CARD_W;
  return (
    <View style={[styles.card, { width }]}>
      {/* real port of --card-fill (a translucent radial gradient over
          whatever sits behind the card, not an opaque fill - the flat
          colors.cardFillFallback stand-in this used before made the card
          read as a solid box with zero depth and blocked the stars behind
          it entirely, caught on-device 2026-08-20). r=70.7% (objectBoundingBox
          normalized corner distance, sqrt(0.5^2+0.5^2)) reproduces CSS
          "farthest-corner"; the 45% CSS stop becomes 0.45*70.7%=31.8% here.
          No fixed width/height here - the card's own height now hugs its
          content (Figma's "hug" setting, not a literal 487px), so this
          layer is sized purely by absoluteFillObject + percentage-based
          gradient/rect coordinates, matching whatever the real height
          resolves to after layout. */}
      <Svg style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="moonsunFill" cx="50%" cy="50%" r="70.7%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.318" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#moonsunFill)" />
      </Svg>
      <View style={styles.whiteWash} pointerEvents="none" />
      <View style={[styles.inner, { padding: 16 * scale }]}>
        <Text style={[styles.title, { fontSize: 22 * scale, lineHeight: 22 * 1.2 * scale, marginBottom: 16 * scale }]}>
          {title}
        </Text>
        <Image
          source={image}
          style={[styles.img, { width: 110 * scale, height: 110 * scale, marginBottom: 16 * scale }]}
          resizeMode="cover"
        />
        <Text style={[styles.date, { fontSize: 14 * scale, lineHeight: 14 * 1.5 * scale, marginBottom: 4 * scale }]}>
          {date}
        </Text>
        <Text style={[styles.phase, { fontSize: 16 * scale, lineHeight: 16 * 1.5 * scale, marginBottom: 16 * scale }]}>
          {phase}
        </Text>
        <View style={[styles.rows, { gap: 8 * scale, marginBottom: 16 * scale }]}>
          {rows.map((r) => (
            <View key={r.label} style={[styles.row, { gap: 28 * scale }]}>
              <Text
                style={[styles.rowLabel, { minWidth: 110 * scale, fontSize: 16 * scale, lineHeight: 16 * 1.5 * scale }]}
                numberOfLines={1}
              >
                {r.label}
              </Text>
              <Text style={[styles.rowValue, { fontSize: 16 * scale, lineHeight: 16 * 1.5 * scale }]}>{r.value}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.note, { fontSize: 16 * scale, lineHeight: 16 * 1.3 * scale }]}>{note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // unpadded, no fixed height - the radial-gradient background layer needs
  // to span the whole card face including under the padding, and the real
  // Figma frame hugs its content rather than a literal 487px (2026-08-20
  // correction). `padding` lives on `inner` instead of `card` itself so the
  // absolutely-positioned Svg's own top:0/left:0/right:0/bottom:0 anchors
  // to the true card corners, not to a padding-inset content box.
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  inner: {
    alignItems: 'center',
  },
  // second --card-fill layer (the CSS linear-gradient(rgba(255,255,255,.02)...)
  // flat wash sitting on top of the radial gradient) - too subtle for its own
  // gradient, just a uniform tint.
  whiteWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  // fontSize/lineHeight/margin/gap/minWidth below are all set inline
  // (scaled by `scale`, see the component body) - only the properties that
  // don't scale (color, fontFamily, alignment) stay in the StyleSheet.
  title: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  img: {
    borderRadius: radius.sm,
  },
  date: {
    fontFamily: fontFamily.light,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  phase: {
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  rows: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  // minWidth (not a fixed width): "Освещенность" is real, long enough that
  // a hard 110px wrapped it mid-word ("Освещенност/ь") on-device - letting
  // it grow past 110 for just that one label (numberOfLines={1} above keeps
  // it from ever wrapping again) beats forcing every label wider just to
  // fit the one outlier (2026-08-17 review).
  rowLabel: {
    flexShrink: 0,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  rowValue: {
    fontFamily: fontFamily.light,
    color: colors.textPrimary,
  },
  note: {
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
});
