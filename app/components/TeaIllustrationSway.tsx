import { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const IMAGE_W = 193;
const IMAGE_H = 360;

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// Care screen's "Чай как ритуал" illustration, take 7.
//
// Glow history (all previous attempts to put a glow behind this artwork):
// Skia Canvas rendered nothing at all in this environment; RN Image's
// blurRadius/tintColor combo apparently no-op'd here too; react-native-svg's
// FeGaussianBlur (the one blur primitive with a proven track record
// elsewhere in this app) never got confirmed working either. Dropped
// entirely - this file renders no glow, just the swaying artwork itself.
// (Renamed from TeaIllustrationGlow.tsx to match.)
//
// Sway history, in order:
//  1. Whole illustration rotated as one rigid body - read as "dead" ("не
//     весь куст вот так мертво качался, а именно веточки, немного
//     по-разному").
//  2. Split into two crop bands (static "trunk" + rotating "tips", the tips
//     band nested inside so its motion composed) - fixed the "dead" feel,
//     but rotating an off-center point (the leftmost lavender branch) around
//     a centered pivot moves it along an arc with a real vertical component
//     ("веточка... верхняя часть ходит вверх вниз"). Also, cropping the
//     artwork into two separately-transformed rectangular windows put a
//     visible seam at the crop boundary - one screenshot showed it plainly:
//     "верхняя часть травы как будто отрубленная ездит туда сюда". Two real,
//     confirmed problems with the "hard crop into rigid pieces" approach
//     itself, not tuning issues.
//  3. This take drops the crop-band idea entirely. A SINGLE `skewX` on the
//     WHOLE image, unsplit, solves both: `skewX` shifts every point
//     horizontally by an amount proportional to its own *vertical* distance
//     from the transform origin and never touches Y for any point at any X -
//     so no branch can ever bob vertically, full stop, regardless of how far
//     left/right it sits. And because the shift amount is continuous and
//     graduated (near-zero close to `transformOrigin` at the base, growing
//     toward the top), the *whole plant* participates in one seamless motion
//     - no crop, no cut line, no "chopped off" piece - while still naturally
//     reading as "rooted at the base, swaying more at the tips" (exactly
//     what a real branch does in wind), which is what the two-band version
//     was trying to fake with rigid pieces. Her ask ("веточки полностью
//     должны от ветра колыхаться") reads as wanting the WHOLE thing moving
//     naturally, not a two-piece puppet - a single continuous skew is a much
//     closer match to that than any hard segmentation could be.
//     Amplitude tuned down (3.5°→1.5°) since it now drives displacement
//     across the full 360px height instead of just a 150px top slice - kept
//     the tip's own absolute sideways travel roughly where it was when she
//     said that part looked fine ("та анимация которая качает веточки слева
//     направо и наоборот - в целом ок").
export function TeaIllustrationSway() {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1.5, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ skewX: `${angle.value}deg` }] }));

  return (
    <Animated.View style={[{ width: IMAGE_W, height: IMAGE_H, transformOrigin: '50% 100%' }, style]}>
      <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ width: IMAGE_W, height: IMAGE_H }} />
    </Animated.View>
  );
}
