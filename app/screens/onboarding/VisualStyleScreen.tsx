import { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { StyleGridTile } from '../../components/StyleGridTile';
import { VISUAL_STYLES } from '../../theme/visualStyles';
import { spacing } from '../../theme';

const GRID_GAP = 12;

export function VisualStyleScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const tileSize = (width - spacing.screenPadding * 2 - GRID_GAP) / 2;

  return (
    <OnboardingStepLayout
      activeStep={6}
      title="Настрой свой визуальный стиль"
      description="Выбери оформление, которое вдохновляет тебя. Стиль всегда можно изменить в настройках"
      buttonLabel="Применить стиль"
      buttonDisabled={selected === null}
      secondaryButtonLabel="Предпросмотр"
      secondaryButtonDisabled={selected === null}
      onPressSecondary={() =>
        navigation.navigate('StylePreview', { initialId: VISUAL_STYLES[selected!].id })
      }
      // TODO: applying a non-Cosmos style doesn't actually re-theme the app
      // yet (see theme/visualStyles.ts) — Main is also the real next step
      // once Home exists, this isn't a temporary stub the way earlier
      // screens' onPressNext were.
      onPressNext={() => navigation.replace('Main')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.grid}>
        {VISUAL_STYLES.map((style, index) => (
          <StyleGridTile
            key={style.id}
            styleId={style.id}
            name={style.name}
            size={tileSize}
            selected={selected === index}
            onPress={() => setSelected(index)}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
});
