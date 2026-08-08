import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  NunitoSans_300Light,
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';
import { IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { Fredoka_500Medium, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { RootNavigator } from './navigation/RootNavigator';
import { colors } from './theme';

// The app itself is Nunito Sans everywhere, no exceptions (kit rule). These
// extra families are scoped to exactly one place: the visual-style preview
// screen's real chrome (header/tagline/button), where each style's mood
// gets its own typeface on purpose — see
// screens/onboarding/StylePreviewScreen.tsx. Focus/Nature's fonts went
// through 2 rounds (2026-08-08): Space Mono -> IBM Plex Mono ("более
// строгий" — Plex Mono is IBM's own engineered-precision mono, reads more
// rigid/technical than Space Mono's slightly quirky retro character);
// Quicksand -> Fraunces -> Fredoka ("более мягкий и округлый" — Fredoka's
// terminals are genuinely round/bouncy, closer to the organic warmth she
// wanted than Fraunces' soft-but-still-serif letterforms). Dawn's Cormorant
// Garamond wasn't flagged again, unchanged since the first swap.

// Splash screen (app/screens/SplashScreen.tsx) is approved but not wired into
// this flow yet — TODO: show it first, then hand off to RootNavigator after
// its animation completes, instead of skipping straight to onboarding.

export default function App() {
  const [fontsLoaded] = useFonts({
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.violet400} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
