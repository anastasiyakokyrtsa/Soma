import Svg, { Defs, Filter, FeGaussianBlur, Path } from 'react-native-svg';

const CHECK_D =
  'M66.5314 9.00104C65.9085 9.0196 65.3173 9.27994 64.883 9.72689L28.2159 46.394L13.1276 31.3057C12.9067 31.0756 12.642 30.8919 12.3492 30.7653C12.0564 30.6388 11.7413 30.5719 11.4223 30.5687C11.1033 30.5654 10.7869 30.6258 10.4915 30.7464C10.1962 30.867 9.92789 31.0453 9.70232 31.2709C9.47676 31.4964 9.29846 31.7647 9.17789 32.0601C9.05731 32.3554 8.99688 32.6718 9.00012 32.9908C9.00337 33.3098 9.07023 33.6249 9.19679 33.9177C9.32335 34.2106 9.50706 34.4752 9.73717 34.6961L26.5207 51.4796C26.9704 51.9291 27.5801 52.1816 28.2159 52.1816C28.8517 52.1816 29.4615 51.9291 29.9111 51.4796L68.2735 13.1173C68.6199 12.7805 68.8566 12.3469 68.9524 11.8734C69.0482 11.3998 68.9987 10.9083 68.8104 10.4633C68.6221 10.0184 68.3037 9.64066 67.8971 9.37973C67.4904 9.11879 67.0144 8.9868 66.5314 9.00104Z';

// Same standalone checkmark glyph PersonalizationIllustration.tsx draws via
// Skia (its own CHECK_PATH) - ported here as plain react-native-svg instead,
// since Skia is unreliable in this app's exact environment (see
// project_skia_reanimated_bridge.md) and this icon doesn't need Skia's
// path-drawing (`start`/`end`) animation, just a static glyph.
//
// `glow`: same two-layer technique the kit's own Skia version uses (a
// blurred copy of the glyph behind a crisp one) - ported to react-native-svg's
// own Filter/FeGaussianBlur instead of Skia's Blur (a different, natively-
// implemented part of react-native-svg, not the unreliable Skia canvas
// bridge). No wrapping box of any kind - her explicit ask 2026-09-06, after
// a boxShadow-on-a-View attempt rendered a visible dark rectangle behind the
// icon: "сам значок только остался без тёмного фона под ним".
export function CheckmarkIcon({ size = 60, color = '#FFFFFF', glow = false }: { size?: number; color?: string; glow?: boolean }) {
  return (
    <Svg width={size} height={size * (43.18 / 60)} viewBox="9 9 60 43.18" fill="none">
      {glow ? (
        <>
          <Defs>
            <Filter id="checkmarkGlow" x="-75%" y="-75%" width="250%" height="250%">
              <FeGaussianBlur stdDeviation={3.5} />
            </Filter>
          </Defs>
          <Path d={CHECK_D} fill={color} filter="url(#checkmarkGlow)" />
        </>
      ) : null}
      <Path d={CHECK_D} fill={color} />
    </Svg>
  );
}
