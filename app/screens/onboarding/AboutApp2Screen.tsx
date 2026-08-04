import { OnboardingSlide } from './OnboardingSlide';

export function AboutApp2Screen({ navigation }: any) {
  return (
    <OnboardingSlide
      image={require('../../assets/onboarding/about-2.png')}
      title="Замечай закономерности"
      description="Soma отслеживает твои ритмы, реакции и привычки, чтобы показать, что влияет на твоё состояние."
      buttonLabel="Далее"
      activeIndex={1}
      onPressNext={() => navigation.navigate('AboutApp3')}
      onPressBack={() => navigation.navigate('AboutApp1')}
      onPressLogin={() => {}}
    />
  );
}
