import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '../screens/SplashScreen';
import { AboutApp1Screen } from '../screens/onboarding/AboutApp1Screen';
import { AboutApp2Screen } from '../screens/onboarding/AboutApp2Screen';
import { AboutApp3Screen } from '../screens/onboarding/AboutApp3Screen';
import { NameScreen } from '../screens/onboarding/NameScreen';
import { EmailScreen } from '../screens/onboarding/EmailScreen';
import { GenderScreen } from '../screens/onboarding/GenderScreen';
import { SupportScreen } from '../screens/onboarding/SupportScreen';

// Single stack for the whole app: splash -> onboarding -> "Main" (the tab
// navigator). Splash auto-advances (see SplashScreen.tsx); AboutApp3 calls
// navigation.replace('Main') so onboarding isn't left in the back-stack once
// the user is past it.
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg0,
    card: colors.bg0,
    primary: colors.violet400,
    text: colors.textPrimary,
    border: colors.borderSoft,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      {/* animation: 'none' — each screen fades its own content in via Reanimated
          (see OnboardingSlide.tsx/SplashScreen.tsx), so the native transition
          would just double up on top of that, not fully controllable on
          Android anyway (animationDuration is iOS-only). */}
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'none' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AboutApp1" component={AboutApp1Screen} />
        <Stack.Screen name="AboutApp2" component={AboutApp2Screen} />
        <Stack.Screen name="AboutApp3" component={AboutApp3Screen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
