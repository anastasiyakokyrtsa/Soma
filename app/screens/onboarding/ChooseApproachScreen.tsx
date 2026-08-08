import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { ExpandableChoiceCard } from '../../components/ExpandableChoiceCard';

const APPROACHES = [
  {
    title: 'Научно-практический',
    description:
      'Мы анализируем твои биоритмы, сон, солнечную активность и другие факторы, чтобы находить закономерности между телом, настроением и нагрузкой и предлагать индивидуальные решения',
  },
  {
    title: 'Астрологический',
    description:
      'Мы опираемся на фазы луны, твою натальную карту и положение планет, чтобы находить тонкие закономерности в твоём состоянии и предлагать персональные ритуалы и прогнозы',
  },
  {
    title: 'Синтез двух систем',
    description:
      'Мы совмещаем биоритмы и данные о теле с лунными и планетарными циклами, чтобы показывать более полную картину твоего состояния и предлагать решения с обеих сторон',
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
          <ExpandableChoiceCard
            key={approach.title}
            title={approach.title}
            description={approach.description}
            expanded={selected === index}
            onPress={() => setSelected((prev) => (prev === index ? null : index))}
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
