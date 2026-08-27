import Svg, { Path } from 'react-native-svg';

// Same bookmark glyph QuoteCard.tsx already draws inline for its "Сохранить"
// action - extracted here so the breathing-session "save this practice"
// control reuses the exact same icon language instead of inventing a
// separate heart/favorite concept the app doesn't otherwise have.
export function BookmarkIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * (47.24 / 36.24)} viewBox="23.76 17.76 36.24 47.24" fill="none">
      <Path
        d="M53.7333 59.5999L41.9999 49.3332L30.2666 59.5999V27.3332C30.2666 25.7126 31.5793 24.3999 33.1999 24.3999H50.7999C52.4206 24.3999 53.7333 25.7126 53.7333 27.3332V59.5999Z"
        fill={color}
      />
    </Svg>
  );
}
