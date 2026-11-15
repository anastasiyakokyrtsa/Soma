import { useState } from 'react';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { TextField } from '../../components/TextField';
import { useT } from '../../i18n/useT';

export function NameScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const t = useT();

  return (
    <OnboardingStepLayout
      activeStep={1}
      title={t('onboarding.nameTitle')}
      buttonDisabled={name.trim().length === 0}
      onPressNext={() => navigation.navigate('Email')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <TextField
        value={name}
        onChangeText={setName}
        label={t('onboarding.nameFieldLabel')}
        autoFocus
        returnKeyType="next"
      />
    </OnboardingStepLayout>
  );
}
