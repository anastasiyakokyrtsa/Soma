import Svg, { Path } from 'react-native-svg';

// The triangle half of UI Kit/assets/icons-clean/play.svg's sprite sheet -
// see PauseIcon.tsx for why the same file holds both glyphs. Kit source
// fills this one violet400, not white (unlike the pause bars) - kept as
// the default here too.
export function PlayIcon({ size = 20, color = '#8B7CF6' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * (33.66 / 28.24)} viewBox="28.94 83.14 28.25 33.52" fill="none">
      <Path
        d="M55.4537 96.8858C56.5378 97.5599 57.185 98.7241 57.185 100C57.185 101.276 56.5378 102.44 55.4543 103.114L34.5464 116.11C33.9554 116.478 33.2838 116.663 32.611 116.663C31.9974 116.663 31.3839 116.51 30.8296 116.201C29.6673 115.555 28.9443 114.327 28.9443 112.997V87.0036C28.9443 85.6732 29.6673 84.4448 30.8296 83.7983C31.9926 83.1523 33.4171 83.1872 34.547 83.8893L55.4537 96.8858Z"
        fill={color}
      />
    </Svg>
  );
}
