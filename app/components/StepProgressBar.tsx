import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Segmented step-progress bar for the profile-setup steps (Name/Email/Gender/
// Support and onward) — distinct from ProgressDots (which marks a single
// current position among onboarding *slides*). Here every completed step
// stays filled, per the wireframes (WF 6-9: 1, then 2, then 3, then 4 of 6
// segments lit as you advance). No matching Figma spec exists for this flow
// yet, so colors reuse the established violet/lavender pair from the onboarding
// dots (colors.violet400 filled, colors.dotInactive track) for visual continuity.
export function StepProgressBar({ total, activeStep }: { total: number; activeStep: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.segment, { backgroundColor: i < activeStep ? colors.violet400 : colors.dotInactive }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
  },
});
