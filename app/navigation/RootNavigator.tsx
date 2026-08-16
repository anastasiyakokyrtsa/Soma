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
import { ChooseApproachScreen } from '../screens/onboarding/ChooseApproachScreen';
import { VisualStyleScreen } from '../screens/onboarding/VisualStyleScreen';
import { StylePreviewScreen } from '../screens/onboarding/StylePreviewScreen';
import { PersonalizationScreen } from '../screens/onboarding/PersonalizationScreen';
import { ProfileStartScreen } from '../screens/onboarding/ProfileStartScreen';
import { ProfileDateOfBirthScreen } from '../screens/onboarding/ProfileDateOfBirthScreen';
import { ProfileSleepScheduleScreen } from '../screens/onboarding/ProfileSleepScheduleScreen';
import { ProfileMenstrualCycleScreen } from '../screens/onboarding/ProfileMenstrualCycleScreen';
import { ProfileMoodScreen } from '../screens/onboarding/ProfileMoodScreen';
import { DevMenuScreen } from '../screens/DevMenuScreen';

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
        // __DEV__-only: start on a screen picker instead of Splash so
        // reviewing one specific screen in Expo Go doesn't mean replaying
        // the whole onboarding flow every time. Never true in a real build.
        initialRouteName={__DEV__ ? 'DevMenu' : 'Splash'}
        screenOptions={{ headerShown: false, animation: 'none' }}
      >
        {__DEV__ ? <Stack.Screen name="DevMenu" component={DevMenuScreen} /> : null}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AboutApp1" component={AboutApp1Screen} />
        <Stack.Screen name="AboutApp2" component={AboutApp2Screen} />
        <Stack.Screen name="AboutApp3" component={AboutApp3Screen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="ChooseApproach" component={ChooseApproachScreen} />
        <Stack.Screen name="VisualStyle" component={VisualStyleScreen} />
        <Stack.Screen name="StylePreview" component={StylePreviewScreen} />
        <Stack.Screen name="Personalization" component={PersonalizationScreen} />
        <Stack.Screen name="ProfileStart" component={ProfileStartScreen} />
        <Stack.Screen name="ProfileDateOfBirth" component={ProfileDateOfBirthScreen} />
        <Stack.Screen name="ProfileSleepSchedule" component={ProfileSleepScheduleScreen} />
        <Stack.Screen name="ProfileMenstrualCycle" component={ProfileMenstrualCycleScreen} />
        <Stack.Screen name="ProfileMood" component={ProfileMoodScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
