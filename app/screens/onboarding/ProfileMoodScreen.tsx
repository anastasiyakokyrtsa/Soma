import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { MoodScale } from '../../components/MoodScale';
import { profileStepTotal } from '../../lib/onboardingProfile';

export function ProfileMoodScreen({ navigation }: any) {
  // Knob starts over "Ужасно" (her call, 2026-09-23), and Continue stays disabled
  // until the scale is actually touched, so nobody records a mood they never
  // picked (a pre-set "Хорошо" used to be submitted by just tapping Continue).
  const [moodIndex, setMoodIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  return (
    <ProfileStepLayout
      step={profileStepTotal()}
      totalSteps={profileStepTotal()}
      title="Как ты чувствуешь себя сегодня?"
      buttonDisabled={!touched}
      onPressNext={() => navigation.replace('Main')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.wrap}>
        <MoodScale
          index={moodIndex}
          onChange={(i) => {
            setTouched(true);
            setMoodIndex(i);
          }}
        />
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  // 14, same as ProfileDateOfBirthScreen/ProfileMenstrualCycleScreen's own
  // wrap - MoodScale's own top content (the mood-word title) is flush with
  // its own top edge, so 16(content)+14 = 30 lands the same gap those
  // screens use (was 24, giving 40 - noticeably more; 2026-08-17 review).
  wrap: {
    marginTop: 14,
  },
});
