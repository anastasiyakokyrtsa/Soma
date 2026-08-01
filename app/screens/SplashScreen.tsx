import { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme';
import { SomaLogoAnimation } from '../components/SomaLogoAnimation';
import { StarField } from '../components/StarField';

// The screen a person sees the moment they open the app — 1:1 port of the
// "Логотип с анимацией" Figma Make file. See SomaLogoAnimation.tsx for what's
// exact vs. approximated in the port.
//
// Auto-advances into onboarding once the logo animation has had time to play
// out: ring draws in (~4.4s after the 0.6s start delay) + text bloom (~2s more,
// done ~6.9s in) + a beat to actually read "Soma" before moving on. If
// SomaLogoAnimation's timeline constants change, revisit ADVANCE_DELAY_MS too.
const ADVANCE_DELAY_MS = 8000;

export function SplashScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AboutApp1');
    }, ADVANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

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
