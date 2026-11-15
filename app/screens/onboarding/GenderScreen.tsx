import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { OptionRow } from '../../components/OptionRow';
import { setOnboardingGender, type Gender } from '../../lib/onboardingProfile';
import { useT } from '../../i18n/useT';

export function GenderScreen({ navigation }: any) {
  const [gender, setGender] = useState<Gender | null>(null);
  const t = useT();

  return (
    <OnboardingStepLayout
      activeStep={3}
      title={t('onboarding.genderTitle')}
      description={t('onboarding.genderDescription')}
      buttonDisabled={gender === null}
      onPressNext={() => {
        setOnboardingGender(gender!);
        navigation.navigate('Support');
      }}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.list}>
        <OptionRow label={t('onboarding.genderFemale')} selected={gender === 'female'} onPress={() => setGender('female')} />
        <OptionRow label={t('onboarding.genderMale')} selected={gender === 'male'} onPress={() => setGender('male')} />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});
