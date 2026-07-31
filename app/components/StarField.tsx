import { useEffect, useMemo } from 'react';
import { Canvas, Circle, Blur, Group } from '@shopify/react-native-skia';
import { useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

// Sparse, mostly-static starfield — a handful of soft points scattered behind the
// splash logo, most fixed, a few slowly twinkling. Deliberately kept low-count and
// low-contrast per spec ("не прям много", "слегка мерцающие") — this isn't meant
// to read as a busy pattern, just faint ambient depth.

type Star = {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  twinkle: boolean;
  duration: number;
  delay: number;
};

// fixed seed-ish pseudo-random so the layout doesn't reshuffle on every re-render
function makeStars(width: number, height: number, count: number): Star[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => {
    const twinkle = rand() < 0.4;
    return {
      x: rand() * width,
      y: rand() * height,
      r: 0.8 + rand() * 1.7,
      baseOpacity: 0.25 + rand() * 0.45,
      twinkle,
      duration: 2500 + rand() * 2500,
      delay: rand() * 2000,
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
          withTiming(0.25, { duration: star.duration / 2, easing: Easing.inOut(Easing.quad) }),
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
        {star.r > 1.6 ? <Blur blur={0.6} /> : null}
      </Circle>
    </Group>
  );
}

export function StarField({ width, height, count = 18 }: { width: number; height: number; count?: number }) {
  const stars = useMemo(() => makeStars(width, height, count), [width, height, count]);
  return (
    <Canvas style={[StyleSheet.absoluteFillObject, { width, height }]}>
      {stars.map((s, i) => (
        <Star key={i} star={s} />
      ))}
    </Canvas>
  );
}
