import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme';

// From the "About app" onboarding screens (Figma): active dot is a 24x8 pill,
// inactive dots are 8x8 circles, 4px gap, all radius 20 (pill). Width + color
// animate smoothly between states instead of snapping instantly.
function Dot({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, progress]);

  const style = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [8, 24]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.dotInactive, colors.violet400]),
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function ProgressDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} active={i === activeIndex} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    height: 8,
    borderRadius: 20,
  },
});
