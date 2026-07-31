import { useEffect } from 'react';
import {
  Canvas,
  Circle,
  Group,
  Blur,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
  type SkFont,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

// 1:1 port of src/app/components/soma-logo-animation.tsx (Figma Make export,
// "Логотип с анимацией" file) — same constants/timeline/colors, just re-expressed
// as Skia + Reanimated since RN can't run embedded SVG <style>/SMIL animation.
// Native SVG filters (feGaussianBlur/feMorphology) aren't 1:1 in Skia either —
// the orbiting dot's glow is approximated with three stacked blurred circles
// instead of the original's dilate+double-blend filter chain, and the 4-layer
// text glow stack is approximated with 2 passes (blurred halo + crisp). Skia's
// Text has no letter-spacing prop, so "Soma" is laid out char-by-char to match
// the source's letterSpacing="7".
//
// Original design canvas is 480×480 with R=115; `size` scales the whole thing.

const DESIGN = 480;
const R = 115;
const CX = DESIGN / 2;
const CY = DESIGN / 2;
const LETTER_SPACING = 7;

const BEGIN = 0.6;
const DRAW_DUR = 3.8;
const TEXT_DELAY = BEGIN + DRAW_DUR + 0.5; // 4.9s
const TEXT_DUR = 2.0;
const PULSE_START = TEXT_DELAY + 0.8; // 5.7s
const PULSE_DUR = 3.0;

const C_OUTER = '#8B7CF6';
const C_MID = '#A99CF8';
const C_INNER = '#C4BBFA';
const C_DOT = '#8B7CF6';
const C_TEXT = '#DDD9FF';

const SPLINE = Easing.bezierFn(0.4, 0, 0.6, 1);

// piecewise draw-glow opacity keyframes from the source's @keyframes soma-draw-glow
const DRAW_GLOW_STOPS = [0, 0.1, 0.3, 0.6, 0.85, 1];
const DRAW_GLOW_VALUES = [0.06, 0.13, 0.3, 0.58, 0.82, 1];

function interpolateStops(t: number, stops: number[], values: number[]) {
  'worklet';
  if (t <= stops[0]) return values[0];
  if (t >= stops[stops.length - 1]) return values[values.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i] && t <= stops[i + 1]) {
      const span = stops[i + 1] - stops[i];
      const local = span === 0 ? 0 : (t - stops[i]) / span;
      return values[i] + (values[i + 1] - values[i]) * local;
    }
  }
  return values[values.length - 1];
}

function SpacedText({
  text,
  font,
  centerX,
  y,
  color,
  opacity,
  blur,
}: {
  text: string;
  font: SkFont;
  centerX: number;
  y: number;
  color: string;
  opacity?: number | ReturnType<typeof useDerivedValue<number>>;
  blur?: number;
}) {
  const chars = text.split('');
  const widths = chars.map((c) => font.getTextWidth(c));
  const totalWidth = widths.reduce((a, b) => a + b, 0) + LETTER_SPACING * (chars.length - 1);
  let cursor = centerX - totalWidth / 2;
  const glyphs = chars.map((c, i) => {
    const x = cursor;
    cursor += widths[i] + LETTER_SPACING;
    return (
      <SkiaText key={i} text={c} font={font} x={x} y={y} color={color} />
    );
  });
  return (
    <Group opacity={opacity}>
      {blur ? <Blur blur={blur} /> : null}
      {glyphs}
    </Group>
  );
}

export function SomaLogoAnimation({ size = 260, animationKey = 0 }: { size?: number; animationKey?: number }) {
  const scale = size / DESIGN;
  const font = useFont(require('@expo-google-fonts/nunito-sans/300Light/NunitoSans_300Light.ttf'), 30);

  // 0 -> 1 over DRAW_DUR, delayed BEGIN, linear (matches stroke-dashoffset / animateMotion timing)
  const draw = useSharedValue(0);
  // 0 -> 1 over 0.7s, delayed BEGIN (dot opacity fade-in)
  const dotFade = useSharedValue(0);
  // "Soma" text opacity
  const textOpacity = useSharedValue(0);
  // breathing pulse, staggered per layer (ring outer/mid/inner + text), infinite after draw settles
  const pulseRing0 = useSharedValue(1);
  const pulseRing1 = useSharedValue(1);
  const pulseRing2 = useSharedValue(1);
  const pulseText = useSharedValue(1);

  useEffect(() => {
    draw.value = 0;
    dotFade.value = 0;
    textOpacity.value = 0;
    pulseRing0.value = 1;
    pulseRing1.value = 1;
    pulseRing2.value = 1;
    pulseText.value = 1;

    draw.value = withDelay(BEGIN * 1000, withTiming(1, { duration: DRAW_DUR * 1000, easing: Easing.linear }));
    dotFade.value = withDelay(BEGIN * 1000, withTiming(1, { duration: 700, easing: Easing.linear }));
    textOpacity.value = withDelay(
      TEXT_DELAY * 1000,
      withTiming(1, { duration: TEXT_DUR * 1000, easing: Easing.out(Easing.quad) })
    );

    const breathe = (offsetSec: number, target: typeof pulseRing0) => {
      target.value = withDelay(
        (PULSE_START + offsetSec) * 1000,
        withRepeat(
          withSequence(
            withTiming(0.52, { duration: (PULSE_DUR / 2) * 1000, easing: Easing.inOut(Easing.quad) }),
            withTiming(1, { duration: (PULSE_DUR / 2) * 1000, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          false
        )
      );
    };
    breathe(0, pulseRing0);
    breathe(0.15, pulseRing1);
    breathe(0.3, pulseRing2);
    breathe(0.5, pulseText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey]);

  // Built as an explicit arc starting at 12 o'clock (-90°) sweeping 360° clockwise —
  // NOT Skia's addCircle, whose own start point/winding direction doesn't match the
  // dot's angle formula below, which was the root cause of the dot drifting out of
  // sync with the ring's trimmed (drawn) arc.
  const ringPath = Skia.Path.Make();
  ringPath.addArc(Skia.XYWHRect(CX - R, CY - R, R * 2, R * 2), -90, 360);

  const outerOpacity = useDerivedValue(() => interpolateStops(draw.value, DRAW_GLOW_STOPS, DRAW_GLOW_VALUES) * pulseRing0.value);
  const midOpacity = useDerivedValue(() => interpolateStops(draw.value, DRAW_GLOW_STOPS, DRAW_GLOW_VALUES) * pulseRing1.value);
  const innerOpacity = useDerivedValue(() => interpolateStops(draw.value, DRAW_GLOW_STOPS, DRAW_GLOW_VALUES) * pulseRing2.value);
  const coreEnd = useDerivedValue(() => draw.value);

  const angle = useDerivedValue(() => -Math.PI / 2 + draw.value * Math.PI * 2);
  const dotR = useDerivedValue(() => 2 + SPLINE(draw.value) * 3);
  const dotCx = useDerivedValue(() => CX + R * Math.cos(angle.value));
  const dotCy = useDerivedValue(() => CY + R * Math.sin(angle.value));
  const dotOpacity = useDerivedValue(() => dotFade.value);

  const textHaloAlpha = useDerivedValue(() => textOpacity.value * pulseText.value * 0.7);
  const textSharpAlpha = useDerivedValue(() => textOpacity.value * pulseText.value);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Canvas style={{ width: size, height: size }}>
        <Group transform={[{ scale }]}>
          {/* Outer halo — trimmed to the same arc as the dot's progress, not a full faint circle
              from frame 0, so the glow visibly leads/trails the dot instead of "already being there" */}
          <Group opacity={outerOpacity}>
            <Path path={ringPath} style="stroke" strokeWidth={22} color={C_OUTER} opacity={0.28} start={0} end={coreEnd}>
              <Blur blur={18} />
            </Path>
          </Group>
          {/* Mid glow */}
          <Group opacity={midOpacity}>
            <Path path={ringPath} style="stroke" strokeWidth={9} color={C_MID} opacity={0.6} start={0} end={coreEnd}>
              <Blur blur={8} />
            </Path>
          </Group>
          {/* Inner glow */}
          <Group opacity={innerOpacity}>
            <Path path={ringPath} style="stroke" strokeWidth={3.5} color={C_INNER} opacity={0.9} start={0} end={coreEnd}>
              <Blur blur={3} />
            </Path>
          </Group>
          {/* Core crisp ring — actually draws (trims) rather than just fading */}
          <Path path={ringPath} style="stroke" strokeWidth={1.2} color="white" start={0} end={coreEnd} />

          {/* Orbital dot — 3-layer glow (wide soft halo, tighter mid glow, bright core) so it reads
              as a real glowing point rather than a faint smudge; sits exactly at the drawn arc's
              tip since it shares the same `draw`/coreEnd progress value as the ring above. */}
          <Group opacity={dotOpacity}>
            <Circle cx={dotCx} cy={dotCy} r={dotR} color={C_OUTER} opacity={0.45}>
              <Blur blur={16} />
            </Circle>
            <Circle cx={dotCx} cy={dotCy} r={dotR} color={C_DOT} opacity={0.9}>
              <Blur blur={6} />
            </Circle>
            <Circle cx={dotCx} cy={dotCy} r={dotR} color="white">
              <Blur blur={1.5} />
            </Circle>
          </Group>

          {/* "Soma" — blurred halo pass + crisp pass, standing in for the source's 4-layer stack */}
          {font && (
            <>
              <SpacedText text="Soma" font={font} centerX={CX} y={CY + 10} color={C_TEXT} opacity={textHaloAlpha} blur={10} />
              <SpacedText text="Soma" font={font} centerX={CX} y={CY + 10} color={C_TEXT} opacity={textSharpAlpha} />
            </>
          )}
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
