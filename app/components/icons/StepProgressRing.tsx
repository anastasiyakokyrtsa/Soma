import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { colors } from '../../theme';

const STROKE = 3;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Circular loading indicator for the active Personalization step - sweeps
// clockwise from 12 o'clock as `progress` (0->1, the screen's own Reanimated
// shared value - see PersonalizationScreen.tsx) goes 0 -> 1. Standard
// stroke-dasharray/dashoffset SVG trick: the circle is rotated -90deg so its
// own start point (3 o'clock by default) lands at the top, then the
// dashoffset counts down from the full circumference.
//
// 2026-09-29, take 2: `progress` is a Reanimated SharedValue again, animated
// here via useAnimatedProps (react-native-svg's own well-established
// Reanimated integration, not the newer Skia-specific direct-shared-value
// props this app hit real trouble with elsewhere - see
// PersonalizationIllustration.tsx). This used to be a plain number specifically
// because a *different* library's (Skia's) old shared-value bridge was
// broken on this app's then-current SDK; that never applied to plain SVG,
// but the whole screen shared one animation system for simplicity at the
// time. Now that the Skia side is back on real shared values too, this
// stays in lockstep with it for free (same underlying value, no separate
// clock to drift).
export function StepProgressRing({
  progress,
  size = 48,
  color = colors.violet400,
}: {
  progress: SharedValue<number>;
  size?: number;
  color?: string;
}) {
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - progress.value),
  }));

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeOpacity={0.25} strokeWidth={STROKE} fill="none" />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={`${c} ${c}`}
        animatedProps={animatedProps}
        strokeLinecap="round"
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}
