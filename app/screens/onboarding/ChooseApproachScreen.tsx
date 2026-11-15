import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { RadioChoiceCard } from '../../components/RadioChoiceCard';
import { useT } from '../../i18n/useT';
import { useLanguage } from '../../i18n/LanguageContext';
import { approaches } from '../../i18n/dictionaries/onboarding';

export function ChooseApproachScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number | null>(null);
  const t = useT();
  const { language } = useLanguage();
  const options = approaches[language];

  return (
    <OnboardingStepLayout
      activeStep={5}
      title={t('onboarding.chooseApproachTitle')}
      description={t('onboarding.chooseApproachDescription')}
      buttonDisabled={selected === null}
      onPressNext={() => navigation.navigate('VisualStyle')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.list}>
        {options.map((approach, index) => (
          <RadioChoiceCard
            key={approach.title}
            title={approach.title}
            description={approach.description}
            selected={selected === index}
            onPress={() => setSelected(index)}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});
