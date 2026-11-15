import { useState } from 'react';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { TextField } from '../../components/TextField';
import { useT } from '../../i18n/useT';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const t = useT();

  return (
    <OnboardingStepLayout
      activeStep={2}
      title={t('onboarding.emailTitle')}
      description={t('onboarding.emailDescription')}
      buttonDisabled={!EMAIL_RE.test(email.trim())}
      onPressNext={() => navigation.navigate('Gender')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <TextField
        value={email}
        onChangeText={setEmail}
        label={t('onboarding.emailFieldLabel')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        returnKeyType="next"
      />
    </OnboardingStepLayout>
  );
}
