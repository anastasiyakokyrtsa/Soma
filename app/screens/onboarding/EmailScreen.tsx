import { useState } from 'react';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { TextField } from '../../components/TextField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  return (
    <OnboardingStepLayout
      activeStep={2}
      title="Твоя электронная почта"
      description="Мы используем почту только для важных уведомлений и сохранения твоего прогресса"
      buttonDisabled={!EMAIL_RE.test(email.trim())}
      onPressNext={() => navigation.navigate('Gender')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <TextField
        value={email}
        onChangeText={setEmail}
        label="Твоя почта"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        returnKeyType="next"
      />
    </OnboardingStepLayout>
  );
}
