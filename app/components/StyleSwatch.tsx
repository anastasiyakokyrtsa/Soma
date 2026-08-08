import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { StarField } from './StarField';
import type { VisualStyleId } from '../theme/visualStyles';

// The visual half of the style picker (WF 12-13).
//
// Revision history (all from on-device review):
//   - cosmos (2026-08-07): code-drawn — denser starfield. A nebula-glow
//     layer was tried and dropped — "убери разводы, оставь просто звёзды".
//   - focus (2026-08-07): code-drawn — pure black/white, concentric
//     focus-rings, no color at all, closer to the Stoic-app reference given.
//     2026-08-08: added motion — a brightness pulse travels outward through
//     the rings, center dot breathes (scale).
//   - nature: went through 3 code-drawn directions (leaves → wave/relief →
//     generative windswept-grass strokes) and none of them landed. She
//     supplied the real reference illustration as a file
//     (`assets/styles/nature.jpeg`) — ports [[feedback-figma-fidelity]]'s
//     "use the real original, don't keep redrawing it" rule to this swatch.
//     2026-08-08: added motion — 2 small code-drawn birds drift/flap over
//     the static image (the birds baked into the flat illustration can't be
//     animated on their own, so these are new ones layered on top, roughly
//     where the reference's own birds sit).
//   - dawn (renamed from "Тепло"): same story — code-drawn gradient attempts
//     couldn't reproduce the grainy/sparkly texture of her reference. She
//     supplied the real reference file too (`assets/styles/dawn.jpeg`).
//     2026-08-08: added motion — small sparkle marks layered over the image,
//     twinkling roughly where the reference's own baked-in sparkles sit
//     (same reasoning as the birds above — can't animate pixels already
//     flattened into the photo, so these sit on top of it instead).
//
// A whole-image "breathing" zoom was tried first for Nature/Dawn and wasn't
// what she meant ("я просто смотрю что звёзды в Космос ты анимировал... а
// можешь так же некоторые элементы анимировать") — she wanted specific
// small elements animated like Cosmos's stars, not the whole photo moving.
const IMAGE_SOURCES: Partial<Record<VisualStyleId, ReturnType<typeof require>>> = {
  nature: require('../assets/styles/nature.jpeg'),
  dawn: require('../assets/styles/dawn.jpeg'),
};

const GRADIENTS: Record<VisualStyleId, string[]> = {
  cosmos: ['#050816', '#1B1339'],
  focus: ['#000000', '#000000'],
  nature: ['#050816', '#050816'],
  dawn: ['#050816', '#050816'],
};

function FocusRings({ width, height }: { width: number; height: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const rings = [0.16, 0.28, 0.4, 0.52];
  const dotScale = useSharedValue(1);

  useEffect(() => {
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [dotScale]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <>
      {rings.map((f, i) => (
        <ShimmerRing key={i} size={width * f * 2} left={cx - width * f} top={cy - width * f} baseAlpha={0.55 - i * 0.11} delay={i * 350} />
      ))}
      {/* small solid center point — an aperture/lens iris reads more like
          "focus" than empty rings alone, now breathing (scale pulse) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: width * 0.045,
            height: width * 0.045,
            borderRadius: 999,
            backgroundColor: '#FFFFFF',
            left: cx - (width * 0.045) / 2,
            top: cy - (width * 0.045) / 2,
          },
          dotStyle,
        ]}
      />
    </>
  );
}

// One ring's brightness pulses up and settles back — staggered by `delay` so
// the pulse visibly travels outward through the ring stack instead of every
// ring flashing together ("переливы на линиях кругов").
function ShimmerRing({ size, left, top, baseAlpha, delay }: { size: number; left: number; top: number; baseAlpha: number; delay: number }) {
  const alpha = useSharedValue(baseAlpha);

  useEffect(() => {
    alpha.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.min(1, baseAlpha + 0.5), { duration: 900, easing: Easing.out(Easing.quad) }),
          withTiming(baseAlpha, { duration: 1500, easing: Easing.in(Easing.quad) }),
          withTiming(baseAlpha, { duration: 1200 })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    borderColor: `rgba(255,255,255,${alpha.value})`,
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', width: size, height: size, left, top, borderRadius: 999, borderWidth: 1 },
        style,
      ]}
    />
  );
}

// Small drifting/flapping bird for the Nature swatch — a wide shallow "M"
// stroke (two wings), scaleY oscillating fast for the flap, a slow
// translateX/Y drift for gentle flight across the frame.
function Bird({ x, y, size, flapDuration, driftDuration, delay }: { x: number; y: number; size: number; flapDuration: number; driftDuration: number; delay: number }) {
  const flap = useSharedValue(1);
  const drift = useSharedValue(0);

  useEffect(() => {
    flap.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.35, { duration: flapDuration / 2, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: flapDuration / 2, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );
    drift.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: driftDuration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: driftDuration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * size * 0.8 },
      { translateY: -drift.value * size * 0.25 },
      { scaleY: flap.value },
    ],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y, width: size, height: size * 0.5 }, style]}>
      <Svg width={size} height={size * 0.5} viewBox="0 0 24 12">
        <Path d="M0 6 Q6 -2 12 6 Q18 -2 24 6" stroke="#1B2233" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}

// Small lollipop-tree silhouette for the Nature swatch, swaying gently at
// the trunk like wind — transformOrigin pins the rotation to the base so it
// pivots like a real tree instead of spinning around its own center.
function SwayingTree({ x, y, size, canopyColor, delay, duration }: { x: number; y: number; size: number; canopyColor: string; delay: number; duration: number }) {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(4, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(-4, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: x, top: y, width: size, height: size * 1.6, transformOrigin: '50% 100%' },
        style,
      ]}
    >
      <Svg width={size} height={size * 1.6} viewBox="0 0 10 16">
        <Path d="M5 16 L5 5" stroke="#5C4A34" strokeWidth={1} />
        <Circle cx={5} cy={4} r={3.4} fill={canopyColor} />
      </Svg>
    </Animated.View>
  );
}

// Small 4-point sparkle mark for the Dawn swatch, twinkling in place —
// opacity dips low and recovers, staggered per instance so they don't blink
// in unison (same "stagger the twinkle" idea as StarField's stars).
function Sparkle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.25, { duration: duration / 2, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y }, style]}>
      <Svg width={size} height={size} viewBox="0 0 12 12">
        <Path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="#FFFFFF" />
      </Svg>
    </Animated.View>
  );
}

export function StyleSwatch({
  styleId,
  width,
  height,
  radius = 0,
}: {
  styleId: VisualStyleId;
  width: number;
  height: number;
  radius?: number;
}) {
  const imageSource = IMAGE_SOURCES[styleId];

  return (
    <View style={[styles.container, { width, height, borderRadius: radius }]}>
      {imageSource ? (
        <Image source={imageSource} style={{ width, height }} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={GRADIENTS[styleId] as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {styleId === 'cosmos' && (
        <StarField
          width={width}
          height={height}
          count={Math.max(20, Math.round((width * height) / 1400))}
          // More/deeper twinkle than the splash's calmer default (2026-08-08:
          // "пусть звёзды больше сияют") — splash itself is untouched, this
          // only applies here via the new optional props on StarField.
          twinkleChance={0.75}
          dipRange={[0.05, 0.22]}
        />
      )}

      {styleId === 'focus' && <FocusRings width={width} height={height} />}

      {styleId === 'nature' && (
        <>
          <Bird x={width * 0.52} y={height * 0.2} size={width * 0.09} flapDuration={550} driftDuration={2600} delay={0} />
          <Bird x={width * 0.72} y={height * 0.27} size={width * 0.06} flapDuration={420} driftDuration={2200} delay={300} />
          <SwayingTree x={width * 0.33} y={height * 0.62} size={width * 0.06} canopyColor="#8CAE72" delay={0} duration={2200} />
          <SwayingTree x={width * 0.63} y={height * 0.7} size={width * 0.07} canopyColor="#F2D9A8" delay={400} duration={2600} />
          <SwayingTree x={width * 0.77} y={height * 0.65} size={width * 0.05} canopyColor="#5E8350" delay={800} duration={2000} />
        </>
      )}

      {styleId === 'dawn' && (
        <>
          <Sparkle x={width * 0.16} y={height * 0.14} size={10} delay={0} duration={2400} />
          <Sparkle x={width * 0.62} y={height * 0.08} size={8} delay={500} duration={2000} />
          <Sparkle x={width * 0.82} y={height * 0.4} size={9} delay={900} duration={2600} />
          <Sparkle x={width * 0.32} y={height * 0.46} size={7} delay={1300} duration={2200} />
          <Sparkle x={width * 0.55} y={height * 0.62} size={8} delay={1700} duration={2400} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
