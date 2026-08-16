import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme';

const STROKE = 3;

// Circular loading indicator for the active Personalization step - sweeps
// clockwise from 12 o'clock as `progress` (0->1, driven by the screen's
// shared rAF clock so it stays in lockstep with the illustration's ring -
// see PersonalizationScreen.tsx) goes 0 -> 1. Standard stroke-dasharray/
// dashoffset SVG trick: the circle is rotated -90deg so its own start point
// (3 o'clock by default) lands at the top, then the dashoffset counts down
// from the full circumference.
//
// Plain-number prop, not a Reanimated shared value (2026-08-09 review: the
// Skia illustration's ring wasn't animating live because this exact Expo Go
// SDK's react-native-skia/reanimated/worklets combo doesn't bridge shared
// values into Skia's canvas reliably - only React itself re-rendering makes
// it draw the latest value. Rebuilt on a plain rAF-driven state number
// instead, since that's guaranteed to work regardless of native module
// versions - this badge switched too so both stay driven by the exact same
// clock instead of two different animation systems risking drift.)
export function StepProgressRing({
  progress,
  size = 48,
  color = colors.violet400,
}: {
  progress: number;
  size?: number;
  color?: string;
}) {
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeOpacity={0.25} strokeWidth={STROKE} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={c * (1 - progress)}
        strokeLinecap="round"
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}
