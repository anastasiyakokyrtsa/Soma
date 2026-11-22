import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Svg, { Line, Path, Circle, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors, fontFamily } from '../theme';
import { useLanguage, type Language } from '../i18n/LanguageContext';
import { addDays, daysSinceBirthOn, getBiorhythmValues, getBiorhythmValuesAtDayOffset, type BirthDate, type BiorhythmValues } from '../lib/biorhythm';

// Ports UI Kit's "Biorhythm Chart" (.biorhythm/.biorhythm-axis/.biorhythm-chart/
// .biorhythm-rings, style.css ~L811-833) - ring size/glow/cap style and the
// 0-100 value scale are her own explicit 2026-08-19 deviations from the
// kit's literal numbers.
//
// 2026-11-22 (brief 001, real-data reactivity): this used to plot the kit's
// own hand-authored 9-day demo curve (bezier paths for calendar days
// "10-18", a coincidence of whatever month the kit was built in) against a
// fixed table of invented values. That's gone - the axis is now a real
// 9-day window of *today's* actual calendar days (today-4..today+4, offsets
// -4..4), and the 3 curves are sampled directly from lib/biorhythm.ts's own
// formula instead of approximated by hand-tuned bezier anchors. This was a
// smaller rewrite than it sounds: the model IS a sum of sines, so a smooth
// curve between two calendar days doesn't need curve-fitting, just
// evaluating the same formula at fine-grained fractional offsets
// (getBiorhythmValuesAtDayOffset) and connecting the samples with short
// line segments - at this resolution (72 samples across 360px) that's
// visually indistinguishable from a true bezier curve. Decided to keep the
// chart interactive (tap any of the 9 days) rather than collapse it to one
// static day, since nothing about making the data real required giving up
// that interaction - the per-day values it already read off were never the
// hard part, the fixed calendar-day labels were.
//
// `birthDate: null` (no date of birth entered this session) renders a
// distinct muted/contour state instead - see `GHOST` below - rather than
// reusing the old demo curve as a fallback, which is exactly what
// decisions.md 2026-11-21/22 #2 ruled out ("не демо-кривыми").
//
// `width` is a real responsive prop (same pattern as SleepWheelPicker's
// `size`), default 380 only as a cap.
const OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;
const FIRST_OFFSET = OFFSETS[0];
const LAST_OFFSET = OFFSETS[OFFSETS.length - 1];
const OFFSET_TO_X = (offset: number) => (offset - FIRST_OFFSET) * 45;

// Read off the original hand-authored demo curves' own anchor points
// (unchanged since 2026-08-19) - no longer the chart's live rendering
// source (see the big comment above), but kept as a small library of 9
// "shapes" a real day's values can be matched against for HomeScreen's
// insight text (content/biorhythmInsight.ts's pickDayParagraphTemplate) -
// those 9 hand-written paragraphs were each written to describe one of
// these specific patterns, so they're still worth keeping as a lookup
// table, just not as the thing physically drawn on screen any more.
type CurveYs = { physical: number; emotional: number; intellect: number };
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
// bottom (y=200) = 0, middle (y=100) = 50, top (y=0) = 100.
function yToPct(y: number): number {
  return 100 - y / 2;
}
function pctToY(pct: number): number {
  return 200 - pct * 2;
}

export function getDayValues(day: number): CurveYs {
  const y = DAY_Y[day] ?? DAY_Y[14];
  return { physical: yToPct(y.physical), emotional: yToPct(y.emotional), intellect: yToPct(y.intellect) };
}

function formatPct(v: number, language: Language) {
  const fixed = v.toFixed(1);
  return `${language === 'ru' ? fixed.replace('.', ',') : fixed}%`;
}

const CYCLE_META: { id: keyof BiorhythmValues; color: string }[] = [
  { id: 'physical', color: '#5BC4A0' },
  { id: 'emotional', color: '#FFC6F1' },
  { id: 'intellect', color: '#8B7CF6' },
];

// Fine enough that 3 gentle sine curves over an 8-day span (far less than
// one full period of even the shortest 23-day cycle) read as smooth curves,
// not a polyline - see the file-level comment on why sampling replaces
// bezier-fitting here.
const CURVE_SAMPLES = 72;

function buildCurvePath(birth: BirthDate, anchorDays: number, cycleId: keyof BiorhythmValues): string {
  const points: string[] = [];
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const frac = i / CURVE_SAMPLES;
    const offset = FIRST_OFFSET + (LAST_OFFSET - FIRST_OFFSET) * frac;
    const values = getBiorhythmValuesAtDayOffset(birth, anchorDays + offset);
    const x = frac * 360;
    const y = pctToY(values[cycleId]);
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}

// dashoffset = circumference * (100 - pct) / 100 - ring reads empty at
// pct=0, full at pct=100.
const RING_R = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const RING_DASHARRAY: [number, number] = [RING_CIRCUMFERENCE, RING_CIRCUMFERENCE];
// A round strokeLinecap bulges ~strokeWidth (8) into the gap from each of
// its two ends - floors the visible gap so a near-100% ring never reads as
// fully closed (caught 2026-08-20).
const MIN_VISIBLE_GAP = 16;
const dashoffsetForPct = (pct: number) => {
  if (pct >= 100) return 0;
  return Math.max((RING_CIRCUMFERENCE * (100 - pct)) / 100, MIN_VISIBLE_GAP);
};

const RING_LABELS: Record<Language, { physical: string; emotional: string; intellect: string }> = {
  ru: { physical: 'Физика', emotional: 'Эмоции', intellect: 'Интеллект' },
  en: { physical: 'Physical', emotional: 'Emotional', intellect: 'Intellectual' },
};

function getRingMeta(language: Language) {
  const labels = RING_LABELS[language];
  return [
    { id: 'physical' as const, colors: ['#7DE8C4', '#5DC2A3', '#4BA78D'], glow: '#5DC2A3', label: labels.physical },
    { id: 'emotional' as const, colors: ['#FFCBF2', '#FFC6F1', '#FBBDEC'], glow: '#FFC6F1', label: labels.emotional },
    { id: 'intellect' as const, colors: ['#B6ABFF', colors.violet400, '#7060E8'], glow: colors.violet400, label: labels.intellect },
  ];
}
const RING_BOX = 100;
const RING_GLOW_PAD = 10;
const RING_VIEWBOX = 84;
const RING_CANVAS = RING_VIEWBOX + RING_GLOW_PAD * 2;
const RING_GLOW_STD = Platform.OS === 'android' ? 6 : 4;

export function BiorhythmChart({
  width = 380,
  birthDate,
  selectedOffset,
  onSelectOffset,
  today = new Date(),
}: {
  width?: number;
  // null = no date of birth entered this session (decisions.md 2026-11-21/22
  // #2) - renders the muted/contour "nothing plotted yet" state below
  // instead of any curve.
  birthDate: BirthDate | null;
  selectedOffset: number;
  onSelectOffset: (offset: number) => void;
  today?: Date;
}) {
  const { language } = useLanguage();
  const RING_META = getRingMeta(language);
  const scale = Math.min(width, 380) / 380;
  const chartW = 360 * scale;
  const chartH = 200 * scale;
  const chartInset = 10 * scale;
  const ringBoxSize = RING_BOX * scale;
  const selectedX = OFFSET_TO_X(selectedOffset);
  const ghost = birthDate === null;
  const values = birthDate ? getBiorhythmValues(birthDate, addDays(today, selectedOffset)) : null;
  const anchorDays = birthDate ? daysSinceBirthOn(birthDate, today) : 0;

  return (
    <View style={[styles.wrap, { width: width }]}>
      <View style={[styles.axis, { width }]}>
        {OFFSETS.map((offset) => {
          const isSelected = offset === selectedOffset;
          const fontSize = (isSelected && !ghost ? 20 : 16) * scale;
          const lineHeight = fontSize * 1.1;
          const boxWidth = (isSelected && !ghost ? 36 : 28) * scale;
          const dayLabel = String(addDays(today, offset).getDate());
          const posStyle =
            offset === FIRST_OFFSET
              ? { left: 0 }
              : offset === LAST_OFFSET
                ? { right: 0 }
                : { left: (10 + OFFSET_TO_X(offset)) * scale, marginLeft: -boxWidth / 2 };
          const label = (
            <Text
              style={[
                styles.axisLabel,
                isSelected && !ghost && styles.axisLabelSelected,
                ghost && styles.axisLabelGhost,
                { fontSize, lineHeight },
              ]}
            >
              {dayLabel}
            </Text>
          );
          // Ghost mode: no real per-day reading exists yet to switch to, so
          // the axis isn't tappable - a Pressable that visibly does nothing
          // on press would read as broken, not as "not available yet."
          return ghost ? (
            <View key={offset} style={[{ position: 'absolute', top: '50%', marginTop: -lineHeight / 2, width: boxWidth }, posStyle]}>
              {label}
            </View>
          ) : (
            <Pressable
              key={offset}
              onPress={() => onSelectOffset(offset)}
              hitSlop={8}
              style={[{ position: 'absolute', top: '50%', marginTop: -lineHeight / 2, width: boxWidth }, posStyle]}
            >
              {label}
            </Pressable>
          );
        })}
      </View>

      <Svg width={chartW} height={chartH} viewBox="0 -4 360 208" style={[styles.chart, { marginLeft: chartInset }]}>
        <Defs>
          {CYCLE_META.map((c) => (
            <Filter key={c.id} id={`curveGlow-${c.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation={6} />
            </Filter>
          ))}
        </Defs>
        <Gridlines selectedX={selectedX} />
        {ghost ? (
          // Muted contour, not the old demo curve and not empty (decisions.md
          // 2026-11-21/22 #2) - a single flat, dim, dashed line signals "a
          // chart will go here" without drawing anything that could be read
          // as a real measurement. No glow - glow in this app's visual
          // language means "here's a real signal."
          <Line x1={0} y1={100} x2={360} y2={100} stroke={colors.textDisabled} strokeOpacity={0.5} strokeWidth={1.5} strokeDasharray="6 8" />
        ) : (
          <>
            {CYCLE_META.map((c) => (
              <Path
                key={`${c.id}-glow`}
                d={buildCurvePath(birthDate!, anchorDays, c.id)}
                fill="none"
                stroke={c.color}
                strokeWidth={2}
                filter={`url(#curveGlow-${c.id})`}
              />
            ))}
            {CYCLE_META.map((c) => (
              <Path key={c.id} d={buildCurvePath(birthDate!, anchorDays, c.id)} fill="none" stroke={c.color} strokeWidth={2} />
            ))}
          </>
        )}
      </Svg>

      <View style={[styles.rings, { width: chartW, marginLeft: chartInset, marginTop: 40 * scale }]}>
        {RING_META.map((r) => {
          const pct = values ? values[r.id] : 0;
          const dashoffset = dashoffsetForPct(pct);
          return (
            <View key={r.id} style={styles.ringItem}>
              <View style={[styles.ringBox, { width: ringBoxSize, height: ringBoxSize }]}>
                <Svg
                  width={ringBoxSize * (RING_CANVAS / RING_VIEWBOX)}
                  height={ringBoxSize * (RING_CANVAS / RING_VIEWBOX)}
                  viewBox={`${-RING_GLOW_PAD} ${-RING_GLOW_PAD} ${RING_CANVAS} ${RING_CANVAS}`}
                  style={styles.ringSvg}
                >
                  <Defs>
                    <Filter id={`ringGlow-${r.id}`} x="-50%" y="-50%" width="200%" height="200%">
                      <FeGaussianBlur stdDeviation={RING_GLOW_STD} />
                    </Filter>
                  </Defs>
                  <Circle cx={42} cy={42} r={RING_R} fill="none" stroke="rgba(139,124,246,0.14)" strokeWidth={8} />
                  {/* Ghost mode: track only, no colored arc at all (same
                      "призрачное кольцо" language as CareScreen's
                      ResourceRing in its own empty state) - not a 0%-filled
                      real arc, which would still read as a measurement of
                      something. */}
                  {!ghost && (
                    <>
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
                    </>
                  )}
                </Svg>
                <Text style={[styles.ringPct, { fontSize: 16 * scale }, ghost && styles.ringPctGhost]}>
                  {ghost || !values ? '—' : formatPct(pct, language)}
                </Text>
              </View>
              <Text style={[styles.ringLabel, { fontSize: 16 * scale, marginTop: 8 * scale }, ghost && styles.ringLabelGhost]}>
                {r.label}
              </Text>
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
  axisLabelGhost: {
    color: colors.textDisabled,
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
    overflow: 'visible',
    transform: [{ rotate: '-90deg' }],
  },
  ringPct: {
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  ringPctGhost: {
    color: colors.textDisabled,
  },
  ringLabel: {
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  ringLabelGhost: {
    color: colors.textDisabled,
  },
});
