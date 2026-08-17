import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Path, Circle, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Ports UI Kit's "Biorhythm Chart" (.biorhythm/.biorhythm-axis/.biorhythm-chart/
// .biorhythm-rings, style.css ~L811-833) verbatim - curve paths, ring
// dasharray/dashoffset and the 3 placeholder values (97,3% / -95,1% / -93,6%)
// are the kit's own already-tuned demo data, not re-derived from the Figma
// screenshot, per her explicit "bere iz kita" instruction (2026-08-17).
const AXIS = [
  { label: '10', left: 10 },
  { label: '11', left: 55 },
  { label: '12', left: 100 },
  { label: '13', left: 145 },
  { label: '14', left: 190, isToday: true },
  { label: '15', left: 235 },
  { label: '16', left: 280 },
  { label: '17', left: 325 },
  { label: '18', left: 370 },
];

const GRIDLINES = [0, 45, 90, 135, 180, 225, 270, 315, 360];

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

const RING_CIRCUMFERENCE = 213.63;
const RINGS = [
  { id: 'physical', colors: ['#7DE8C4', '#5DC2A3', '#4BA78D'], glow: '#5DC2A3', dashoffset: 5.77, pct: '97,3%', label: 'Физика' },
  { id: 'emotional', colors: ['#FFCBF2', '#FFC6F1', '#FBBDEC'], glow: '#FFC6F1', dashoffset: 10.47, pct: '-95,1%', label: 'Эмоции' },
  { id: 'intellect', colors: ['#B6ABFF', colors.violet400, '#7060E8'], glow: colors.violet400, dashoffset: 13.66, pct: '-93,6%', label: 'Интеллект' },
];

export function BiorhythmChart() {
  return (
    <View style={styles.wrap}>
      <View style={styles.axis}>
        {AXIS.map((a) => (
          <Text key={a.label} style={[styles.axisLabel, a.isToday && styles.axisLabelToday, { left: a.left }]}>
            {a.label}
          </Text>
        ))}
      </View>

      <Svg width={360} height={200} style={styles.chart}>
        <Defs>
          {CURVES.map((c) => (
            <Filter key={c.id} id={`curveGlow-${c.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation={3} />
            </Filter>
          ))}
        </Defs>
        {GRIDLINES.map((x) => (
          <Line key={x} x1={x} y1={0} x2={x} y2={200} stroke="#B7B7B7" strokeOpacity={0.35} strokeWidth={x === 180 ? 0.9 : 0.3} />
        ))}
        <Line x1={0} y1={100} x2={360} y2={100} stroke="#B7B7B7" strokeOpacity={0.35} strokeWidth={0.9} />
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

      <View style={styles.rings}>
        {RINGS.map((r) => (
          <View key={r.label} style={styles.ringItem}>
            <View style={styles.ringBox}>
              <Svg width={84} height={84} viewBox="0 0 84 84" style={styles.ringSvg}>
                <Defs>
                  <Filter id={`ringGlow-${r.id}`} x="-50%" y="-50%" width="200%" height="200%">
                    <FeGaussianBlur stdDeviation={2.5} />
                  </Filter>
                </Defs>
                <Circle
                  cx={42}
                  cy={42}
                  r={34}
                  fill="none"
                  stroke={r.glow}
                  strokeWidth={8}
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={r.dashoffset}
                  filter={`url(#ringGlow-${r.id})`}
                />
                <Circle
                  cx={42}
                  cy={42}
                  r={34}
                  fill="none"
                  stroke={r.colors[1]}
                  strokeWidth={8}
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={r.dashoffset}
                />
              </Svg>
              <Text style={styles.ringPct}>{r.pct}</Text>
            </View>
            <Text style={styles.ringLabel}>{r.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 380,
  },
  axis: {
    width: 380,
    height: 30,
    marginBottom: 2,
  },
  axisLabel: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    marginLeft: -14,
    width: 28,
    textAlign: 'center',
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  axisLabelToday: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.violet400,
    marginLeft: -18,
    width: 36,
  },
  chart: {
    alignSelf: 'center',
    overflow: 'visible',
  },
  rings: {
    width: 332,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 40,
    marginTop: 40,
  },
  ringItem: {
    alignItems: 'center',
  },
  ringBox: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  ringPct: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  ringLabel: {
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
