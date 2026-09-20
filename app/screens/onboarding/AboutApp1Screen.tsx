import { OnboardingSlide } from './OnboardingSlide';

export function AboutApp1Screen({ navigation }: any) {
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-1.png')}
      title="Твоё состояние — это система"
      description="Энергия, настроение и внимание движутся по своим траекториям. И их можно научиться читать."
      buttonLabel="Далее"
      activeIndex={0}
      onPressNext={() => navigation.navigate('AboutApp2')}
      onPressLogin={() => {}}
    />
  );
}
