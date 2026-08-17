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
        // Floats the custom dome-shaped BottomBar over the screen content
        // (transparent gaps either side of the dome are meant to show
        // content behind them) instead of React Navigation's default of
        // reserving a solid rectangular strip and shrinking screens to fit
        // above it - each screen accounts for the bar's own height via its
        // own bottom padding instead (see e.g. HomeScreen.tsx).
        tabBarStyle: { position: 'absolute', backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0 },
      }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Care" component={CareScreen} />
      <Tab.Screen name="Journal">{() => <PlaceholderScreen label="Дневник" />}</Tab.Screen>
      <Tab.Screen name="Analytics">{() => <PlaceholderScreen label="Статистика" />}</Tab.Screen>
    </Tab.Navigator>
  );
}
