import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { RadioChoiceCard } from '../../components/RadioChoiceCard';

const APPROACHES = [
  {
    title: 'Научно-практический',
    description: 'Факторы тела, сна\nи окружающей среды',
  },
  {
    title: 'Астрологический',
    description: 'Циклы, символы и астрологические интерпретации',
  },
  {
    title: 'Синтез двух систем',
    description: 'Объединяет оба подхода',
  },
];

export function ChooseApproachScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <OnboardingStepLayout
      activeStep={5}
      title="Выбери язык самонаблюдения"
      description="Чтобы рекомендации и инсайты откликались тебе, выбери основной подход. Ты всегда можешь изменить его в настройках"
      buttonDisabled={selected === null}
      onPressNext={() => navigation.navigate('VisualStyle')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.list}>
        {APPROACHES.map((approach, index) => (
          <RadioChoiceCard
            key={approach.title}
            title={approach.title}
            description={approach.description}
            selected={selected === index}
            onPress={() => setSelected(index)}
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
