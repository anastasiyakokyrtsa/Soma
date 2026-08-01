import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

// Placeholder tab bar — replace with the kit's real Bottom Bar (SVG dome shape,
// FAB, active-icon glow) once that component is ported.
const Tab = createBottomTabNavigator();

export function MainTabs() {
  const insets = useSafeAreaInsets();
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
