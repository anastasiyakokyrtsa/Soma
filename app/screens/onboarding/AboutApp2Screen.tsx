import { OnboardingSlide } from './OnboardingSlide';
import { useT } from '../../i18n/useT';

export function AboutApp2Screen({ navigation }: any) {
  const t = useT();
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-2.png')}
      title={t('onboarding.aboutApp2Title')}
      description={t('onboarding.aboutApp2Description')}
      buttonLabel={t('onboarding.aboutApp2Button')}
      activeIndex={1}
      onPressNext={() => navigation.navigate('AboutApp3')}
      onPressBack={() => navigation.navigate('AboutApp1')}
      onPressLogin={() => {}}
    />
  );
}
