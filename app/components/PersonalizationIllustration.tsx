import { Canvas, Circle, Group, Blur, Path } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

// Fixed-position vector port of Figma's "Personalization" illustration (node
// 402:3007..4000) — replaces an earlier attempt that rasterized the kit's
// picture-1..5.svg exports to PNG via qlmanage (the only SVG rasterizer
// available in this sandbox); that flattened every blur filter into a mushy
// smear. Drawing it live with Skia (same approach as StarField.tsx) keeps the
// glow crisp at any size and matches Figma's actual coordinates exactly.
//
// 2026-08-09, take 2: originally drove all motion off Reanimated shared
// values passed straight into Skia props - but on-device it never actually
// animated, because this app's Expo Go build at the time pinned
// @shopify/react-native-skia@2.2.12 + react-native-worklets@0.5.1, and
// Skia's shared-value-to-canvas bridge needs newer versions than that (Skia's
// own docs: the direct-shared-value integration needs Reanimated v4+, which
// implies newer worklets than 0.5). Rebuilt at the time on a plain rAF-driven
// React state number instead (see PersonalizationScreen.tsx's own history),
// which sidesteps the bridge entirely at the cost of a full React
// re-render + Skia repaint every single frame.
//
// 2026-09-29, take 3: after the SDK 54->57 upgrade (Skia 2.6.2, worklets
// 0.10.1, reanimated 4.5.1) she reported this screen's animation had gone
// jerky - but *only on Android*, iOS stayed smooth. Since a still-broken
// bridge would fail identically on both platforms, this was instead the
// take-2 workaround's real per-frame cost (recomputing ~40 star positions +
// a full Skia repaint via React re-render, every frame) finally exceeding
// Android's budget on the newer, apparently heavier render pipeline - a
// throttle to ~30fps on Android alone didn't fully fix it either, meaning
// the bottleneck is the *cost* of each frame's JS work, not just how often
// it runs. Confirmed the bridge itself is actually wired in this Skia
// version (node_modules/@shopify/react-native-skia's own
// sksg/Recorder/ReanimatedRecorder.js does the same `isSharedValue(prop)`
// detection the docs describe) - so this take moves every position back to
// genuine Reanimated shared/derived values passed directly as Skia props.
// The whole animation now runs on the UI thread with zero React re-renders
// per frame (PersonalizationScreen.tsx's clock is a plain useFrameCallback
// mutating a shared value, not React state) - not just cheaper than take 2,
// structurally a different, much lighter mechanism. Not yet confirmed smooth
// on her Android device.
//
// Two motion layers:
//  1. Ambient wander — every star drifts slowly and organically the whole
//     time ("медленно и красиво... хаотично блуждая"), each on its own
//     randomized speed/amplitude (seeded, so it's reproducible) so the field
//     doesn't breathe in sync.
//  2. The ring choreography — during each step's 5s, exactly one of the 8
//     ring stars "arrives" (glides from its wandering position onto the
//     ring) right as the ring's own outline arc sweeps past its angle,
//     starting at 12 o'clock and going clockwise, closing back at 12 o'clock
//     at 5s - a staggered sequence, not all 8 moving in parallel.
//
// Every star is one of exactly 3 kit primitives — a blurred glow circle
// (stdDeviation 6 in the source SVGs, ported 1:1 as Skia's Blur) plus a
// bright core dot, both centered on the same point:
//   8px star:  glow r=4,   opacity 1,    core r=1
//   5px star:  glow r=2.5, opacity 1,    core r=0.625
//   35px star: glow r=17.5, opacity .14, core r=3.5

const CANVAS_W = 380;
const CENTER: [number, number] = [190, 184];

const GLOW = '#8B7CF6';
const CORE = '#E0DBFF';

type Pt = [number, number];

// Stage-1 field (Figma node 402:3007) — background stars, always visible,
// always gently wandering.
const STARS_8: Pt[] = [[44,43],[117,188],[178,117],[53,129],[237,141],[203,121],[211,117],[161,263],[36,305],[119,241],[20,247],[166,346],[224,272],[226,245],[325,326],[317,327],[340,154],[280,66],[250,87],[219,46],[317,42],[325,56],[347,83]];
const STARS_5: Pt[] = [[286.5,95.5],[245.5,188.5],[112.5,58.5],[115.5,80.5],[47.5,174.5],[82.5,249.5],[84.5,301.5],[65.5,278.5],[141.5,209.5],[230.5,319.5],[265.5,333.5],[333.5,194.5],[288.5,220.5],[266.5,225.5],[363.5,296.5],[116.5,7.5],[15.5,93.5],[7.5,140.5]];

// The 8 big stars that gather into ring 1 during step 1 — exact stage-1
// scattered origin (get_design_context, node 402:3007) and exact ring
// destination (ring 1's own kit asset, Group 55). Thresholds are each
// point's clockwise-from-12-o'clock angle / 360 (Figma placed them at even
// 45deg steps, just not starting the array at 12 o'clock).
const RING1_STARS_RAW: Pt[] = [[179.5,69.5],[164.5,142.5],[200.5,203.5],[302.5,270.5],[286.5,171.5],[116.5,121.5],[68.5,219.5],[62.5,332.5]];
const RING1_DEST: Pt[] = [[260.75,184.44],[119.25,184.44],[139.72,134.61],[240.28,234.28],[139.72,234.28],[189.56,254.75],[189.56,113.25],[239.39,134.61]];
const RING1_THRESHOLDS = [0.25, 0.75, 0.875, 0.375, 0.625, 0.5, 0, 0.125];

// The remaining 8 big stars (stage-2's leftover positions, node 402:3220)
// gather into ring 2 during step 2. Ring 2 has no equivalent embedded
// 8-point sprite in Figma, so the destinations are generated at clean 45deg
// steps around its radius — same choreography as ring 1, evenly spaced.
const RING2_STARS_RAW: Pt[] = [[320.5,118.5],[140.5,308.5],[50.5,75.5],[19.5,194.5],[347.5,229.5],[248.5,40.5],[232.5,334.5],[134.5,58.5]];
const RING2_DEST: Pt[] = [[190,56.86],[279.9,94.1],[317.14,184],[279.9,273.9],[190,311.14],[100.1,273.9],[62.86,184],[100.1,94.1]];
const RING2_THRESHOLDS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];

// Greedy nearest-pair matching (smallest distance first) between the 8
// scattered stars and the 8 ring destinations — 2026-08-09 review: pairing
// them by their incidental array order sent some stars flying across the
// whole canvas to the far side of the ring, reading as an abrupt jump
// instead of a natural gathering. This gives each ring position the closest
// available star, so every path is short.
function matchNearest(stars: Pt[], dests: Pt[]): Pt[] {
  const edges: { si: number; di: number; d: number }[] = [];
  stars.forEach((s, si) =>
    dests.forEach((d, di) => {
      const dx = s[0] - d[0];
      const dy = s[1] - d[1];
      edges.push({ si, di, d: dx * dx + dy * dy });
    })
  );
  edges.sort((a, b) => a.d - b.d);
  const result: Pt[] = new Array(dests.length);
  const usedStar = new Set<number>();
  const usedDest = new Set<number>();
  for (const e of edges) {
    if (usedStar.has(e.si) || usedDest.has(e.di)) continue;
    result[e.di] = stars[e.si];
    usedStar.add(e.si);
    usedDest.add(e.di);
    if (usedDest.size === dests.length) break;
  }
  return result;
}

// Matched globally across all 16 big stars against all 16 ring slots (not
// ring-by-ring) — 2026-08-09 review: some pairs still flew a long way even
// with nearest-matching, because a star could be the *closest available* to
// a ring-1 slot while still being genuinely far from it, when it would have
// been a short hop to a ring-2 slot instead. Which of the 16 original stars
// ends up on which ring isn't something Figma specifies (ring 2 has no
// source positions of its own at all, see below) - so there's no fidelity
// cost to picking whichever 8-vs-8 split minimizes total travel distance.
const ALL_ORIGIN: Pt[] = [...RING1_STARS_RAW, ...RING2_STARS_RAW];
const ALL_DEST: Pt[] = [...RING1_DEST, ...RING2_DEST];
const ALL_MATCHED = matchNearest(ALL_ORIGIN, ALL_DEST);
const RING1_ORIGIN = ALL_MATCHED.slice(0, 8);
const RING2_ORIGIN = ALL_MATCHED.slice(8, 16);

const RING1_R = 71.06;
const RING2_R = 127.14;

// A full circle traced as two clockwise semicircle arcs starting at 12
// o'clock — Path's start/end trim needs an actual arc path to animate along,
// a single <Circle> can't be partially stroked.
function ringPath(cx: number, cy: number, r: number) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
}
const RING1_PATH = ringPath(CENTER[0], CENTER[1], RING1_R);
const RING2_PATH = ringPath(CENTER[0], CENTER[1], RING2_R);

// Checkmark path from Figma's exported asset (Group 69, 78x61.18 box),
// centered on the illustration and translated from its own top-left origin.
const CHECK_PATH = 'M66.5314 9.00104C65.9085 9.0196 65.3173 9.27994 64.883 9.72689L28.2159 46.394L13.1276 31.3057C12.9067 31.0756 12.642 30.8919 12.3492 30.7653C12.0564 30.6388 11.7413 30.5719 11.4223 30.5687C11.1033 30.5654 10.7869 30.6258 10.4915 30.7464C10.1962 30.867 9.92789 31.0453 9.70232 31.2709C9.47676 31.4964 9.29846 31.7647 9.17789 32.0601C9.05731 32.3554 8.99688 32.6718 9.00012 32.9908C9.00337 33.3098 9.07023 33.6249 9.19679 33.9177C9.32335 34.2106 9.50706 34.4752 9.73717 34.6961L26.5207 51.4796C26.9704 51.9291 27.5801 52.1816 28.2159 52.1816C28.8517 52.1816 29.4615 51.9291 29.9111 51.4796L68.2735 13.1173C68.6199 12.7805 68.8566 12.3469 68.9524 11.8734C69.0482 11.3998 68.9987 10.9083 68.8104 10.4633C68.6221 10.0184 68.3037 9.64066 67.8971 9.37973C67.4904 9.11879 67.0144 8.9868 66.5314 9.00104Z';
const CHECK_W = 78;
const CHECK_H = 61.1816;
const CHECK_TRANSFORM = [{ translate: [CENTER[0] - CHECK_W / 2, CENTER[1] - CHECK_H / 2] as [number, number] }];

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

type WanderParams = { ampX: number; ampY: number; periodX: number; periodY: number; phaseX: number; phaseY: number };

// Randomized once per star (seeded, so it's stable across renders) — amplitude
// 5-11px, one-way period 4.5-9s, random phase so stars don't breathe in sync.
function makeWander(seed: number): WanderParams {
  const rand = mulberry32(seed);
  return {
    ampX: 5 + rand() * 6,
    ampY: 5 + rand() * 6,
    periodX: 4500 + rand() * 4500,
    periodY: 4500 + rand() * 4500,
    phaseX: rand() * Math.PI * 2,
    phaseY: rand() * Math.PI * 2,
  };
}

// 'worklet' - runs on the UI thread inside useDerivedValue below, must not
// close over anything but plain data/other worklets.
function wanderAt(p: WanderParams, timeMs: number): Pt {
  'worklet';
  return [
    p.ampX * Math.sin((timeMs / p.periodX) * Math.PI * 2 + p.phaseX),
    p.ampY * Math.sin((timeMs / p.periodY) * Math.PI * 2 + p.phaseY),
  ];
}

const STARS_8_WANDER = STARS_8.map((_, i) => makeWander(1000 + i));
const STARS_5_WANDER = STARS_5.map((_, i) => makeWander(2000 + i));
const RING1_WANDER = RING1_ORIGIN.map((_, i) => makeWander(3000 + i));
const RING2_WANDER = RING2_ORIGIN.map((_, i) => makeWander(4000 + i));

// Each star glides the *whole* way from t=0 up to its threshold, arriving
// exactly as the arc sweep reaches that angle — a long, slow drift rather
// than a quick last-moment dash (2026-08-09 review: "звёзды очень резко
// скачут... без рывков"). The 12-o'clock star (threshold 0) still gets a
// short window so it's essentially already in place before the line starts.
function arrivalWindow(threshold: number): [number, number] {
  if (threshold === 0) return [0, 0.02];
  return [0, threshold];
}

// 'worklet'
function clamp01(v: number) {
  'worklet';
  return Math.min(1, Math.max(0, v));
}

// Slow start, slow finish - reads as a natural, unhurried drift rather than
// a fast dash that decelerates (ease-out alone) or a mechanical straight line.
// 'worklet'
function smoothstep(t: number) {
  'worklet';
  return t * t * (3 - 2 * t);
}

function Star({
  cx,
  cy,
  r,
  coreR,
  glowOpacity = 1,
}: {
  cx: SharedValue<number>;
  cy: SharedValue<number>;
  r: number;
  coreR: number;
  glowOpacity?: number;
}) {
  return (
    <>
      <Group opacity={glowOpacity}>
        <Blur blur={6} />
        <Circle cx={cx} cy={cy} r={r} color={GLOW} />
      </Group>
      <Circle cx={cx} cy={cy} r={coreR} color={CORE} />
    </>
  );
}

// One ambient-only wandering star - position is a pure function of `time`,
// no ring choreography.
function WanderStar({ base, wander, r, coreR, time }: { base: Pt; wander: WanderParams; r: number; coreR: number; time: SharedValue<number> }) {
  const cx = useDerivedValue(() => base[0] + wanderAt(wander, time.value)[0], [time]);
  const cy = useDerivedValue(() => base[1] + wanderAt(wander, time.value)[1], [time]);
  return <Star cx={cx} cy={cy} r={r} coreR={coreR} />;
}

// One ring star - wanders freely until its arrival window, then glides onto
// its ring destination as `ringProgress` sweeps past its threshold.
function RingStar({
  from,
  to,
  threshold,
  wander,
  time,
  ringProgress,
}: {
  from: Pt;
  to: Pt;
  threshold: number;
  wander: WanderParams;
  time: SharedValue<number>;
  ringProgress: SharedValue<number>;
}) {
  const [arrivalStart, arrivalEnd] = arrivalWindow(threshold);
  const cx = useDerivedValue(() => {
    const t = clamp01((ringProgress.value - arrivalStart) / (arrivalEnd - arrivalStart));
    const eased = smoothstep(t);
    const dx = wanderAt(wander, time.value)[0];
    return from[0] + (to[0] - from[0]) * eased + dx * (1 - eased);
  }, [time, ringProgress]);
  const cy = useDerivedValue(() => {
    const t = clamp01((ringProgress.value - arrivalStart) / (arrivalEnd - arrivalStart));
    const eased = smoothstep(t);
    const dy = wanderAt(wander, time.value)[1];
    return from[1] + (to[1] - from[1]) * eased + dy * (1 - eased);
  }, [time, ringProgress]);
  return <Star cx={cx} cy={cy} r={17.5} coreR={3.5} glowOpacity={0.14} />;
}

export function PersonalizationIllustration({
  width,
  height,
  time,
  ring1Progress,
  ring2Progress,
  checkProgress,
}: {
  width: number;
  height: number;
  time: SharedValue<number>;
  ring1Progress: SharedValue<number>;
  ring2Progress: SharedValue<number>;
  checkProgress: SharedValue<number>;
}) {
  const scale = width / CANVAS_W;
  const checkVisible = useDerivedValue(() => (checkProgress.value > 0 ? 1 : 0), [checkProgress]);

  return (
    <Canvas style={{ width, height }}>
      <Group transform={[{ scale }]}>
        {STARS_8.map((base, i) => (
          <WanderStar key={`s8-${i}`} base={base} wander={STARS_8_WANDER[i]} r={4} coreR={1} time={time} />
        ))}
        {STARS_5.map((base, i) => (
          <WanderStar key={`s5-${i}`} base={base} wander={STARS_5_WANDER[i]} r={2.5} coreR={0.625} time={time} />
        ))}

        {RING1_ORIGIN.map((from, i) => (
          <RingStar
            key={`r1-${i}`}
            from={from}
            to={RING1_DEST[i]}
            threshold={RING1_THRESHOLDS[i]}
            wander={RING1_WANDER[i]}
            time={time}
            ringProgress={ring1Progress}
          />
        ))}
        {RING2_ORIGIN.map((from, i) => (
          <RingStar
            key={`r2-${i}`}
            from={from}
            to={RING2_DEST[i]}
            threshold={RING2_THRESHOLDS[i]}
            wander={RING2_WANDER[i]}
            time={time}
            ringProgress={ring2Progress}
          />
        ))}

        <Path path={RING1_PATH} start={0} end={ring1Progress} style="stroke" strokeWidth={0.6} color={CORE} opacity={0.6} />
        <Path path={RING2_PATH} start={0} end={ring2Progress} style="stroke" strokeWidth={0.6} color={CORE} opacity={0.6} />

        <Group transform={CHECK_TRANSFORM} opacity={checkVisible}>
          <Group>
            <Blur blur={4.5} />
            <Path path={CHECK_PATH} start={0} end={checkProgress} color={GLOW} />
          </Group>
          <Path path={CHECK_PATH} start={0} end={checkProgress} color={GLOW} />
        </Group>
      </Group>
    </Canvas>
  );
}
