import Svg, { Path } from 'react-native-svg';

const ROTATION: Record<'down' | 'up' | 'left' | 'right', number> = {
  down: 0,
  up: 180,
  right: -90,
  left: 90,
};

// Ported from UI Kit/assets/icons-clean/expand-arrow.svg (a down-pointing
// chevron). collapse-arrow.svg turned out to be the exact same path mirrored
// vertically, so rather than ship both files (or a 3rd/4th for left/right,
// needed by the style-preview carousel's "next" arrow) this just rotates a
// single source shape — one path, four directions.
//
// Renders in a square box regardless of direction: the source glyph itself
// is wider than tall (40.96x25.96), so a 90° rotation would otherwise clip
// against a non-square declared box (SVG layout dimensions don't swap just
// because their content is rotated). A square box + the default
// xMidYMid-meet viewBox scaling lets it stay centered and unclipped in every
// direction, at the cost of a little unused padding on down/up — invisible
// at the ~20px sizes this is actually used at.
export function ChevronIcon({
  size = 20,
  color = '#FFFFFF',
  direction = 'down',
}: {
  size?: number;
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="21.52 28.52 40.96 25.96"
      fill="none"
      style={{ transform: [{ rotate: `${ROTATION[direction]}deg` }] }}
    >
      <Path
        d="M56.6523 33.1799C56.2654 33.189 55.8979 33.3506 55.6296 33.6296L42 47.2593L28.3703 33.6296C28.2336 33.4891 28.0701 33.3774 27.8896 33.3012C27.709 33.2249 27.515 33.1856 27.319 33.1856C27.0272 33.1857 26.7421 33.2727 26.5001 33.4357C26.2581 33.5987 26.0701 33.8301 25.9603 34.1004C25.8506 34.3708 25.8239 34.6677 25.8837 34.9533C25.9436 35.2388 26.0872 35.5001 26.2963 35.7035L40.963 50.3702C41.238 50.6452 41.611 50.7996 42 50.7996C42.3889 50.7996 42.7619 50.6452 43.0369 50.3702L57.7036 35.7035C57.9166 35.4987 58.0628 35.2343 58.123 34.945C58.1832 34.6557 58.1546 34.355 58.0409 34.0822C57.9273 33.8094 57.7339 33.5773 57.4861 33.4163C57.2384 33.2553 56.9477 33.1729 56.6523 33.1799Z"
        fill={color}
      />
    </Svg>
  );
}
