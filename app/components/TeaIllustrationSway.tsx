import { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const IMAGE_W = 193;
const IMAGE_H = 360;

// Only the upper ~42% of the artwork (the sparser, thinner tips) sways -
// the lower/denser cluster near the base stays still. See the comment below
// for why this used to be two independently-rotating bands and no longer is.
const UPPER_BAND_H = 150;
const LOWER_BAND_H = IMAGE_H - UPPER_BAND_H;

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// Care screen's "Чай как ритуал" illustration, take 6.
//
// Glow history (all previous attempts to put a glow behind this artwork):
// Skia Canvas rendered nothing at all in this environment; RN Image's
// blurRadius/tintColor combo apparently no-op'd here too; react-native-svg's
// FeGaussianBlur (the one blur primitive with a proven track record
// elsewhere in this app) never got confirmed either way - and once the
// sway animation below was added, it produced a new, concrete, confirmed
// bug: "при покачивании на заднем фоне видно как будто какой-то нижний
// слой расплывчатый веток" (a blurred "ghost" branch layer visible during
// the sway) - the glow was only ever attached to the LOWER band's (much
// smaller) rotation, so as the upper crisp tips swayed more, the glow
// underneath them visibly lagged/diverged from the crisp art it was
// supposed to sit behind. Rather than keep chasing a glow that's never
// been confirmed to even render correctly at rest, dropped it entirely -
// this file no longer renders any glow, just the swaying artwork itself.
// (Renamed from TeaIllustrationGlow.tsx to match.)
//
// Sway history: first pass rotated the whole illustration as one rigid
// body - read as "dead" ("не весь куст вот так мертво качался, а именно
// веточки, немного по-разному"). Reworked into two nested, independently-
// rotating crop bands (lower "trunk" + upper "tips", the upper nested
// inside the lower's transform) - she liked the tip-sway itself but flagged
// a second, unwanted motion axis: "у тебя там есть еще анимация которая
// как-то сверху вниз качает, это неестественно". Two simultaneously
// rotating parent/child transforms compounding into a wobble along an axis
// neither was individually animating is exactly the kind of artifact that
// setup risks, and isn't worth chasing blind without a device to check
// against - simplified instead: the lower band is now a plain, completely
// static `View` (no transform, no Animated import needed for it), and only
// the upper "tips" band still moves - a single, clean oscillation, nothing
// to compound with.
//
// Still had one more artifact even after that simplification: "веточка
// лаванды с самого левого края странно анимируется, ее верхняя часть ходит
// вверх вниз" - a real, well-understood consequence of `rotate` on an
// asymmetric composition. Rotating around a CENTERED pivot moves any point
// offset horizontally from that center along an arc, and that arc has a
// real vertical component proportional to the point's horizontal distance
// from the pivot (`dx * sin(angle)`) - the further left/right a branch
// sits from center, the more it visibly bobs up/down as the whole band
// rotates, on top of swinging sideways. Fixed by switching `rotate` to
// `skewX`: a shear transform shifts every point horizontally by an amount
// proportional to its *vertical* distance from the transform origin, and
// leaves Y completely untouched for every point regardless of X - so
// nothing can bob vertically, ever, no matter how far left or right a
// given branch sits. `transformOrigin:'50% 100%'` still anchors the shear
// to zero movement at the very bottom (the band's own base) and maximum
// lean at the top, same "rooted, sways more at the tips" feel as before,
// just via the transform primitive that's actually free of the bug.
function useSway(amplitude: number, duration: number) {
  const angle = useSharedValue(0);
  useEffect(() => {
    angle.value = withRepeat(
      withSequence(
        withTiming(amplitude, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(-amplitude, { duration: duration * 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return angle;
}

export function TeaIllustrationSway() {
  const upperAngle = useSway(3.5, 1500);
  const upperStyle = useAnimatedStyle(() => ({ transform: [{ skewX: `${upperAngle.value}deg` }] }));

  return (
    <View style={{ width: IMAGE_W, height: IMAGE_H }}>
      {/* Lower/"trunk" band - static, shows the bottom LOWER_BAND_H slice of
          the artwork via a clip window + the full image shifted down to its
          natural position within it. */}
      <View style={{ position: 'absolute', bottom: 0, width: IMAGE_W, height: LOWER_BAND_H, overflow: 'hidden' }}>
        <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ position: 'absolute', bottom: 0, width: IMAGE_W, height: IMAGE_H }} />
      </View>

      {/* Upper/"tips" band - the only thing that moves, pinned to sway from
          its own base (transformOrigin) so it reads as rooted, not a
          windshield wiper. */}
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
    </View>
  );
}
