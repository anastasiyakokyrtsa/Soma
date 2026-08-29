import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// New, 2026-08-28: "я думаю наверное стоит повторить весь процесс 6 раз...
// чтобы человек видел сколько прошло и сколько осталось, нужно какой-то
// подходящий прогресс бар сюда придумать." Considered a ring wrapped around
// the orb (this app's own established circular-progress precedent,
// ResourceRing) but deliberately avoided it - she'd just explicitly rejected
// a decorative ring added around this same orb minutes earlier ("нафига ты
// мне вставил кольцо какое-то") for an unrelated ask, and a progress ring in
// the same spot risked reading as the same unwanted addition. A row of
// small segments (one per repeat) sits clear of the orb entirely, and
// - unlike a single continuous bar - directly answers "how many reps done,
// how many left" at a glance, which a smooth 0-100% bar wouldn't for a
// small fixed count like 6. Reused this app's `ProgressDots.tsx` naming/
// shape language (small circles, not the onboarding component itself - its
// 2-state active/inactive model can't show "done" as distinct from
// "upcoming", which is the whole point here) but a fresh 3-state version:
// done (filled, glowing), current (bigger, brighter), upcoming (dim ring).
export function BreathingProgress({ total, completed }: { total: number; completed: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => {
        const isDone = i < completed;
        const isCurrent = i === completed;
        return (
          <View
            key={i}
            style={[styles.dot, isDone && styles.dotDone, isCurrent && styles.dotCurrent]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
  },
  dotDone: {
    borderColor: colors.violet400,
    backgroundColor: colors.violet400,
    boxShadow: `0px 0px 6px ${colors.violet400}`,
  },
  dotCurrent: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderColor: colors.violet400,
    backgroundColor: colors.violet400,
    boxShadow: `0px 0px 8px ${colors.violet400}`,
  },
});
