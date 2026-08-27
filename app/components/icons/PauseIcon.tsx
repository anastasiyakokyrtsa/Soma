import Svg, { Path } from 'react-native-svg';

// Ported from UI Kit/assets/icons-clean/play.svg - despite the filename,
// this sprite's own declared/visible viewBox crops to the two vertical
// bars (pause), not the triangle (that's a second glyph living outside the
// crop in the same file - see PlayIcon.tsx). Same "sprite sheet, take only
// what's actually in view" situation as BackIcon.tsx/CloseIcon.tsx.
export function PauseIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="28.8 25.8667 26.4001 32.2667" fill="none">
      <Path
        d="M31.7334 25.8667C30.1127 25.8667 28.8 27.1794 28.8 28.8V55.2C28.8 56.8207 30.1127 58.1334 31.7334 58.1334H34.6667C36.2874 58.1334 37.6 56.8207 37.6 55.2V28.8C37.6 27.1794 36.2874 25.8667 34.6667 25.8667H31.7334ZM49.3334 25.8667C47.7127 25.8667 46.4 27.1794 46.4 28.8V55.2C46.4 56.8207 47.7127 58.1334 49.3334 58.1334H52.2667C53.8874 58.1334 55.2001 56.8207 55.2001 55.2V28.8C55.2001 27.1794 53.8874 25.8667 52.2667 25.8667H49.3334Z"
        fill={color}
      />
    </Svg>
  );
}
