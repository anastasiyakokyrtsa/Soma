import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

// Placeholder tab bar — replace with the kit's real Bottom Bar (SVG dome shape,
// FAB, active-icon glow) once that component is ported. Screens/onboarding stack
// (2 branches: Научный/Астрологический) still need building on top of this.
const Tab = createBottomTabNavigator();

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

function TabNavigator() {
  // bottom-tabs is supposed to pad itself for the device's safe area automatically,
  // but that wasn't landing on Android (labels sat flush against the gesture bar) —
  // sizing the bar off the real inset here instead of trusting the library default.
  const insets = useSafeAreaInsets();
  // floor it at 16 even if the device reports a 0 inset, so labels never sit
  // flush against the physical edge regardless of gesture-nav vs 3-button nav
  const bottomPad = Math.max(insets.bottom, 16);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg0,
          borderTopColor: colors.borderSoft,
          height: 56 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad,
        },
        tabBarActiveTintColor: colors.violet300,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen name="Home">{() => <PlaceholderScreen label="Главный экран" />}</Tab.Screen>
      <Tab.Screen name="Journal">{() => <PlaceholderScreen label="Дневник" />}</Tab.Screen>
      <Tab.Screen name="Stats">{() => <PlaceholderScreen label="Статистика" />}</Tab.Screen>
      <Tab.Screen name="Profile">{() => <PlaceholderScreen label="Профиль" />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}
