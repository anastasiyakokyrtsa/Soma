import { Fragment } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, fontFamily } from '../theme';
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

// Exported so any screen that needs to reserve real clearance below its
// scrollable content (not a guessed flat number) can compute the bar's
// actual rendered height the same way this component does.
export const BAR_VIEWBOX_W = 412;
export const BAR_VIEWBOX_H = 125;
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
      {/* Kit's glow is filter:drop-shadow() on the SVG, tracing the dome's
          own alpha silhouette. Two filter-based attempts both left a real,
          visible opaque black rectangle above the dome (2026-08-20: first
          FeDropShadow, then FeGaussianBlur on a stroke - still "эту
          область черную над баром я все равно вижу" after the switch) -
          the filter *region* itself (Filter's x/y/width/height, expanded
          past the dome's own bounding box to give the blur room) appears to
          rasterize with an opaque backing on this platform, and since the
          <Svg> clips to its own viewBox by default, that oversized opaque
          region shows as a black fill across the whole 412x125 canvas,
          including the transparent headroom above the dome. Dropped SVG
          `<Filter>` entirely for this shape - no way to be sure any given
          filter primitive is safe here after two failures with two
          different primitives. Replaced with a filter-free glow: several
          plain stroked copies of the same path, widening and fading
          (manual falloff, no blur), same trick real design tools use when
          a true Gaussian blur isn't available. Also tuned wider/fainter
          per her follow-up ("свечение... слишком плотное... в ките оно
          пошире и более воздушное") - NavIcon's glow (small, tight
          bounding box) never showed this bug and stays on FeGaussianBlur,
          see that file. */}
      <Svg width={width} height={height} viewBox={`0 0 ${BAR_VIEWBOX_W} ${BAR_VIEWBOX_H}`} style={styles.svg}>
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={22} strokeOpacity={0.06} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={15} strokeOpacity={0.1} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={9} strokeOpacity={0.16} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={5} strokeOpacity={0.24} />
        <Path d={DOME_PATH} fill="#0C0D1B" />
      </Svg>

      <View style={[styles.content, { top: 50 * scale, height: 75 * scale, paddingHorizontal: 12 * scale }]}>
        {state.routes.map((route, index) => {
          const meta = TAB_ICONS[route.name];
          if (!meta) return null;
          const isActive = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isActive && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            // A blank 68px (FAB width) spacer sits between the 2nd and 3rd
            // real item in the kit's own markup (index.html's
            // .bottombar-content has 5 children under justify-content:
            // space-around - Home/Care/[68px spacer]/Journal/Analytics, not
            // 4) - reserves room for the FAB so the 4 real icons push out
            // toward the edges instead of spreading evenly across the full
            // width straight through where the FAB sits. Missing this
            // spacer was a real structural miss, not just a size/color one
            // (caught 2026-08-20, "оба элемента должны быть в точности как
            // в ui kit").
            <Fragment key={route.key}>
              {index === 2 ? <View style={{ width: 68 * scale }} /> : null}
              <Pressable
                style={[styles.item, { paddingVertical: 8 * scale, paddingHorizontal: 12 * scale }]}
                onPress={onPress}
              >
                {/* glow lives inside NavIcon itself now, not a boxShadow'd
                    wrapping View (see NavIcon.tsx for the technique/history).
                    30, not the kit's literal 27 - her explicit ask, 2026-08-20
                    ("сделай их наверное чуть покрупнее"). */}
                <NavIcon name={isActive ? meta.iconAlt : meta.icon} active={isActive} size={30 * scale} />
                <Text style={[styles.itemLabel, { fontSize: 10 * scale, height: 12 * scale }]}>{isActive ? meta.label : ''}</Text>
              </Pressable>
            </Fragment>
          );
        })}
      </View>

      {/* FAB opens a quick-action sheet - not yet designed/spec'd beyond the
          kit's own static "+" reference, so onPress is a no-op placeholder. */}
      <Pressable
        style={[
          styles.fab,
          { width: 68 * scale, height: 68 * scale, borderRadius: 34 * scale, marginLeft: -34 * scale, marginTop: -34 * scale, top: 50 * scale, left: width / 2 },
        ]}
      >
        <View style={[styles.iconPlusBar, { width: 30 * scale, height: 3 * scale, borderRadius: 2 * scale }]} />
        <View style={[styles.iconPlusBarVertical, { width: 3 * scale, height: 30 * scale, borderRadius: 2 * scale }]} />
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
    // kit's own .bottombar-svg is explicitly overflow:visible so its glow
    // isn't clipped at the dome's own edges (the dome sits close to the
    // viewBox boundary on the sides/bottom) - without this the new
    // stroke-based glow's outer layers would get cut off right where the
    // dome nearly touches the SVG's own edge.
    overflow: 'visible',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  itemLabel: {
    fontFamily: fontFamily.bold,
    color: colors.violet300,
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlusBar: {
    position: 'absolute',
    backgroundColor: colors.textPrimary,
  },
  iconPlusBarVertical: {
    position: 'absolute',
    backgroundColor: colors.textPrimary,
  },
});
