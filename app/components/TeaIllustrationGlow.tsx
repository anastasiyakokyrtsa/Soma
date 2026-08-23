import { View, Image } from 'react-native';
import { colors } from '../theme';

const IMAGE_W = 193;
const IMAGE_H = 360;

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// Care screen's "Чай как ритуал" illustration glow, take 4. Take 3 (Skia:
// Canvas + useImage + Blur) shipped and came back "вообще нет никакого
// свечения" - the follow-up screenshot showed the crisp artwork rendering
// fine (it had been split out to a plain RN Image specifically to isolate
// this) but a completely blank result from the Skia Canvas, not just a weak
// one - proof the Canvas isn't rendering *at all* here, not a tuning issue.
// This project already has one confirmed Skia/Expo-Go environment gap this
// session (Reanimated shared values into Skia props don't fire - see
// project_skia_reanimated_bridge.md) - this is a second, separate one
// (useImage/Canvas itself, no Reanimated involved), so Skia is no longer a
// safe bet for this effect at all.
//
// Dropped Skia entirely. Core React Native's own `Image` component
// supports `blurRadius` and `tintColor` natively (no third-party native
// module, been in RN for years, not something this project has any reason
// to distrust) - `tintColor` recolors the image's opaque pixels to one flat
// color using its own alpha channel as a mask (exactly a silhouette),
// `blurRadius` then softens that silhouette into a glow. Genuinely traces
// the artwork's real shape (same result CSS `filter: drop-shadow()` gives
// on web) without needing Skia, an SVG approximation, or a boxShadow at
// all. Two passes (loose+faint behind, tighter+stronger just under the
// crisp copy) read as one soft aura rather than a single hard ring, kept
// deliberately restrained per her "не сильно ярко".
export function TeaIllustrationGlow() {
  return (
    <View style={{ width: IMAGE_W, height: IMAGE_H, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={TEA_ILLUSTRATION}
        tintColor={colors.violet400}
        blurRadius={30}
        resizeMode="contain"
        style={{ position: 'absolute', width: IMAGE_W, height: IMAGE_H, opacity: 0.55 }}
      />
      <Image
        source={TEA_ILLUSTRATION}
        tintColor={colors.violet400}
        blurRadius={14}
        resizeMode="contain"
        style={{ position: 'absolute', width: IMAGE_W, height: IMAGE_H, opacity: 0.6 }}
      />
      <Image source={TEA_ILLUSTRATION} resizeMode="contain" style={{ width: IMAGE_W, height: IMAGE_H }} />
    </View>
  );
}
