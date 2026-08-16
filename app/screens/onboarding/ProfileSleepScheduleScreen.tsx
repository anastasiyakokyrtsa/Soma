import { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { SleepWheelPicker } from '../../components/SleepWheelPicker';
import { spacing } from '../../theme';

export function ProfileSleepScheduleScreen({ navigation }: any) {
  // The dial is one 12h loop (see SleepWheelPicker.tsx's 2026-08-16 note on
  // LOOP_MIN), not an absolute 24h clock - these are positions on that
  // loop, not literal times. 0 = the "12" mark, 510 = 8h30m clockwise from
  // it (between the "8" and "9" marks) - same default duration as before.
  const [bedtimeMin, setBedtimeMin] = useState(0);
  const [waketimeMin, setWaketimeMin] = useState(510);
  const { width } = useWindowDimensions();
  // Responsive, capped at 340 (2026-08-16: "сделай его больше") - fixed
  // 340px could overflow a narrow phone's available width otherwise.
  const dialSize = Math.min(width - spacing.screenPadding * 2, 340);

  return (
    <ProfileStepLayout
      step={2}
      title="Какой у тебя обычно график сна?"
      description="Отметь, во сколько ты уснул и проснулся. Это поможет нам точнее понять твой текущий ритм и состояние"
      onPressNext={() => navigation.navigate('ProfileMenstrualCycle')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.pickerWrap}>
        <SleepWheelPicker
          bedtimeMin={bedtimeMin}
          waketimeMin={waketimeMin}
          size={dialSize}
          onChange={(b, w) => {
            setBedtimeMin(b);
            setWaketimeMin(w);
          }}
        />
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  // Same fix as ProfileDateOfBirthScreen - flex:1/centered pushed the dial
  // down into the middle of the whole remaining screen height instead of
  // sitting a fixed, modest gap below the header text (2026-08-16 review).
  // 0px here, not 24 - SleepWheelPicker's own SVG box already has a ~25px
  // gap between its top edge and the ring's actual visible top, close
  // enough to the 24px-to-visible-content target that the date wheel uses
  // (see that screen's own note).
  pickerWrap: {
    marginTop: 0,
  },
});
