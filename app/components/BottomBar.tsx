import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, fontFamily, glow } from '../theme';
import { NavIcon, type NavIconName } from './icons/NavIcon';

// Ports UI Kit's `.bottombar` (index.html #navigation, style.css ~L605-645) -
// real SVG dome shape (flat top edge + cubic-bezier taper into the FAB's
// dome arc, not a CSS rounded-rect - see the kit CSS comment for why a
// circular fillet doesn't work here), 4 tabs either side of a floating
// centered FAB. Route <-> icon/label mapping is the literal Figma bottom-bar
// spec (Home/Care/Journal/Analytics, node 488:1054 on the Home screen frame)
// - not the earlier placeholder's Home/Journal/Stats/Profile - see
// MainTabs.tsx's own note on this rename.
const TAB_ICONS: Record<string, { icon: NavIconName; iconAlt: NavIconName; label: string }> = {
  Home: { icon: 'home', iconAlt: 'homeAlt', label: 'Home' },
  Care: { icon: 'care', iconAlt: 'careAlt', label: 'Care' },
  Journal: { icon: 'journal', iconAlt: 'journalAlt', label: 'Journal' },
  Analytics: { icon: 'analytics', iconAlt: 'analyticsAlt', label: 'Analytics' },
};

const BAR_VIEWBOX_W = 412;
const BAR_VIEWBOX_H = 125;
const DOME_PATH =
  'M 6,50 L 140.12,50 C 159.30,50 158.02,48.79 166.12,31.40 A 44,44 0 0,1 245.88,31.40 C 253.98,48.79 252.70,50 271.88,50 L 406,50 Q 412,50 412,56 L 412,99 Q 412,125 386,125 L 26,125 Q 0,125 0,99 L 0,56 Q 0,50 6,50 Z';

export function BottomBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth, 412);
  const scale = width / BAR_VIEWBOX_W;
  const height = BAR_VIEWBOX_H * scale;

  return (
    <View style={[styles.wrap, { width, height: height + insets.bottom, paddingBottom: insets.bottom }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${BAR_VIEWBOX_W} ${BAR_VIEWBOX_H}`} style={styles.svg}>
        <Path d={DOME_PATH} fill="#0C0D1B" />
      </Svg>

      <View style={[styles.content, { top: 50 * scale, height: 75 * scale }]}>
        {state.routes.map((route, index) => {
          const meta = TAB_ICONS[route.name];
          if (!meta) return null;
          const isActive = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isActive && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} style={styles.item} onPress={onPress}>
              <View style={isActive && styles.iconActiveGlow}>
                <NavIcon name={isActive ? meta.iconAlt : meta.icon} active={isActive} />
              </View>
              <Text style={styles.itemLabel}>{isActive ? meta.label : ''}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* FAB opens a quick-action sheet - not yet designed/spec'd beyond the
          kit's own static "+" reference, so onPress is a no-op placeholder. */}
      <Pressable style={[styles.fab, { top: 50 * scale, left: width / 2 }]}>
        <View style={styles.iconPlusBar} />
        <View style={styles.iconPlusBarVertical} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
    // dome glow - matches .bottombar-svg's drop-shadow(0 0 6px violet400 70%) x2
    boxShadow: `0px 0px 6px rgba(139,124,246,0.7)`,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
  },
  iconActiveGlow: {
    boxShadow: `0px 0px ${glow.iconGradient.blur}px ${glow.iconGradient.color}`,
  },
  itemLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    height: 12,
    color: colors.violet300,
  },
  fab: {
    position: 'absolute',
    width: 68,
    height: 68,
    marginLeft: -34,
    marginTop: -34,
    borderRadius: 34,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlusBar: {
    position: 'absolute',
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
  },
  iconPlusBarVertical: {
    position: 'absolute',
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
  },
});
