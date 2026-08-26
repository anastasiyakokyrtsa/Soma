import { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Image as SvgImage, Defs, Filter, FeGaussianBlur } from 'react-native-svg';

const IMAGE_W = 193;
const IMAGE_H = 360;
// Bleed room so the blurred passes have somewhere to spread into without
// getting clipped at the artwork's own tight bounds.
const GLOW_PAD = 40;
const CANVAS_W = IMAGE_W + GLOW_PAD * 2;
const CANVAS_H = IMAGE_H + GLOW_PAD * 2;

// Where the crisp artwork is split for the two-tier sway below - the lower
// ~58% (thicker, denser cluster near the base) barely moves, the upper
// ~42% (the sparser, thinner tips that dominate the top of this specific
// illustration) sways more, with its own independent phase/speed. Not an
// exact anatomical split (this is still one flattened raster image, not
// separate per-branch layers - see the sway comment below for why), just a
// reasonable two-band approximation of where the artwork visually reads as
// "trunk" vs "tips".
const LOWER_BAND_H = 210;
const UPPER_BAND_H = IMAGE_H - LOWER_BAND_H;

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
// 2026-08-26: sway added, then reworked same day per direct feedback. First
// pass rotated the whole illustration as one rigid body - she flagged it
// read as "dead" ("не весь куст вот так мертво качался, а именно веточки,
// немного по-разному, как будто ветер ласкает, как в жизни"). A single
// PNG has no separate per-branch layers to animate independently (this
// isn't vector art with individual branch paths - checked, no such source
// exists in this project, only flattened screenshots/exports) - the closest
// achievable approximation without new art assets is a two-tier hierarchical
// sway, the same trick 2D games use for wind-blown foliage: split the
// artwork into a lower "trunk" band and an upper "tips" band via two nested
// overflow:hidden crop windows showing different slices of the SAME image,
// then rotate each independently - the upper band is a CHILD of the lower
// band's Animated.View, so it inherits the lower band's motion and adds its
// own on top (real transform composition, not a hack - same nesting Skia/
// CSS/SVG all do). Lower band: barely moves (±1°, slow). Upper band: sways
// more (±3.5°) on its own faster, phase-shifted cycle, so the two bands
// visibly move differently rather than in lockstep - reads as "the tips
// catch the wind more than the base" instead of one rigid rotation.
// Reanimated `withRepeat`/`withSequence`/`withTiming`/`withDelay`, the same
// pattern StyleSwatch.tsx's `SwayingTree` already ships with (not Skia,
// which has proven unreliable in this environment today - see
// project_skia_reanimated_bridge.md).
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

export function TeaIllustrationGlow() {
  const lowerAngle = useSway(1, 2200);
  const upperAngle = useSway(3.5, 1500, 300);

  const lowerStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${lowerAngle.value}deg` }] }));
  const upperStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${upperAngle.value}deg` }] }));

  return (
    <View style={{ width: IMAGE_W, height: IMAGE_H }}>
      {/* Glow stays a single soft layer, riding the lower/base band's own
          motion only - it's blurred enough that a perfectly-matched
          two-tier sway underneath it wouldn't read as a visible difference,
          not worth doubling the glow's own layer count for. */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, width: IMAGE_W, height: LOWER_BAND_H, transformOrigin: '50% 100%' }, lowerStyle]}>
        <Svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', bottom: -GLOW_PAD, left: -GLOW_PAD }}
          pointerEvents="none"
        >
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

        {/* Lower/"trunk" band - shows only the bottom LOWER_BAND_H slice of
            the artwork, via a clip window + the full image shifted down to
            its natural position within it. */}
        <View style={{ width: IMAGE_W, height: LOWER_BAND_H, overflow: 'hidden' }}>
          <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ position: 'absolute', bottom: 0, width: IMAGE_W, height: IMAGE_H }} />
        </View>

        {/* Upper/"tips" band - nested inside the lower band's Animated.View
            (inherits its rotation), positioned directly above it, with its
            own independent sway added on top. */}
        <Animated.View
          style={[
            { position: 'absolute', bottom: LOWER_BAND_H, left: 0, width: IMAGE_W, height: UPPER_BAND_H, transformOrigin: '50% 100%' },
            upperStyle,
          ]}
        >
          <View style={{ width: IMAGE_W, height: UPPER_BAND_H, overflow: 'hidden' }}>
            <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ position: 'absolute', bottom: -LOWER_BAND_H, width: IMAGE_W, height: IMAGE_H }} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
