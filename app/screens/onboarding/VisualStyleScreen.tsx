import { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { OnboardingStepLayout } from './OnboardingStepLayout';
import { StyleGridTile } from '../../components/StyleGridTile';
import { getVisualStyles } from '../../theme/visualStyles';
import { spacing } from '../../theme';
import { useT } from '../../i18n/useT';
import { useLanguage } from '../../i18n/LanguageContext';

const GRID_GAP = 12;

// Her catch (2026-11-23): Focus/Nature/Dawn looked pickable but applying
// them does nothing (theme/visualStyles.ts's own comment already flagged
// this - only Cosmos is a real built theme). Pre-selecting it and marking
// the rest "Скоро" so the screen stops presenting a choice that isn't
// real, same convention as ChooseApproachScreen's fix just above it.
const AVAILABLE_STYLE_ID = 'cosmos';

export function VisualStyleScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const tileSize = (width - spacing.screenPadding * 2 - GRID_GAP) / 2;
  const t = useT();
  const { language } = useLanguage();
  const visualStyles = getVisualStyles(language);
  const [selected, setSelected] = useState<number | null>(
    visualStyles.findIndex((s) => s.id === AVAILABLE_STYLE_ID)
  );

  return (
    <OnboardingStepLayout
      activeStep={6}
      title={t('onboarding.visualStyleTitle')}
      description={t('onboarding.visualStyleDescription')}
      buttonLabel={t('onboarding.applyStyle')}
      buttonDisabled={selected === null}
      onPressNext={() => navigation.replace('Personalization')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.grid}>
        {visualStyles.map((style, index) => (
          <StyleGridTile
            key={style.id}
            styleId={style.id}
            name={style.name}
            size={tileSize}
            selected={selected === index}
            onPress={() => setSelected(index)}
            onPressPreview={() => navigation.navigate('StylePreview', { initialId: style.id })}
            available={style.id === AVAILABLE_STYLE_ID}
            soonLabel={t('tea.soonBadge')}
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
