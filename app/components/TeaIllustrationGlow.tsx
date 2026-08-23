import { View } from 'react-native';
import { Canvas, Image as SkiaImage, useImage, Blur, Group } from '@shopify/react-native-skia';

const IMAGE_W = 193;
const IMAGE_H = 360;
// Bleed room around the artwork for the blur passes below to spill into
// without getting clipped by the Canvas's own bounds.
export const TEA_GLOW_PAD = 44;
const CANVAS_W = IMAGE_W + TEA_GLOW_PAD * 2;
const CANVAS_H = IMAGE_H + TEA_GLOW_PAD * 2;

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// Care screen's "Чай как ритуал" illustration glow, take 3. Her ask after
// seeing the box/oval versions: "мне надо чтобы по контуру само травки,
// чтобы динамичная линия шла... и не идеальной формы" - a rectangle or an
// oval (this session's earlier attempts) can never satisfy that; neither
// SVG nor boxShadow can trace a raster PNG's actual alpha silhouette. Skia
// can - genuine gaussian blur of the artwork's own rendered pixels (real
// alpha included), same primitive PersonalizationIllustration.tsx already
// uses for its checkmark glow (Group > Blur > shape, then the crisp shape
// again on top). No color tint needed: the source art is already drawn in
// the app's own violet/starry palette, so blurring it directly reads as a
// natural cosmic glow rather than a geometric shape glued behind it. Two
// increasingly-blurred, increasingly-faint passes (not one strong one) per
// her "не сильно ярко" - a soft ambient aura, not a bright ring.
export function TeaIllustrationGlow() {
  const img = useImage(TEA_ILLUSTRATION);
  if (!img) return null;
  return (
    <View style={{ width: CANVAS_W, height: CANVAS_H }} pointerEvents="none">
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>
        <Group opacity={0.28}>
          <Blur blur={20} />
          <SkiaImage image={img} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} fit="contain" />
        </Group>
        <Group opacity={0.4}>
          <Blur blur={9} />
          <SkiaImage image={img} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} fit="contain" />
        </Group>
        <SkiaImage image={img} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} fit="contain" />
      </Canvas>
    </View>
  );
}
