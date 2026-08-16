import { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, type GestureResponderEvent } from 'react-native';
import Svg, {
  Circle as SvgCircle,
  Path,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
} from 'react-native-svg';
import { colors, fontFamily, gradients } from '../theme';

// WF18 "Какой у тебя обычно график сна?" — 1:1 from Figma node 402:2915
// ("Sleep tracker", get_design_context + the real exported ring asset,
// 2026-08-16 review). Real spec, not the earlier approximation: the ring is
// a pink->violet gradient arc (same 3 stops as gradients.headingText) with a
// soft glow underneath, over a plain violet400-at-27%-opacity track - no
// separate handle knobs, the arc's own rounded stroke caps are the only
// "handle" affordance. Hour marks (12/3/6/9 as numbers, the other 8 as small
// radial tick dashes) sit close against the ring's own inner edge, not
// floating in the middle of the open space. Center shows the same
// gradient-text treatment as the Personalization done-state title.
//
// Gesture-driven via plain RN PanResponder (no new dependency) rather than
// Reanimated's gesture APIs, since the drag math here is simple
// angle-from-touch-point arithmetic that doesn't need worklet-level
// performance.
//
// 2026-08-16 review: she sent her own Figma panel screenshots with the exact
// numbers used to build this - real values now, not approximated. On a
// 300x300 reference frame: ring radius 150 with an *inside*-aligned 32px
// stroke (so the visible ring spans r=118..150 - centered-stroke equivalent
// r=134, which is exactly what get_design_context's exported SVG asset
// confirmed earlier), gradient stops 0/50/100% (already matched), track
// color 8B7CF6 @ 27% (already matched), and critically the glow is a real
// Gaussian blur (Figma "Layer blur", value 20) on a duplicate layer, not the
// layered-opacity-strokes approximation this used before - react-native-svg
// does support <Filter>/<FeGaussianBlur>, no reason not to use the real
// technique now that fidelity to an exact number matters.
//
// OUTER_RATIO controls how much of the component's own `size` the ring's
// outer edge fills (0.9 = 90%, leaving 5% margin each side) - some margin is
// needed so the blur has room to bleed without the SVG viewport clipping it,
// but not as much as Figma's own layer canvas gets implicitly (that 300-box
// export came out at 329x340, i.e. ~9-13% margin, which is what 0.9 here
// approximates). Stroke/blur are then both real ratios *of the outer
// radius* (32/150 and 20/150 - her exact Figma numbers), not of `size`
// directly, so they scale correctly as the ring itself scales.
//
// `size` is a prop, not a fixed constant (bumped to look bigger, which meant
// it could overflow a narrow phone's width if left fixed) - the screen
// computes a responsive value the same way the astrolabe illustration does,
// this component just derives all its internal geometry off whatever it's given.
const OUTER_RATIO = 0.9;
const STROKE_OF_OUTER = 32 / 150;
const BLUR_OF_OUTER = 20 / 150;
// One full turn = 12 hours (720min), matching a normal clock face where
// consecutive number marks are consecutive hours - this was 1440 (24h)
// before, which meant each 30deg step between marks silently represented 2
// real hours, not 1 (2026-08-16: "начало на 12, конец на 8 утра, должно
// получиться 8 часов" - under the 24h version that same drag computed 16h).
// A single 12h loop is plenty of range for any realistic sleep duration.
const LOOP_MIN = 720;
// Snap step = 30min - lands on either a mark (number/tick) or exactly
// halfway between two marks, no visual dash drawn for the half-positions
// (2026-08-16: "чтобы и на половинных можно было останавливаться, но
// палочек там не надо") - was a full 60min/one-mark-only step.
const SNAP_MIN = 30;
function minutesToAngle(min: number) {
  // 0 = 12 o'clock (top); clockwise from there.
  return (min / LOOP_MIN) * 360 - 90;
}
function angleToMinutes(deg: number) {
  const norm = (((deg + 90) % 360) + 360) % 360;
  return Math.round(((norm / 360) * LOOP_MIN) / SNAP_MIN) * SNAP_MIN;
}
function circularDist(a: number, b: number) {
  const d = Math.abs(a - b) % LOOP_MIN;
  return Math.min(d, LOOP_MIN - d);
}
function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} ч` : `${h} ч ${m} мин`;
}

// 12 evenly-spaced hour marks (every 30deg) - the 4 at 12/3/6/9 get a
// number label, the other 8 get a short radial tick dash (matches the real
// frame's Group 70: labelled marks at 0/90/180/270deg, plain D9D9D9 dashes
// at 30/60/120/150/...).
// -90 so k=0 lands at 12 o'clock (top), matching minutesToAngle's own
// convention below - without it these were computed in raw math-angle terms
// (0deg = 3 o'clock/right), rotating every mark a quarter-turn off (2026-08-16:
// "на 12 часов стоит 9" - exactly the k=9 mark, which raw-angle math put at
// the top instead of k=0).
const HOUR_MARKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => ({
  angle: k * 30 - 90,
  label: k % 3 === 0 ? [12, 3, 6, 9][k / 3] : null,
}));

export function SleepWheelPicker({
  bedtimeMin,
  waketimeMin,
  onChange,
  size = 340,
}: {
  bedtimeMin: number;
  waketimeMin: number;
  onChange: (bedtimeMin: number, waketimeMin: number) => void;
  size?: number;
}) {
  const center = size / 2;
  const outerRadius = (size * OUTER_RATIO) / 2;
  const stroke = outerRadius * STROKE_OF_OUTER;
  const blur = outerRadius * BLUR_OF_OUTER;
  const r = outerRadius - stroke / 2;
  const ringInner = r - stroke / 2;
  const tickLen = size * 0.024;
  // 8px everywhere - the same literal gap for both the tick dashes and the
  // numbers, not two different formulas landing at two different visual
  // distances (2026-08-16: "расстояние... должно быть одинаковое").
  const GAP = 8;
  const tickR = ringInner - GAP - tickLen / 2;
  // Number glyph metrics for fontSize 14, used below to place each label's
  // *edge* (not its center/baseline) exactly GAP px from the ring - a
  // generic "radius from center" placement doesn't give an exact edge gap
  // once the glyph's own box is accounted for.
  const NUM_FONT_SIZE = 14;
  const NUM_ASCENT = NUM_FONT_SIZE * 0.73;
  const NUM_DESCENT = NUM_FONT_SIZE * 0.2;

  const polar = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
  };
  const arcPath = (startMin: number, endMin: number, radius: number) => {
    const a0 = minutesToAngle(startMin);
    let a1 = minutesToAngle(endMin);
    if (a1 <= a0) a1 += 360;
    const p0 = polar(a0, radius);
    const p1 = polar(a1, radius);
    const largeArc = a1 - a0 > 180 ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p1.x} ${p1.y}`;
  };

  const dragging = useRef<'bed' | 'wake' | null>(null);
  // Refs mirror the latest props so the PanResponder's stable callbacks
  // (memoized once) always read current values instead of a stale closure.
  const bedRef = useRef(bedtimeMin);
  const wakeRef = useRef(waketimeMin);
  bedRef.current = bedtimeMin;
  wakeRef.current = waketimeMin;

  const handleTouch = (evt: GestureResponderEvent, isStart: boolean) => {
    const { locationX, locationY } = evt.nativeEvent;
    const angle = (Math.atan2(locationY - center, locationX - center) * 180) / Math.PI;
    const touchMin = angleToMinutes(angle);
    if (isStart) {
      const db = circularDist(touchMin, bedRef.current);
      const dw = circularDist(touchMin, wakeRef.current);
      dragging.current = db <= dw ? 'bed' : 'wake';
    }
    if (dragging.current === 'bed') onChange(touchMin, wakeRef.current);
    else if (dragging.current === 'wake') onChange(bedRef.current, touchMin);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => handleTouch(evt, true),
        onPanResponderMove: (evt) => handleTouch(evt, false),
        onPanResponderRelease: () => {
          dragging.current = null;
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size]
  );

  const duration = ((waketimeMin - bedtimeMin + LOOP_MIN) % LOOP_MIN) || LOOP_MIN;
  const d = arcPath(bedtimeMin, waketimeMin, r);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="sleepArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset={0} stopColor={gradients.headingText.colors[0]} />
            <Stop offset={0.5} stopColor={gradients.headingText.colors[1]} />
            <Stop offset={1} stopColor={gradients.headingText.colors[2]} />
          </SvgLinearGradient>
          {/* Real Gaussian blur (Figma "Layer blur", value 20 on a 300 frame)
              on a duplicate of the arc underneath the crisp one, not a
              layered-opacity approximation. x/y/width/height widened past
              the default filter region so the blur isn't clipped at its own
              bounding box edge. */}
          <Filter id="sleepGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation={blur} />
          </Filter>
        </Defs>

        <SvgCircle cx={center} cy={center} r={r} stroke="rgba(139,124,246,0.27)" strokeWidth={stroke} fill="none" />

        <Path d={d} stroke="url(#sleepArcGrad)" strokeWidth={stroke} strokeLinecap="round" fill="none" filter="url(#sleepGlow)" />
        <Path d={d} stroke="url(#sleepArcGrad)" strokeWidth={stroke} strokeLinecap="round" fill="none" />

        {HOUR_MARKS.filter((m) => m.label === null).map(({ angle }, i) => {
          const p0 = polar(angle, tickR - tickLen / 2);
          const p1 = polar(angle, tickR + tickLen / 2);
          return <Line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#D9D9D9" strokeWidth={2} />;
        })}

        {/* The 4 numbers are placed explicitly per side (not via the generic
            polar-radius loop above) so each one's actual glyph *edge* -
            not its center - lands exactly GAP px from the ring, the same
            gap the tick dashes use. */}
        <SvgText x={center} y={center - ringInner + GAP + NUM_ASCENT} fontSize={NUM_FONT_SIZE} fontFamily={fontFamily.semiBold} fill={colors.textPrimary} textAnchor="middle">
          12
        </SvgText>
        <SvgText x={center + ringInner - GAP} y={center + NUM_ASCENT / 2} fontSize={NUM_FONT_SIZE} fontFamily={fontFamily.semiBold} fill={colors.textPrimary} textAnchor="end">
          3
        </SvgText>
        <SvgText x={center} y={center + ringInner - GAP - NUM_DESCENT} fontSize={NUM_FONT_SIZE} fontFamily={fontFamily.semiBold} fill={colors.textPrimary} textAnchor="middle">
          6
        </SvgText>
        <SvgText x={center - ringInner + GAP} y={center + NUM_ASCENT / 2} fontSize={NUM_FONT_SIZE} fontFamily={fontFamily.semiBold} fill={colors.textPrimary} textAnchor="start">
          9
        </SvgText>
      </Svg>

      <View style={[styles.centerText, { top: center - 40 }]} pointerEvents="none">
        <Svg width={size * 0.7} height={36}>
          <Defs>
            <SvgLinearGradient id="sleepDurationGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
              <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
              <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
            </SvgLinearGradient>
          </Defs>
          <SvgText
            x="50%"
            y="27"
            fontSize={26}
            fontFamily={fontFamily.semiBold}
            textAnchor="middle"
            fill="url(#sleepDurationGrad)"
          >
            {formatDuration(duration)}
          </SvgText>
        </Svg>
        <Text style={styles.durationLabel}>Длительность{'\n'}сна</Text>
      </View>

      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  centerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  durationLabel: {
    marginTop: 2,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
