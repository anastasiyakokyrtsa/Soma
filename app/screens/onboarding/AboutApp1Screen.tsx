import { OnboardingSlide } from './OnboardingSlide';
import { useT } from '../../i18n/useT';

export function AboutApp1Screen({ navigation }: any) {
  const t = useT();
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-1.png')}
      title={t('onboarding.aboutApp1Title')}
      description={t('onboarding.aboutApp1Description')}
      buttonLabel={t('onboarding.aboutApp1Button')}
      activeIndex={0}
      onPressNext={() => navigation.navigate('AboutApp2')}
      onPressLogin={() => {}}
    />
  );
}
