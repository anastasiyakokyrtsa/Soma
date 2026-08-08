import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { SelectChip } from '../../components/SelectChip';

const OPTIONS = [
  'Телесное напряжение',
  'Качество сна',
  'Тревога',
  'Перепады настроения',
  'Уровень стресса',
  'Общее самочувствие',
  'Эмоциональный баланс',
  'Усталость',
  'Рассеянность',
  'Отсутствие мотивации',
  'Раздражительность',
  'Прокрастинация',
];

export function SupportScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  return (
    <OnboardingStepLayout
      activeStep={4}
      title="В чем тебе больше всего нужна поддержка?"
      description="Можно выбрать несколько вариантов. Советуем начать с 2-3 самых актуальных пунктов"
      buttonDisabled={selected.length === 0}
      onPressNext={() => navigation.navigate('ChooseApproach')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.wrap}>
        {OPTIONS.map((option) => (
          <SelectChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onPress={() => toggle(option)}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
