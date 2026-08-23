import { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, PanResponder, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, glow, fontFamily, gradients, spacing } from '../theme';

// WF20 "Как ты чувствуешь себя сегодня?" — ported from the UI Kit's already
// finished Mood Scale component (`UI Kit/index.html`/`css/style.css`
// `#mood-scale`, 2026-07-28 session), not the rough wireframe placeholder -
// per project convention, a real finished kit component wins over an older
// wireframe once the kit has since evolved past it. Same real assets
// (`assets/mood/picture-mood-scala-*.png`, hollow glow-outline shapes,
// uniform violet), same track recipe (thumb + thin line only, no small
// dots, everything positioned at true 0/25/50/75/100% so each element's
// *center* lands exactly on its stop), same gradient title treatment.
const MOODS = [
  { label: 'Ужасно', img: require('../assets/mood/picture-mood-scala-very-bad.png') },
  { label: 'Плохо', img: require('../assets/mood/picture-mood-scala-bad.png') },
  { label: 'Нейтрально', img: require('../assets/mood/picture-mood-scala-neutral.png') },
  { label: 'Хорошо', img: require('../assets/mood/picture-mood-scala-good.png') },
  { label: 'Отлично', img: require('../assets/mood/picture-mood-scala-very-good.png') },
];

// Fixed width for the line/fill/thumb only (2026-08-17: "оставь саму линию
// как сейчас" - the line itself is fine as-is, not part of this round's
// complaint). Capped to the real container width so it can't overflow a
// narrower phone (same pattern as SleepWheelPicker's `dialSize`).
const SCALE_WIDTH = 380;

// Separate coordinate system for the icons+labels row only - the line's
// fixed 380 was leaving "Ужасно"/"Отлично" clipped off the left/right edge
// on a narrower device (2026-08-17: "опять сделал так что слова... не
// видно"). These need the real 16px-from-wall behavior instead: shrink the
// icons/labels' own 0%/100% points inward by (half that label's real
// rendered width - 4), so once centered on its point the label's own edge
// lands exactly 16px from the wall - measured via two invisible off-screen
// Text twins, since a fixed-width centered box (see labelText below) can't
// report its own glyph width.
const WALL_TO_LABEL = 16;
const WALL_TO_CARD = spacing.screenPadding;

export function MoodScale({ index, onChange }: { index: number; onChange: (index: number) => void }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [firstLabelWidth, setFirstLabelWidth] = useState(0);
  const [lastLabelWidth, setLastLabelWidth] = useState(0);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const ready = trackWidth > 0;
  const scaleWidth = Math.min(SCALE_WIDTH, trackWidth);
  const leftOffset = Math.max(0, (trackWidth - scaleWidth) / 2);

  const labelInsetLeft = Math.max(0, firstLabelWidth / 2 - (WALL_TO_CARD - WALL_TO_LABEL));
  const labelInsetRight = Math.max(0, lastLabelWidth / 2 - (WALL_TO_CARD - WALL_TO_LABEL));
  const labelUsableWidth = Math.max(0, trackWidth - labelInsetLeft - labelInsetRight);
  const labelsReady = trackWidth > 0 && firstLabelWidth > 0 && lastLabelWidth > 0;
  const labelPosForPct = (p: number) => labelInsetLeft + p * labelUsableWidth;

  const indexFromX = (x: number) => {
    if (scaleWidth <= 0) return index;
    const ratio = Math.min(1, Math.max(0, (x - leftOffset) / scaleWidth));
    return Math.round(ratio * (MOODS.length - 1));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => onChange(indexFromX(evt.nativeEvent.locationX)),
        onPanResponderMove: (evt: GestureResponderEvent) => onChange(indexFromX(evt.nativeEvent.locationX)),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leftOffset, scaleWidth]
  );

  const pct = index / (MOODS.length - 1);

  return (
    <View style={styles.card}>
      <Svg width="100%" height={32}>
        <Defs>
          <SvgLinearGradient id="moodTitleGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
            <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
            <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
          </SvgLinearGradient>
        </Defs>
        <SvgText x="50%" y="24" fontSize={26} fontFamily={fontFamily.extraBold} textAnchor="middle" fill="url(#moodTitleGrad)">
          {MOODS[index].label}
        </SvgText>
      </Svg>

      <View style={styles.illustration}>
        <Image source={MOODS[index].img} style={styles.illustrationImg} resizeMode="contain" />
      </View>

      <View style={styles.track} onLayout={onTrackLayout}>
        {ready ? (
          <>
            <View style={[styles.trackLine, { left: leftOffset, width: scaleWidth }]} />
            <View style={[styles.trackFill, { left: leftOffset, width: pct * scaleWidth }]} />
          </>
        ) : null}
        {/* Thumb positioned on the icons/labels' own coordinate system
            (labelPosForPct), not the line/fill's own (leftOffset+scaleWidth)
            - the line itself stays untouched (2026-08-20: "длину самой
            линии слайдера не меняй"), but the two systems don't share the
            same width/inset (line = fixed 380 capped+centered, icons =
            real-measured wall clearance), so a thumb driven by the line's
            own math landed off from the icon underneath it at every stop
            except the very ends. This was a known, previously-flagged
            drift ([[project-app-development]] 2026-08-17 entry) - she's
            now confirmed it's actually visible, so fixing it for real. */}
        {labelsReady ? <View style={[styles.thumb, { left: labelPosForPct(pct) }]} /> : null}
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </View>

      <View style={styles.icons}>
        {labelsReady
          ? MOODS.map((m, i) => (
              <Image key={i} source={m.img} style={[styles.iconMini, { left: labelPosForPct(i / (MOODS.length - 1)) }]} resizeMode="contain" />
            ))
          : null}
      </View>

      <View style={styles.labels}>
        {labelsReady
          ? MOODS.map((m, i) => (
              <Text key={i} style={[styles.labelText, { left: labelPosForPct(i / (MOODS.length - 1)) }, i === index && styles.labelActive]}>
                {m.label}
              </Text>
            ))
          : null}
        {/* Invisible width-measuring twins - real rendered glyph width, not
            a guess, feeds labelInsetLeft/labelInsetRight above. */}
        <Text style={styles.hiddenMeasure} onLayout={(e) => setFirstLabelWidth(e.nativeEvent.layout.width)}>
          {MOODS[0].label}
        </Text>
        <Text style={styles.hiddenMeasure} onLayout={(e) => setLastLabelWidth(e.nativeEvent.layout.width)}>
          {MOODS[MOODS.length - 1].label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  illustration: {
    width: 160,
    height: 160,
    marginTop: 24,
    marginBottom: 24,
  },
  illustrationImg: {
    width: '100%',
    height: '100%',
  },
  track: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    marginBottom: 32,
  },
  trackLine: {
    position: 'absolute',
    top: '50%',
    height: 2,
    marginTop: -1,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  trackFill: {
    position: 'absolute',
    top: '50%',
    height: 2,
    marginTop: -1,
    borderRadius: 1,
    backgroundColor: colors.violet400,
    boxShadow: `0px 0px 8px ${colors.violet400}`,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: -11,
    marginTop: -11,
    backgroundColor: colors.violet400,
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  icons: {
    width: '100%',
    height: 34,
    marginBottom: 12,
  },
  iconMini: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 30,
    marginLeft: -15,
  },
  labels: {
    width: '100%',
    height: 16,
  },
  labelText: {
    position: 'absolute',
    top: 0,
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    // Approximates the web version's translateX(-50%): a fixed-width box
    // centered on its own `left` px position (labelPosForPct above) - fine
    // for these short one-word labels.
    width: 90,
    marginLeft: -45,
  },
  labelActive: {
    color: colors.violet400,
  },
  hiddenMeasure: {
    position: 'absolute',
    opacity: 0,
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },
});
