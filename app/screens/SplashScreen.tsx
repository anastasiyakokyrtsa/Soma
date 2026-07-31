import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { SomaLogoAnimation } from '../components/SomaLogoAnimation';

// The screen a person sees the moment they open the app — 1:1 port of the
// "Логотип с анимацией" Figma Make file. See SomaLogoAnimation.tsx for what's
// exact vs. approximated in the port.
export function SplashScreen() {
  return (
    <View style={styles.container}>
      <SomaLogoAnimation size={260} />
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
