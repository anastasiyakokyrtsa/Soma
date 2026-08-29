import Svg, { Path } from 'react-native-svg';

// New - no heart/favorite glyph existed anywhere in this app or the kit
// before this (checked both). "Лайк" on the breathing session controls,
// 2026-08-28 - a separate action from BookmarkIcon's "Сохранить" (save
// this practice for later vs. liking it), same visual treatment as
// bookmark on this screen, different glyph. Standard filled-heart
// silhouette in a clean 24x24 box.
export function HeartIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </Svg>
  );
}
