import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { OptionRow } from '../../components/OptionRow';

type Gender = 'female' | 'male';

export function GenderScreen({ navigation }: any) {
  const [gender, setGender] = useState<Gender | null>(null);

  return (
    <OnboardingStepLayout
      activeStep={3}
      title="Укажи свой пол"
      description="Это необходимо, чтобы учитывать гормональные циклы, которые напрямую влияют на физическое состояние, сон и активность"
      buttonDisabled={gender === null}
      onPressNext={() => navigation.navigate('Support')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.list}>
        <OptionRow label="Женщина" selected={gender === 'female'} onPress={() => setGender('female')} />
        <OptionRow label="Мужчина" selected={gender === 'male'} onPress={() => setGender('male')} />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});
