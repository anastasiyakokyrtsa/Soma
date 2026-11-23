import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { SelectChip } from '../../components/SelectChip';
import { useT } from '../../i18n/useT';
import { useLanguage } from '../../i18n/LanguageContext';
import { supportOptions, supportOptionIds, type SupportOptionId } from '../../i18n/dictionaries/onboarding';
import { setOnboardingSupportAreas } from '../../lib/onboardingProfile';

export function SupportScreen({ navigation }: any) {
  // Находка №18 (2026-11-23): this used to be the only onboarding step whose
  // answer never left the screen's own state - fixed by writing it to
  // onboardingProfile on Next, same as every other step. Stored as the
  // stable ids (supportOptionIds), not the displayed label, so it survives a
  // language switch and matches what a future recommendation-matching step
  // would key off of.
  const [selected, setSelected] = useState<SupportOptionId[]>([]);
  const t = useT();
  const { language } = useLanguage();
  const options = supportOptions[language];

  const toggle = (id: SupportOptionId) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <OnboardingStepLayout
      activeStep={4}
      title={t('onboarding.supportTitle')}
      description={t('onboarding.supportDescription')}
      buttonDisabled={selected.length === 0}
      onPressNext={() => {
        setOnboardingSupportAreas(selected);
        navigation.navigate('ChooseApproach');
      }}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.wrap}>
        {options.map((option, index) => {
          const id = supportOptionIds[index];
          return <SelectChip key={id} label={option} selected={selected.includes(id)} onPress={() => toggle(id)} />;
        })}
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
