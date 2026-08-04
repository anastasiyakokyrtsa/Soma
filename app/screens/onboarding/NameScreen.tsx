import { useState } from 'react';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { TextField } from '../../components/TextField';

export function NameScreen({ navigation }: any) {
  const [name, setName] = useState('');

  return (
    <OnboardingStepLayout
      activeStep={1}
      title="Как тебя зовут?"
      buttonDisabled={name.trim().length === 0}
      onPressNext={() => navigation.navigate('Email')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <TextField
        value={name}
        onChangeText={setName}
        label="Твоё имя"
        autoFocus
        returnKeyType="next"
      />
    </OnboardingStepLayout>
  );
}
