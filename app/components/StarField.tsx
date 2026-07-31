import { useEffect, useMemo } from 'react';
import { Canvas, Circle, Blur, Group } from '@shopify/react-native-skia';
import { useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

// Sparse starfield behind the splash logo — meant to read as "looking up at a clear
// night sky from below": mostly tiny, bright pinpoints, a few slightly bigger ones
// with a soft glow, most static, a minority twinkling with a real brightness swing.

type Star = {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  glow: boolean;
  twinkle: boolean;
  duration: number;
  delay: number;
  dip: number;
};

// fixed seed-ish pseudo-random so the layout doesn't reshuffle on every re-render
function makeStars(width: number, height: number, count: number): Star[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => {
    // mostly tiny pinpoints, occasional slightly bigger "near" star
    const big = rand() < 0.2;
    const r = big ? 0.9 + rand() * 0.7 : 0.3 + rand() * 0.5;
    const twinkle = rand() < 0.45;
    return {
      x: rand() * width,
      y: rand() * height,
      r,
      baseOpacity: 0.55 + rand() * 0.45,
      glow: big,
      twinkle,
      duration: 2200 + rand() * 3000,
      delay: rand() * 3000,
      dip: 0.1 + rand() * 0.25,
    };
  });
}

function Star({ star }: { star: Star }) {
  const t = useSharedValue(1);

  useEffect(() => {
    if (!star.twinkle) return;
    t.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(star.dip, { duration: star.duration / 2, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: star.duration / 2, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = useDerivedValue(() => star.baseOpacity * t.value);

  return (
    <Group opacity={opacity}>
      <Circle cx={star.x} cy={star.y} r={star.r} color="white">
        {star.glow ? <Blur blur={1.2} /> : null}
      </Circle>
      {star.glow && (
        <Circle cx={star.x} cy={star.y} r={star.r * 2.2} color="white" opacity={0.25}>
          <Blur blur={2.5} />
        </Circle>
      )}
    </Group>
  );
}

export function StarField({ width, height, count = 26 }: { width: number; height: number; count?: number }) {
  const stars = useMemo(() => makeStars(width, height, count), [width, height, count]);
  return (
    <Canvas style={[StyleSheet.absoluteFillObject, { width, height }]}>
      {stars.map((s, i) => (
        <Star key={i} star={s} />
      ))}
    </Canvas>
  );
}
