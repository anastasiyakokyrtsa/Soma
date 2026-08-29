import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Take 2 - the dot row wasn't good enough ("прогресс бар не очень, придумай
// другой вариант получше"). Rebuilt as a segmented bar (one segment per
// repeat, Stories/Reels-style) instead of plain status dots - each segment
// fills smoothly as its own cycle plays out (driven by BreathingOrb's
// onStepChange, once/second) rather than only flipping at cycle boundaries,
// so it reads as live progress through the current rep too, not just a
// counter. Still deliberately not a ring around the orb - she'd rejected a
// decorative ring in this same spot for an unrelated reason minutes earlier
// this same session ("нафига ты мне вставил кольцо какое-то").
export function BreathingProgress({
  total,
  completedCycles,
  currentFraction,
}: {
  total: number;
  completedCycles: number;
  // 0-1, how far into the *current* (not-yet-completed) cycle we are.
  currentFraction: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => {
        const fill = i < completedCycles ? 1 : i === completedCycles ? currentFraction : 0;
        return (
          <View key={i} style={styles.track}>
            <View style={[styles.fill, { width: `${fill * 100}%` }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.violet400,
    boxShadow: `0px 0px 6px ${colors.violet400}`,
  },
});
