import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: colors.bg0, borderTopColor: colors.borderSoft },
          tabBarActiveTintColor: colors.violet300,
          tabBarInactiveTintColor: colors.textTertiary,
        }}
      >
        <Tab.Screen name="Home">{() => <PlaceholderScreen label="Главный экран" />}</Tab.Screen>
        <Tab.Screen name="Journal">{() => <PlaceholderScreen label="Дневник" />}</Tab.Screen>
        <Tab.Screen name="Stats">{() => <PlaceholderScreen label="Статистика" />}</Tab.Screen>
        <Tab.Screen name="Profile">{() => <PlaceholderScreen label="Профиль" />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
