import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// From the "About app" onboarding screens (Figma): active dot is a 24x8 pill,
// inactive dots are 8x8 circles, 4px gap, all radius 20 (pill).
export function ProgressDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
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
  dotActive: {
    width: 24,
    backgroundColor: colors.violet400,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.dotInactive,
  },
});
