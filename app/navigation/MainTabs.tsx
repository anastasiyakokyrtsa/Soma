import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CareScreen } from '../screens/CareScreen';
import { BottomBar } from '../components/BottomBar';

// Real Bottom Bar now ported (BottomBar.tsx - SVG dome shape, FAB,
// active-icon glow), replacing the old placeholder tabBarStyle.
//
// Route set renamed from the earlier placeholder guess (Home/Journal/Stats/
// Profile) to Home/Care/Journal/Analytics - the literal tab set+order shown
// in the Home screen's own Figma bottom-bar instance (node 488:1054,
// "Analytics" being the kit's internal English name for what the product
// copy calls "Статистика", per the kit's English-internal-naming
// convention). Figma's bar has no "Profile" tab at all - not carried
// forward here; where profile access lives is still an open question for a
// later screen, not decided by this change.
const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // `tabBarStyle` (position/backgroundColor/etc.) was removed 2026-08-20 -
      // it's only ever consumed by react-navigation's own default tab bar's
      // height calculation and never applied to a custom `tabBar` render
      // prop's actual output (confirmed by reading the library source), so
      // it was silently doing nothing here. BottomBar floats over screen
      // content because its own `wrap` style is `position:'absolute'`
      // directly - that's the real, load-bearing mechanism, not this prop.
      tabBar={(props) => <BottomBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Care" component={CareScreen} />
      <Tab.Screen name="Journal">{() => <PlaceholderScreen label="Дневник" />}</Tab.Screen>
      <Tab.Screen name="Analytics">{() => <PlaceholderScreen label="Статистика" />}</Tab.Screen>
    </Tab.Navigator>
  );
}
