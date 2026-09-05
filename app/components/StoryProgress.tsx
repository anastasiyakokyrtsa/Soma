import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Instagram/Stories-style segmented bar for a tap-through content sequence
// (Care -> "Чай как ритуал" ceremony) - unlike BreathingProgress (which fills
// a segment fractionally, second by second, for a timed practice), advancing
// here is a discrete tap/swipe with no in-between state, so each segment is
// simply filled or not - matching her own drawn screens exactly (segments up
// to and including the current slide solid violet, the rest a pale tint).
export function StoryProgress({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.segment, i <= activeIndex ? styles.segmentFilled : styles.segmentUpcoming]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentFilled: {
    backgroundColor: colors.violet400,
  },
  segmentUpcoming: {
    backgroundColor: colors.violet200,
  },
});
