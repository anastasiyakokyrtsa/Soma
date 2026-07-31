import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme';
import { SomaLogoAnimation } from '../components/SomaLogoAnimation';
import { StarField } from '../components/StarField';

// The screen a person sees the moment they open the app — 1:1 port of the
// "Логотип с анимацией" Figma Make file. See SomaLogoAnimation.tsx for what's
// exact vs. approximated in the port.
export function SplashScreen() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <StarField width={width} height={height} count={18} />
      <SomaLogoAnimation size={390} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
