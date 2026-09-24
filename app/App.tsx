import { StatusBar } from 'expo-status-bar';
import { createElement } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

function isDesktopWeb() {
  return Platform.OS === 'web' && typeof window !== 'undefined' && window.self === window.top && window.innerWidth > 700;
}

function DesktopPhoneFrame() {
  const { height } = useWindowDimensions();
  return (
    <View style={styles.desktopPage}>
      <View style={[styles.desktopPhone, { height: Math.min(844, height - 48) }]}>
        {createElement('iframe', {
          src: window.location.href,
          title: 'Soma',
          style: { width: '100%', height: '100%', border: 0 },
        })}
      </View>
    </View>
  );
}

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

  // Web link opened on a computer: show the app inside a phone-sized frame.
  // An iframe (loading this same page) rather than a CSS-scaled wrapper, so
  // the app inside sees a real ~390px-wide window and every
  // useWindowDimensions-based layout in it behaves exactly as on a phone.
  if (isDesktopWeb()) {
    return <DesktopPhoneFrame />;
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.violet400} />
      </View>
    );
  }

  return (
    // Required root wrapper for react-native-gesture-handler (InfoSheet's
    // swipe-to-dismiss, added 2026-09-13) - gestures silently don't register
    // without it, this isn't optional decoration.
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  desktopPage: {
    flex: 1,
    backgroundColor: '#02030c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopPhone: {
    width: 390,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
    backgroundColor: colors.bg0,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
