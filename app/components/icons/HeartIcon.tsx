import Svg, { Path } from 'react-native-svg';

// Take 2 - first pass hand-drew a generic Material-style heart, having
// (wrongly) concluded no heart glyph existed anywhere in this app or the
// kit. It did: UI Kit/assets/icons-clean/favorite.svg (+ favorite-alt.svg,
// already wired into the kit's own Icons > Toggle grid, just never ported
// to the RN app before now) is a real Figma-sourced heart - swapped to its
// exact path/viewBox, same "real original over hand-redraw" rule this app
// follows for every other icon.
export function HeartIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * (45.8 / 49.8)} viewBox="17.34 19.34 49.80 45.80" fill="none">
      <Path
        d="M49.9062 26.875C53.1162 26.875 59.1875 29.0303 59.1875 37.1875C59.1875 42.8848 55.3774 46.8331 52.5957 49.7165C48.9107 53.5521 43.7463 57.2006 43.5434 57.3381C43.078 57.6544 42.539 57.8125 42 57.8125C41.461 57.8125 40.922 57.6544 40.4566 57.3381C40.2537 57.2006 35.0886 53.5507 31.4042 49.7165C28.6226 46.8331 24.8125 42.8848 24.8125 37.1875C24.8125 29.0303 30.8838 26.875 34.0938 26.875C37.4639 26.875 40.1307 28.6357 41.9993 30.4734C43.8617 28.6405 46.532 26.875 49.9062 26.875Z"
        fill={color}
      />
    </Svg>
  );
}
