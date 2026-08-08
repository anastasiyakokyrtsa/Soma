import { useEffect, useMemo } from 'react';
import { Canvas, Circle, Blur, Group } from '@shopify/react-native-skia';
import { useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

// Sparse starfield behind the splash logo — meant to read as "looking up at a clear
// night sky from below": tiny, crisp, bright pinpoints scattered evenly across the
// whole screen, most static, a minority twinkling with a real brightness swing.
// A handful of stars are bigger — kept crisp (only a hair of blur, just enough to
// stop a small circle looking jagged, not the earlier heavy glow-halo treatment
// that read as "out of focus").

type Star = {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  big: boolean;
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
function makeStars(
  width: number,
  height: number,
  count: number,
  twinkleChance: number,
  dipRange: [number, number]
): Star[] {
  const rand = mulberry32(1337);
  const dip = () => dipRange[0] + rand() * (dipRange[1] - dipRange[0]);
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

  // ~5 big stars — cells are already in shuffled (random) order, so just tagging
  // the first few after trimming gives a random, well-scattered subset.
  const bigCount = Math.min(5, Math.round(count / 9));

  const gridStars = cells.slice(0, count).map(({ cx, cy }, i) => {
    const big = i < bigCount;
    const twinkle = rand() < twinkleChance;
    return {
      x: cx + rand() * cellW,
      y: cy + rand() * cellH,
      r: big ? 1.3 + rand() * 0.6 : 0.3 + rand() * 0.5,
      baseOpacity: 0.55 + rand() * 0.45,
      big,
      twinkle,
      duration: 2200 + rand() * 3000,
      delay: rand() * 3000,
      dip: dip(),
    };
  });

  // The grid's cols/rows don't always tile a tall phone screen evenly — the top-right
  // corner in particular read as sparse. A couple of hand-placed stars there, on top
  // of the grid, rather than reworking the tiling math for one corner.
  const topRightExtras = [
    { fx: 0.82, fy: 0.05 },
    { fx: 0.93, fy: 0.12 },
  ].map(({ fx, fy }) => {
    const twinkle = rand() < twinkleChance;
    return {
      x: fx * width,
      y: fy * height,
      r: 0.3 + rand() * 0.5,
      baseOpacity: 0.55 + rand() * 0.45,
      big: false,
      twinkle,
      duration: 2200 + rand() * 3000,
      delay: rand() * 3000,
      dip: dip(),
    };
  });

  return [...gridStars, ...topRightExtras];
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
        {star.big ? <Blur blur={0.5} /> : null}
      </Circle>
    </Group>
  );
}

// twinkleChance/dipRange default to the splash screen's original tuning
// (~45% of stars twinkle, dipping to 10-35% opacity) — overridable per call
// site. Added 2026-08-08 for the Cosmos style-picker swatch, which wanted
// visibly more shimmer than the splash's calmer night-sky feel ("пусть
// звёзды больше сияют") without changing how the splash itself looks.
export function StarField({
  width,
  height,
  count = 48,
  twinkleChance = 0.45,
  dipRange = [0.1, 0.35],
}: {
  width: number;
  height: number;
  count?: number;
  twinkleChance?: number;
  dipRange?: [number, number];
}) {
  const stars = useMemo(
    () => makeStars(width, height, count, twinkleChance, dipRange),
    [width, height, count, twinkleChance, dipRange]
  );
  return (
    <Canvas style={[StyleSheet.absoluteFillObject, { width, height }]}>
      {stars.map((s, i) => (
        <Star key={i} star={s} />
      ))}
    </Canvas>
  );
}
