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
  wrap: {
    marginTop: 24,
  },
});
