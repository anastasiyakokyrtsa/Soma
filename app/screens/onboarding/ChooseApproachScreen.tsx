import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { RadioChoiceCard } from '../../components/RadioChoiceCard';
import { useT } from '../../i18n/useT';
import { useLanguage } from '../../i18n/LanguageContext';
import { approaches } from '../../i18n/dictionaries/onboarding';

// Her catch (2026-11-23): only index 0 ("Научно-практический") is actually
// built - every screen this whole product cycle (biorhythm/sleep/cycle/
// mood/tea/breathing/meditation) is that branch. "Астрологический" and
// "Синтез двух систем" led to the exact same next screen either way, a
// fake choice. Pre-selecting the only real option (not leaving the user to
// discover it's the only one that does anything) and marking the other two
// "Скоро", same honest-unavailable convention as NavChip/TeaCategoriesScreen.
const AVAILABLE_INDEX = 0;

export function ChooseApproachScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number | null>(AVAILABLE_INDEX);
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
            available={index === AVAILABLE_INDEX}
            soonLabel={t('tea.soonBadge')}
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
