import { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Image as SvgImage, Defs, Filter, FeGaussianBlur } from 'react-native-svg';

const IMAGE_W = 193;
const IMAGE_H = 360;
// Bleed room so the blurred passes have somewhere to spread into without
// getting clipped at the artwork's own tight bounds.
const GLOW_PAD = 40;
const CANVAS_W = IMAGE_W + GLOW_PAD * 2;
const CANVAS_H = IMAGE_H + GLOW_PAD * 2;

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// Care screen's "Чай как ритуал" illustration glow, take 5. Two prior
// attempts both produced literally nothing visible:
//  - take 3/4 used Skia (Canvas+useImage+Blur, then RN Image's own
//    blurRadius+tintColor) - both came back "нет его" / "вообще нет
//    свечения". The artwork itself DOES have real alpha (verified directly:
//    ~85% of its pixels are fully transparent - it's genuinely sparse
//    constellation-style line art, not a flattened opaque rectangle), so
//    the alpha wasn't the problem - `useImage`/Canvas rendering nothing at
//    all is a confirmed separate Skia/Expo-Go gap (see
//    project_skia_reanimated_bridge.md for the first one, this is a
//    second, unrelated one), and RN Image's blurRadius/tintColor combo
//    apparently isn't taking effect in this exact environment either.
//  - This take drops both and uses `react-native-svg`'s own `FeGaussianBlur`,
//    the one blur primitive already CONFIRMED working in this exact app
//    (NavIcon's active-glow, BiorhythmChart's rings) - unlike `FeDropShadow`,
//    confirmed broken here. `react-native-svg` has a native `Image` element
//    (`href` accepts the same `source` shape as RN's own `Image`) that
//    filters apply to like any other SVG content, real alpha included.
//    Filter region padded generously (x/y -150%, width/height 400%) -
//    BottomBar's own glow saga found the SVG default filter region clips a
//    wide blur's spread.
//
// 2026-08-26: added a gentle sway ("слегка от ветра космического
// колышится") - Reanimated `withRepeat`/`withSequence`/`withTiming`, the
// exact same pattern StyleSwatch.tsx's `SwayingTree` already uses and ships
// with (not Skia, and not a new untested pattern - Reanimated driving plain
// View transforms is unrelated to the confirmed-broken Reanimated-into-Skia
// bridge, see project_skia_reanimated_bridge.md). `transformOrigin:'50%
// 100%'` pins the rotation to the very bottom of the component's own
// IMAGE_W×IMAGE_H box (not its center) so it pivots like a real plant rooted
// at its base, not a windshield wiper - the glow's own larger canvas is a
// child riding along with the same rotation, absolutely positioned outside
// the box's bounds rather than baked into the component's own layout size
// (so CareScreen's wrapping margin no longer needs to compensate for glow
// bleed padding - removed there too).
export function TeaIllustrationGlow() {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withSequence(
        withTiming(2.5, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2.5, { duration: 3500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: IMAGE_W, height: IMAGE_H, transformOrigin: '50% 100%' }, style]}>
      <Svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', top: -GLOW_PAD, left: -GLOW_PAD }} pointerEvents="none">
        <Defs>
          <Filter id="teaGlowWide" x="-150%" y="-150%" width="400%" height="400%">
            <FeGaussianBlur stdDeviation={14} />
          </Filter>
          <Filter id="teaGlowTight" x="-150%" y="-150%" width="400%" height="400%">
            <FeGaussianBlur stdDeviation={6} />
          </Filter>
        </Defs>
        <SvgImage href={TEA_ILLUSTRATION} x={GLOW_PAD} y={GLOW_PAD} width={IMAGE_W} height={IMAGE_H} opacity={0.5} filter="url(#teaGlowWide)" />
        <SvgImage href={TEA_ILLUSTRATION} x={GLOW_PAD} y={GLOW_PAD} width={IMAGE_W} height={IMAGE_H} opacity={0.6} filter="url(#teaGlowTight)" />
        <SvgImage href={TEA_ILLUSTRATION} x={GLOW_PAD} y={GLOW_PAD} width={IMAGE_W} height={IMAGE_H} opacity={0.6} filter="url(#teaGlowTight)" />
      </Svg>
      <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ width: IMAGE_W, height: IMAGE_H }} />
    </Animated.View>
  );
}
