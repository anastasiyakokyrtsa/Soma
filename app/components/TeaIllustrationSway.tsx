import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Image as SvgImage, Defs, LinearGradient, Stop, Mask, Rect } from 'react-native-svg';

const IMAGE_W = 193;
const IMAGE_H = 360;

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// Three soft-masked zones (fractions of IMAGE_H from the top), each fade
// mirrored between neighbors so the three gradients sum to full opacity
// everywhere - verified by hand (see the sway history comment below).
const TIP_END = 0.22;
const TIP_FADE_END = 0.34;
const MID_END = 0.55;
const MID_FADE_END = 0.67;

// Care screen's "Чай как ритуал" illustration, take 8.
//
// Glow history: Skia Canvas rendered nothing at all in this environment; RN
// Image's blurRadius/tintColor combo apparently no-op'd here too;
// react-native-svg's FeGaussianBlur never got confirmed working either.
// Dropped entirely - this file renders no glow, just the swaying artwork.
// (Renamed from TeaIllustrationGlow.tsx to match.)
//
// Sway history, in order - each fixed a real, confirmed problem the
// previous one had, not a matter of taste:
//  1. Whole illustration rotated as one rigid body - "не весь куст вот так
//     мертво качался, а именно веточки, немного по-разному".
//  2. Split into two hard-cropped rectangular bands (static base + rotating
//     tips). Fixed the "dead" feel, but (a) rotating an off-center branch
//     around a centered pivot bobs it vertically (`dx*sin(angle)`), and
//     (b) a hard rectangular crop boundary is visible as soon as the two
//     pieces move differently - a screenshot showed it plainly: "верхняя
//     часть травы как будто отрубленная ездит туда сюда".
//  3. Single `skewX` on the WHOLE unsplit image - no crop, no seam, no
//     vertical bob (skew never touches Y). But then the entire silhouette
//     reads as one rigid thing sliding, not real wind through branches:
//     "весь куст ездит туда сюда... надо чтобы ветки колыхались причем
//     немного асинхронно, а ствол внизу все-таки стоял".
//  4. This take: same artwork, drawn 3 times as full-size layers (never
//     cropped - no rectangular boundary can ever show), each layer masked
//     to a different vertical zone via a soft (gradient, not hard-edged)
//     SVG `<Mask>`, so the zones blend into each other instead of cutting.
//     At rest the three masks sum to exactly 1 everywhere (verified by
//     hand), reconstructing the original image with zero seam. The bottom
//     "trunk" layer has no animation at all - genuinely static, not just a
//     small rotation. The "mid" and "tip" layers each get their own
//     independent `skewX` (different amplitude/speed/phase, `withDelay`
//     staggers their start) so the upper two-thirds sway asynchronously
//     relative to each other, not as one unit - closer to "ветки колыхались
//     немного асинхронно" than any single-transform approach can get
//     without real per-branch vector art (checked again: none exists for
//     this illustration). `transformOrigin` for every animated layer is the
//     WHOLE image's own base ('50% 100%' of the full IMAGE_H canvas, not
//     each layer's own visible zone) so displacement stays physically
//     proportional to real height above the plant's actual root, even for
//     the tip layer.
function useSway(amplitude: number, duration: number, delay = 0) {
  const angle = useSharedValue(0);
  useEffect(() => {
    angle.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(amplitude, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(-amplitude, { duration: duration * 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return angle;
}

function MaskedArtwork({ gradientId, maskId, stops }: { gradientId: string; maskId: string; stops: { offset: number; opacity: number }[] }) {
  return (
    <Svg width={IMAGE_W} height={IMAGE_H} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s, i) => (
            <Stop key={i} offset={s.offset} stopColor="#fff" stopOpacity={s.opacity} />
          ))}
        </LinearGradient>
        <Mask id={maskId}>
          <Rect x={0} y={0} width={IMAGE_W} height={IMAGE_H} fill={`url(#${gradientId})`} />
        </Mask>
      </Defs>
      <SvgImage href={TEA_ILLUSTRATION} x={0} y={0} width={IMAGE_W} height={IMAGE_H} mask={`url(#${maskId})`} />
    </Svg>
  );
}

export function TeaIllustrationSway() {
  const midAngle = useSway(2, 1800);
  const tipAngle = useSway(3, 1300, 200);

  const midStyle = useAnimatedStyle(() => ({ transform: [{ skewX: `${midAngle.value}deg` }] }));
  const tipStyle = useAnimatedStyle(() => ({ transform: [{ skewX: `${tipAngle.value}deg` }] }));

  return (
    <View style={{ width: IMAGE_W, height: IMAGE_H }}>
      {/* Trunk - fully static, no wrapping Animated.View at all. */}
      <MaskedArtwork
        gradientId="trunkGrad"
        maskId="trunkMask"
        stops={[
          { offset: 0, opacity: 0 },
          { offset: MID_END, opacity: 0 },
          { offset: MID_FADE_END, opacity: 1 },
          { offset: 1, opacity: 1 },
        ]}
      />
      {/* Mid branches - own independent sway. */}
      <Animated.View style={[{ width: IMAGE_W, height: IMAGE_H, transformOrigin: '50% 100%' }, midStyle]}>
        <MaskedArtwork
          gradientId="midGrad"
          maskId="midMask"
          stops={[
            { offset: 0, opacity: 0 },
            { offset: TIP_END, opacity: 0 },
            { offset: TIP_FADE_END, opacity: 1 },
            { offset: MID_END, opacity: 1 },
            { offset: MID_FADE_END, opacity: 0 },
            { offset: 1, opacity: 0 },
          ]}
        />
      </Animated.View>
      {/* Tips - faster, wider, phase-delayed sway of its own. */}
      <Animated.View style={[{ width: IMAGE_W, height: IMAGE_H, transformOrigin: '50% 100%' }, tipStyle]}>
        <MaskedArtwork
          gradientId="tipGrad"
          maskId="tipMask"
          stops={[
            { offset: 0, opacity: 1 },
            { offset: TIP_END, opacity: 1 },
            { offset: TIP_FADE_END, opacity: 0 },
            { offset: 1, opacity: 0 },
          ]}
        />
      </Animated.View>
    </View>
  );
}
