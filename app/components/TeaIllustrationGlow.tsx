import { View, Image } from 'react-native';
import Svg, { Image as SvgImage, Defs, Filter, FeGaussianBlur } from 'react-native-svg';

const IMAGE_W = 193;
const IMAGE_H = 360;
// Bleed room so the blurred passes have somewhere to spread into without
// getting clipped at the artwork's own tight bounds. Exported so CareScreen
// can compensate its own top/bottom gaps around this component.
export const TEA_GLOW_PAD = 40;
const CANVAS_W = IMAGE_W + TEA_GLOW_PAD * 2;
const CANVAS_H = IMAGE_H + TEA_GLOW_PAD * 2;

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
//    apparently isn't taking effect in this exact environment either (both
//    props silently no-op'ing would produce exactly what she saw: 3
//    perfectly-aligned identical copies, the opaque top one hiding
//    whatever's under it regardless of the (ignored) opacity/blur on the
//    other two).
//  - This take drops BOTH of those and uses `react-native-svg`'s own
//    `FeGaussianBlur`, the one blur primitive already CONFIRMED working
//    in this exact app (NavIcon's active-glow, BiorhythmChart's rings) -
//    unlike `FeDropShadow`, which is a confirmed-broken filter primitive
//    here (see NavIcon.tsx/BottomBar.tsx's own comments). `react-native-svg`
//    has a native `Image` element (`href` accepts the same `source` shape
//    as RN's own `Image`) that filters apply to like any other SVG content,
//    real alpha included - blurring it traces the artwork's actual
//    silhouette the same way FeGaussianBlur already does for NavIcon's
//    vector Path. Same doubled-filter-intensity trick NavIcon uses (draw
//    the blurred copy twice) for the tighter, stronger pass. Filter region
//    padded generously (x/y -150%, width/height 400%) - BottomBar's own
//    glow saga found the SVG default filter region (-10%/120%) clips a
//    wide blur's spread and reads as squashed/cut off.
export function TeaIllustrationGlow() {
  return (
    <View style={{ width: CANVAS_W, height: CANVAS_H, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute' }} pointerEvents="none">
        <Defs>
          <Filter id="teaGlowWide" x="-150%" y="-150%" width="400%" height="400%">
            <FeGaussianBlur stdDeviation={14} />
          </Filter>
          <Filter id="teaGlowTight" x="-150%" y="-150%" width="400%" height="400%">
            <FeGaussianBlur stdDeviation={6} />
          </Filter>
        </Defs>
        <SvgImage href={TEA_ILLUSTRATION} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} opacity={0.5} filter="url(#teaGlowWide)" />
        <SvgImage href={TEA_ILLUSTRATION} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} opacity={0.6} filter="url(#teaGlowTight)" />
        <SvgImage href={TEA_ILLUSTRATION} x={TEA_GLOW_PAD} y={TEA_GLOW_PAD} width={IMAGE_W} height={IMAGE_H} opacity={0.6} filter="url(#teaGlowTight)" />
      </Svg>
      <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ width: IMAGE_W, height: IMAGE_H }} />
    </View>
  );
}
