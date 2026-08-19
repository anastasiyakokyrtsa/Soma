import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Line, Path, Circle, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Biorhythm Chart" (.biorhythm/.biorhythm-axis/.biorhythm-chart/
// .biorhythm-rings, style.css ~L811-833) - curve paths are the kit's own
// already-tuned demo data, not re-derived from the Figma screenshot, per her
// explicit "bere iz kita" instruction (2026-08-17). Ring size/glow/cap style
// and the value scale below are her own explicit 2026-08-19 deviations from
// the kit's literal numbers - not kit fidelity issues, real creative calls.
//
// `width` is a real responsive prop (same pattern as SleepWheelPicker's
// `size`/the astrolabe's sizing), default 380 only as a cap. Curve/gridline
// coordinates are untouched (still authored in their original 360x200
// space) - scaling is done for free by setting each inner <Svg>'s rendered
// width/height to `space * scale` while keeping its `viewBox` at the
// original space, not by rewriting any point math. Axis labels are plain RN
// Text (not SVG), so those genuinely need their position/size scaled by hand.
//
// Axis days are tappable (selectedDay/onSelectDay). The 3 curves' raw y
// values at each marked day were read directly off each curve's own path
// data (every marked day 10-18 lands exactly on a real bezier anchor point
// at x=(day-10)*45 - no sampling/curve-fitting needed).
const DAYS = [10, 11, 12, 13, 14, 15, 16, 17, 18] as const;
const FIRST_DAY = DAYS[0];
const LAST_DAY = DAYS[DAYS.length - 1];
const DAY_TO_X = (day: number) => (day - 10) * 45;

type CurveYs = { physical: number; emotional: number; intellect: number };
// Raw SVG y (0-200, top-to-bottom) at each marked day, read off the curve
// paths below - green=physical, pink=emotional, violet=intellect.
const DAY_Y: Record<number, CurveYs> = {
  10: { physical: 150.2, emotional: 77.9, intellect: 162.8 },
  11: { physical: 106.0, emotional: 114.6, intellect: 183.7 },
  12: { physical: 60.5, emotional: 149.4, intellect: 196.5 },
  13: { physical: 23.4, emotional: 177.5, intellect: 199.9 },
  14: { physical: 2.7, emotional: 195.1, intellect: 193.6 },
  15: { physical: 2.7, emotional: 199.8, intellect: 178.2 },
  16: { physical: 23.4, emotional: 191.1, intellect: 155.3 },
  17: { physical: 60.5, emotional: 170.0, intellect: 126.9 },
  18: { physical: 106.0, emotional: 139.5, intellect: 96.0 },
};

// Her scale, simplified same-day (2026-08-19): no negative numbers at all -
// bottom (y=200) = 0, middle (y=100) = 50, top (y=0) = 100. A plain single
// linear map, not the asymmetric two-segment one this used for about an
// hour ("уберу минусы... получается от 0 до 100 просто").
function yToPct(y: number): number {
  return 100 - y / 2;
}

export function getDayValues(day: number): CurveYs {
  const y = DAY_Y[day] ?? DAY_Y[14];
  return { physical: yToPct(y.physical), emotional: yToPct(y.emotional), intellect: yToPct(y.intellect) };
}

function formatPct(v: number) {
  return `${v.toFixed(1).replace('.', ',')}%`;
}

const CURVES = [
  {
    id: 'green',
    color: '#5BC4A0',
    d: 'M0.0,150.2 C3.8,146.6 15.0,136.2 22.5,128.8 C30.0,121.4 37.5,113.7 45.0,106.0 C52.5,98.3 60.0,90.4 67.5,82.8 C75.0,75.2 82.5,67.6 90.0,60.5 C97.5,53.4 105.0,46.5 112.5,40.3 C120.0,34.1 127.5,28.3 135.0,23.4 C142.5,18.5 150.0,14.1 157.5,10.7 C165.0,7.2 172.5,4.5 180.0,2.7 C187.5,0.9 195.0,0.0 202.5,0.0 C210.0,0.0 217.5,0.9 225.0,2.7 C232.5,4.5 240.0,7.2 247.5,10.7 C255.0,14.1 262.5,18.5 270.0,23.4 C277.5,28.3 285.0,34.1 292.5,40.3 C300.0,46.5 307.5,53.4 315.0,60.5 C322.5,67.6 330.0,75.2 337.5,82.8 C345.0,90.4 356.2,102.1 360.0,106.0',
  },
  {
    id: 'pink',
    color: '#FFC6F1',
    d: 'M0.0,77.9 C3.8,81.0 15.0,90.1 22.5,96.2 C30.0,102.3 37.5,108.5 45.0,114.6 C52.5,120.7 60.0,126.8 67.5,132.6 C75.0,138.4 82.5,144.1 90.0,149.4 C97.5,154.7 105.0,159.9 112.5,164.6 C120.0,169.3 127.5,173.6 135.0,177.5 C142.5,181.4 150.0,184.9 157.5,187.8 C165.0,190.7 172.5,193.2 180.0,195.1 C187.5,197.0 195.0,198.4 202.5,199.2 C210.0,200.0 217.5,200.2 225.0,199.8 C232.5,199.5 240.0,198.6 247.5,197.1 C255.0,195.6 262.5,193.6 270.0,191.1 C277.5,188.6 285.0,185.5 292.5,182.0 C300.0,178.5 307.5,174.4 315.0,170.0 C322.5,165.6 330.0,160.8 337.5,155.7 C345.0,150.6 356.2,142.2 360.0,139.5',
  },
  {
    id: 'violet',
    color: '#8B7CF6',
    d: 'M0.0,162.8 C3.8,164.7 15.0,170.7 22.5,174.2 C30.0,177.7 37.5,180.9 45.0,183.7 C52.5,186.5 60.0,189.1 67.5,191.2 C75.0,193.3 82.5,195.1 90.0,196.5 C97.5,197.9 105.0,198.8 112.5,199.4 C120.0,200.0 127.5,200.2 135.0,199.9 C142.5,199.7 150.0,199.0 157.5,197.9 C165.0,196.8 172.5,195.4 180.0,193.6 C187.5,191.8 195.0,189.6 202.5,187.0 C210.0,184.4 217.5,181.4 225.0,178.2 C232.5,175.0 240.0,171.4 247.5,167.6 C255.0,163.8 262.5,159.6 270.0,155.3 C277.5,151.0 285.0,146.3 292.5,141.6 C300.0,136.9 307.5,131.9 315.0,126.9 C322.5,121.9 330.0,116.8 337.5,111.6 C345.0,106.4 356.2,98.6 360.0,96.0',
  },
];

// dashoffset = circumference * (100 - pct) / 100 - ring reads empty at
// pct=0, full at pct=100, now that pct itself is a plain 0-100 value (no
// more folding a signed -100..100 range through Math.abs).
const RING_R = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const RING_DASHARRAY: [number, number] = [RING_CIRCUMFERENCE, RING_CIRCUMFERENCE];
const dashoffsetForPct = (pct: number) => (RING_CIRCUMFERENCE * (100 - pct)) / 100;

const RING_META = [
  { id: 'physical' as const, colors: ['#7DE8C4', '#5DC2A3', '#4BA78D'], glow: '#5DC2A3', label: 'Физика' },
  { id: 'emotional' as const, colors: ['#FFCBF2', '#FFC6F1', '#FBBDEC'], glow: '#FFC6F1', label: 'Эмоции' },
  { id: 'intellect' as const, colors: ['#B6ABFF', colors.violet400, '#7060E8'], glow: colors.violet400, label: 'Интеллект' },
];
// 100, not the kit's literal 84 - her explicit ask to size these up past
// the kit's own reference (2026-08-19, "прогресс бары... сделать побольше").
const RING_BOX = 100;

export function BiorhythmChart({
  width = 380,
  selectedDay,
  onSelectDay,
}: {
  width?: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
}) {
  const scale = Math.min(width, 380) / 380;
  const chartW = 360 * scale;
  const chartH = 200 * scale;
  const chartInset = 10 * scale; // kit's own 10px inset (380-360)/2, applied explicitly instead of via alignSelf so it can't drift out of sync with the axis labels' own math
  const ringBoxSize = RING_BOX * scale;
  const values = getDayValues(selectedDay);
  const selectedX = DAY_TO_X(selectedDay);

  return (
    <View style={[styles.wrap, { width: width }]}>
      <View style={[styles.axis, { width }]}>
        {DAYS.map((day) => {
          const isSelected = day === selectedDay;
          const fontSize = (isSelected ? 20 : 16) * scale;
          const lineHeight = fontSize * 1.1;
          const boxWidth = (isSelected ? 36 : 28) * scale;
          // The two ends are edge-anchored to the axis row's own edges (=16px
          // from the screen wall, via HomeScreen's own side margin) instead
          // of centered on their gridline - centering AND a fixed 16px wall
          // clearance can't both hold at once once the label grows on
          // selection, and the 16px clearance was her explicit, more recent
          // ask (2026-08-19) for these two specifically. Days 11-17 stay
          // centered on their real gridline.
          const posStyle =
            day === FIRST_DAY
              ? { left: 0 }
              : day === LAST_DAY
                ? { right: 0 }
                : { left: (10 + DAY_TO_X(day)) * scale, marginLeft: -boxWidth / 2 };
          return (
            <Pressable
              key={day}
              onPress={() => onSelectDay(day)}
              hitSlop={8}
              style={[{ position: 'absolute', top: '50%', marginTop: -lineHeight / 2, width: boxWidth }, posStyle]}
            >
              <Text style={[styles.axisLabel, isSelected && styles.axisLabelSelected, { fontSize, lineHeight }]}>{day}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* viewBox padded 4 units above/below the real 0-200 content range -
          the green curve's peak touches y=0 exactly, and a 2px stroke +
          glow blur bleeding past that edge got clipped by the SVG's own
          canvas (overflow:visible on the <Svg> style doesn't prevent this on
          every platform the way it does on web) - real fix is giving the
          content actual room inside the viewBox, not just declaring
          overflow visible (2026-08-17: "горки... немного срезаются"). */}
      <Svg width={chartW} height={chartH} viewBox="0 -4 360 208" style={[styles.chart, { marginLeft: chartInset }]}>
        <Defs>
          {CURVES.map((c) => (
            <Filter key={c.id} id={`curveGlow-${c.id}`} x="-50%" y="-50%" width="200%" height="200%">
              {/* stdDeviation bumped 3 -> 6 (2026-08-19: "прибавим свечения у линий") */}
              <FeGaussianBlur stdDeviation={6} />
            </Filter>
          ))}
        </Defs>
        <Gridlines selectedX={selectedX} />
        {/* real glow (Gaussian blur on a duplicate underneath, same technique
            as SleepWheelPicker's arc) - CSS drop-shadow isn't a valid RN
            style prop, unlike the web reference's filter:drop-shadow(). */}
        {CURVES.map((c) => (
          <Path key={`${c.id}-glow`} d={c.d} fill="none" stroke={c.color} strokeWidth={2} filter={`url(#curveGlow-${c.id})`} />
        ))}
        {CURVES.map((c) => (
          <Path key={c.id} d={c.d} fill="none" stroke={c.color} strokeWidth={2} />
        ))}
      </Svg>

      <View style={[styles.rings, { width: chartW, marginLeft: chartInset, marginTop: 40 * scale }]}>
        {RING_META.map((r) => {
          const pct = values[r.id];
          const dashoffset = dashoffsetForPct(pct);
          return (
            <View key={r.id} style={styles.ringItem}>
              <View style={[styles.ringBox, { width: ringBoxSize, height: ringBoxSize }]}>
                <Svg width={ringBoxSize} height={ringBoxSize} viewBox="0 0 84 84" style={styles.ringSvg}>
                  <Defs>
                    <Filter id={`ringGlow-${r.id}`} x="-50%" y="-50%" width="200%" height="200%">
                      {/* stdDeviation bumped 2.5 -> 4 (2026-08-19: same glow ask, applied to the rings too) */}
                      <FeGaussianBlur stdDeviation={4} />
                    </Filter>
                  </Defs>
                  {/* faint full-circle track behind the arc, so the ring
                      doesn't read as floating with nothing under it
                      (2026-08-19: "чтобы если они не совсем в воздухе
                      висели"). Started as violet400@27%, same as
                      SleepWheelPicker's own track - then made about half as
                      opaque again on request ("прозрачность повысим... на
                      половину"), landing at 14%, roughly half of 27%. */}
                  <Circle cx={42} cy={42} r={RING_R} fill="none" stroke="rgba(139,124,246,0.14)" strokeWidth={8} />
                  {/* strokeLinecap="round" on both - was "butt" (a deliberate
                      earlier kit decision to keep a near-full ring's tiny gap
                      legible), explicitly overridden here per her ask for
                      soft rounded arc ends (2026-08-19: "конечики... красивые
                      закругленные а не такие острые"). */}
                  <Circle
                    cx={42}
                    cy={42}
                    r={RING_R}
                    fill="none"
                    stroke={r.glow}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={RING_DASHARRAY}
                    strokeDashoffset={dashoffset}
                    filter={`url(#ringGlow-${r.id})`}
                  />
                  <Circle
                    cx={42}
                    cy={42}
                    r={RING_R}
                    fill="none"
                    stroke={r.colors[1]}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={RING_DASHARRAY}
                    strokeDashoffset={dashoffset}
                  />
                </Svg>
                <Text style={[styles.ringPct, { fontSize: 16 * scale }]}>{formatPct(pct)}</Text>
              </View>
              <Text style={[styles.ringLabel, { fontSize: 16 * scale, marginTop: 8 * scale }]}>{r.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const GRIDLINE_XS = [0, 45, 90, 135, 180, 225, 270, 315, 360];

function Gridlines({ selectedX }: { selectedX: number }) {
  return (
    <>
      {GRIDLINE_XS.map((x) => (
        <Line key={x} x1={x} y1={0} x2={x} y2={200} stroke="#B7B7B7" strokeOpacity={0.35} strokeWidth={x === selectedX ? 0.9 : 0.3} />
      ))}
      <Line x1={0} y1={100} x2={360} y2={100} stroke="#B7B7B7" strokeOpacity={0.35} strokeWidth={0.9} />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  axis: {
    height: 30,
    marginBottom: 2,
  },
  axisLabel: {
    textAlign: 'center',
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
  },
  axisLabelSelected: {
    fontFamily: fontFamily.bold,
    color: colors.violet400,
  },
  chart: {
    overflow: 'visible',
  },
  rings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ringItem: {
    alignItems: 'center',
  },
  ringBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  ringPct: {
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  ringLabel: {
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
});
