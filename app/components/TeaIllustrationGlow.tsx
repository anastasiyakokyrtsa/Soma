import { View, Image, StyleSheet } from 'react-native';
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
// again on top).
//
// Take 3 shipped with the glow AND the crisp artwork both drawn inside the
// Skia Canvas, gated behind `useImage` resolving - "вообще нет никакого
// свечения" came back, and since it's a single sandbox with no on-device
// check possible here, that report can't distinguish "the blur genuinely
// isn't visible" from "useImage never resolved so the whole Canvas rendered
// nothing" (this app already hit one confirmed Skia/Expo-Go environment gap
// this session - see project_skia_reanimated_bridge.md - so a second one
// isn't out of the question). De-risked both at once: the crisp artwork is
// back to a plain RN `Image` rendered unconditionally (identical to every
// version before this Skia rework - can't fail to appear), and ONLY the
// blur passes live in the Skia Canvas, now much stronger (blur 12->26,
// opacity 0.4->0.65) - the source art is sparse constellation-style dots/
// thin lines, not a solid-filled shape like the checkmark this pattern was
// copied from, so it has far less pixel coverage for a blur to work with
// and needs real intensity to read as a glow rather than washing out to
// near-nothing.
export function TeaIllustrationGlow() {
  const img = useImage(TEA_ILLUSTRATION);
  return (
    <View style={{ width: CANVAS_W, height: CANVAS_H, alignItems: 'center', justifyContent: 'center' }}>
      {img ? (
        <Canvas style={[StyleSheet.absoluteFillObject]} pointerEvents="none">
          <Group opacity={0.55}>
            <Blur blur={26} />
            <SkiaImage image={img} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} fit="contain" />
          </Group>
          <Group opacity={0.65}>
            <Blur blur={12} />
            <SkiaImage image={img} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} fit="contain" />
          </Group>
        </Canvas>
      ) : null}
      <Image source={TEA_ILLUSTRATION} style={{ width: IMAGE_W, height: IMAGE_H }} resizeMode="contain" />
    </View>
  );
}
