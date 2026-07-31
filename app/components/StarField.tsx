import { useEffect, useMemo } from 'react';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

// Sparse starfield behind the splash logo — meant to read as "looking up at a clear
// night sky from below": tiny, crisp, bright pinpoints scattered evenly across the
// whole screen, most static, a minority twinkling with a real brightness swing.
// No blur/glow on any star — that read as "out of focus" rather than "bright".

type Star = {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  twinkle: boolean;
  duration: number;
  delay: number;
  dip: number;
};

// mulberry32 — small, well-distributed PRNG. The previous hand-rolled LCG had
// visible correlation between consecutive x/y draws that clumped stars into two
// corners instead of scattering evenly.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Jittered grid instead of pure random placement — with only ~30 points, true
// randomness reads as clumpy by chance (this is what produced the "stars stuck in
// two corners" complaint even with a decent PRNG). One star per cell, randomly
// offset within the cell, guarantees even coverage while still looking organic.
function makeStars(width: number, height: number, count: number): Star[] {
  const rand = mulberry32(1337);
  const cols = Math.round(Math.sqrt((count * width) / height));
  const rows = Math.ceil(count / cols);
  const cellW = width / cols;
  const cellH = height / rows;

  const cells: { cx: number; cy: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ cx: col * cellW, cy: row * cellH });
    }
  }
  // shuffle so if count < cols*rows, the dropped cells are scattered, not a missing chunk
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return cells.slice(0, count).map(({ cx, cy }) => {
    const twinkle = rand() < 0.45;
    return {
      x: cx + rand() * cellW,
      y: cy + rand() * cellH,
      r: 0.3 + rand() * 0.5,
      baseOpacity: 0.55 + rand() * 0.45,
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
      <Circle cx={star.x} cy={star.y} r={star.r} color="white" />
    </Group>
  );
}

export function StarField({ width, height, count = 34 }: { width: number; height: number; count?: number }) {
  const stars = useMemo(() => makeStars(width, height, count), [width, height, count]);
  return (
    <Canvas style={[StyleSheet.absoluteFillObject, { width, height }]}>
      {stars.map((s, i) => (
        <Star key={i} star={s} />
      ))}
    </Canvas>
  );
}
