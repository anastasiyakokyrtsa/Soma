import Svg, { Rect } from 'react-native-svg';

// Take 3 - take 2 replaced the buggy ported sprite with two clean bars in a
// square 24x24 box, but the box had generous empty margin around the bars
// (they only filled 16 of 24 units tall) - next to PlayIcon's own tightly-
// cropped triangle (its viewBox IS the glyph's real bounding box, so `size`
// maps directly to the rendered triangle's height), the same `size` prop
// made the bars read as noticeably shorter ("треугольник сейчас большой, а
// палочки малюсенькие"). Cropped tight here too now - viewBox is the bars'
// own bounding box, no padding - so `size` produces a closely-matched
// rendered height on both icons (ratio 16.6/14 ≈ 1.19, matching PlayIcon's
// own ≈1.19 within rounding).
export function PauseIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * (16.6 / 14)} viewBox="0 0 14 16.6" fill="none">
      <Rect x={0} y={0} width={5} height={16.6} rx={2.5} fill={color} />
      <Rect x={9} y={0} width={5} height={16.6} rx={2.5} fill={color} />
    </Svg>
  );
}
