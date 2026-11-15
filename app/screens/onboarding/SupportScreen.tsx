import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { SelectChip } from '../../components/SelectChip';
import { useT } from '../../i18n/useT';
import { useLanguage } from '../../i18n/LanguageContext';
import { supportOptions } from '../../i18n/dictionaries/onboarding';

export function SupportScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const t = useT();
  const { language } = useLanguage();
  const options = supportOptions[language];

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  return (
    <OnboardingStepLayout
      activeStep={4}
      title={t('onboarding.supportTitle')}
      description={t('onboarding.supportDescription')}
      buttonDisabled={selected.length === 0}
      onPressNext={() => navigation.navigate('ChooseApproach')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.wrap}>
        {options.map((option) => (
          <SelectChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onPress={() => toggle(option)}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
