import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors } from '../theme';
import { SomaLogoAnimation } from '../components/SomaLogoAnimation';
import { StarField } from '../components/StarField';

// The screen a person sees the moment they open the app — 1:1 port of the
// "Логотип с анимацией" Figma Make file. See SomaLogoAnimation.tsx for what's
// exact vs. approximated in the port.
//
// Auto-advances into onboarding once the logo has fully formed and "breathed"
// 3 times. From SomaLogoAnimation's own constants: the breathing pulse starts
// at PULSE_START = TEXT_DELAY(4.9s) + 0.8s = 5.7s, each cycle is PULSE_DUR =
// 3.0s — so 3 full cycles land at 5.7 + 3*3.0 = 14.7s. If those constants
// change, recompute this. The screen transition itself (fade) is handled by
// this screen's own entering animation, not the navigator's native transition
// — see OnboardingSlide.tsx for why.
const ADVANCE_DELAY_MS = 14700;

export function SplashScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AboutApp1');
    }, ADVANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(600).easing(Easing.inOut(Easing.cubic))}
    >
      <StarField width={width} height={height} count={18} />
      <SomaLogoAnimation size={390} />
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
});
