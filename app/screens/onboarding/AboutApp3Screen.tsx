import { OnboardingSlide } from './OnboardingSlide';

export function AboutApp3Screen({ navigation }: any) {
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-3.png')}
      title="Живи в своём ритме"
      description="Наблюдай фазы напряжения и восстановления. Настраивай нагрузку в соответствии с твоим ритмом."
      buttonLabel="Начать исследование"
      activeIndex={2}
      onPressNext={() => navigation.replace('Main')}
      onPressLogin={() => {}}
    />
  );
}
