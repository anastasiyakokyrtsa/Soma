import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { MoodScale } from '../../components/MoodScale';

export function ProfileMoodScreen({ navigation }: any) {
  const [moodIndex, setMoodIndex] = useState(3); // "Хорошо" — matches the wireframe's default

  return (
    <ProfileStepLayout
      step={4}
      title="Как ты чувствуешь себя сегодня?"
      onPressNext={() => navigation.replace('Main')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.wrap}>
        <MoodScale index={moodIndex} onChange={setMoodIndex} />
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
