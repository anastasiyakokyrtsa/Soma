import { OnboardingSlide } from './OnboardingSlide';
import { useT } from '../../i18n/useT';

export function AboutApp3Screen({ navigation }: any) {
  const t = useT();
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-3.png')}
      title={t('onboarding.aboutApp3Title')}
      description={t('onboarding.aboutApp3Description')}
      buttonLabel={t('onboarding.aboutApp3Button')}
      activeIndex={2}
      onPressNext={() => navigation.navigate('Name')}
      onPressBack={() => navigation.navigate('AboutApp2')}
      onPressLogin={() => {}}
    />
  );
}
