import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { AboutApp1Screen } from '../screens/onboarding/AboutApp1Screen';
import { AboutApp2Screen } from '../screens/onboarding/AboutApp2Screen';
import { AboutApp3Screen } from '../screens/onboarding/AboutApp3Screen';

// Single stack for the whole app: onboarding screens, then "Main" (the tab
// navigator). AboutApp3 calls navigation.replace('Main') so onboarding isn't
// left in the back-stack once the user is past it.
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
      <Stack.Navigator initialRouteName="AboutApp1" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AboutApp1" component={AboutApp1Screen} />
        <Stack.Screen name="AboutApp2" component={AboutApp2Screen} />
        <Stack.Screen name="AboutApp3" component={AboutApp3Screen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
