import { useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, PanResponder, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, glow, fontFamily, gradients } from '../theme';

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

export function MoodScale({ index, onChange }: { index: number; onChange: (index: number) => void }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const widthRef = useRef(0);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const indexFromX = (x: number) => {
    const w = widthRef.current;
    if (w <= 0) return index;
    const ratio = Math.min(1, Math.max(0, x / w));
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
    []
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
        <View style={styles.trackLine} />
        {trackWidth > 0 ? (
          <>
            <View style={[styles.trackFill, { width: pct * trackWidth }]} />
            <View style={[styles.thumb, { left: pct * trackWidth }]} />
          </>
        ) : null}
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </View>

      <View style={styles.icons}>
        {MOODS.map((m, i) => (
          <Image key={i} source={m.img} style={[styles.iconMini, { left: `${(i / (MOODS.length - 1)) * 100}%` }]} resizeMode="contain" />
        ))}
      </View>

      <View style={styles.labels}>
        {MOODS.map((m, i) => (
          <Text key={i} style={[styles.labelText, { left: `${(i / (MOODS.length - 1)) * 100}%` }, i === index && styles.labelActive]}>
            {m.label}
          </Text>
        ))}
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
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: '50%',
    height: 2,
    marginTop: -1,
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
    // Approximate the web version's translateX(-50%) with a fixed-width
    // box centered on its own `left` percentage - close enough for these
    // short one-word labels.
    width: 90,
    marginLeft: -45,
  },
  labelActive: {
    color: colors.violet400,
  },
});
