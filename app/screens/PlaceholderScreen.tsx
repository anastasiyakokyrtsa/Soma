import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, type } from '../theme';

// Stand-in until each tab's real screen is built from Figma — swap out one at a
// time, same principle as the UI Kit: add what's missing as we get to it.
export function PlaceholderScreen({ label }: { label: string }) {
  return (
    // Единый fade-in вход по всему приложению (2026-09-06: "на всех
    // экранах должен быть такой переход для единообразия") - см. HomeScreen.
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontFamily: type.bodyL.fontFamily,
    fontSize: type.bodyL.fontSize,
  },
});
