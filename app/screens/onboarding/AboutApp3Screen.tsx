import { OnboardingSlide } from './OnboardingSlide';

export function AboutApp3Screen({ navigation }: any) {
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-3.png')}
      title="Живи в своём ритме"
      description="Наблюдай фазы напряжения и восстановления, настраивай нагрузку под свой ритм."
      buttonLabel="Начать исследование"
      activeIndex={2}
      onPressNext={() => navigation.navigate('Name')}
      onPressBack={() => navigation.navigate('AboutApp2')}
      onPressLogin={() => {}}
    />
  );
}
