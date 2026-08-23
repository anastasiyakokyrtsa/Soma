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
    // Real root cause of the persistent "black area above the bar" - not a
    // rendering effect at all. `wrap` was `position:'relative'`, so this
    // component sat in NORMAL FLEX FLOW as a sibling *below* the screens
    // container inside react-navigation's own layout (MainTabs.tsx's
    // `tabBarStyle:{position:'absolute',...}` comment claimed this floats
    // over content, but that style is only used by the *library's own*
    // default tab bar - it's never applied when a custom `tabBar` render
    // prop is used, confirmed by reading getTabBarHeight/BottomTabView's
    // actual source). With no `position:'absolute'` here, react-navigation
    // reserved real flex space below the screen for this component and the
    // screen ended flush above it - so the SVG's legitimately-transparent
    // headroom above the dome had nothing behind it but the app's own
    // unstyled root background, not the screen's stars/content (2026-08-20:
    // "мне нужно чтобы фон задний, тексты и тд, было видно выше светящейся
    // линии" - confirmed nothing was showing through, because nothing was
    // there to show). Fixed by making `wrap` itself `position:'absolute'`,
    // anchored to the bottom of whatever contains both the screens and this
    // bar (any RN View is a valid positioning context for its descendants,
    // no explicit `position:'relative'` needed the way CSS requires) - now
    // the screen genuinely fills the full height behind it, matching the
    // "floats over content" behavior this always should have had.
    <View style={[styles.wrap, { width, left: (screenWidth - width) / 2, height: height + insets.bottom, paddingBottom: insets.bottom }]}>
      {/* Kit's glow is filter:drop-shadow() on the SVG, tracing the dome's
          own alpha silhouette. Three attempts to get a real glow rendering
          here, each ruled out for a concrete reason, worth reading in full
          before touching this again:
          1. FeDropShadow filter on the Path - the filter *region* itself
             rasterized as an opaque black rectangle instead of a
             transparent backing, visible across the whole 412x125 canvas
             (2026-08-20: "зачем над баром ещё кусок черной полосы").
          2. FeGaussianBlur on a stroked duplicate (same idea, different
             primitive) - identical symptom, still there ("эту область
             черную над баром я все равно вижу"), so it's the `<Filter>`
             region mechanism itself, not the specific primitive.
          3. Filter-free multi-layer stroked glow (this technique, kept) +
             `overflow:'visible'` on the Svg style (to stop the wide outer
             layers clipping at the dome's edges) - the black rectangle
             was STILL there after this round. `overflow:'visible'` on an
             RN-SVG <Svg> is a known trigger for hardware-layer compositing
             without alpha on Android - almost certainly the same
             opaque-backing symptom recurring for a third, unrelated
             reason. Removed it - accepting that the widest glow layers
             now clip slightly at the dome's left/right/bottom edges
             (where it sits flush with the viewBox boundary) rather than
             risk the black rectangle a third time; kept every layer's own
             `strokeWidth` modest enough that the clipped sliver is minor.
          Glow itself: went from 4 coarse steps to 7 finer ones, closer
          together in both width and opacity, to read as a smooth falloff
          instead of visible discrete rings (2026-08-20: "свечение ужасно
          смотрится... какими-то слоями... как в ките") - a real blur
          isn't safely available here (see above), so more/closer steps is
          the best available approximation. */}
      {/* strokeWidths widened ~35% (22/18/14/11/8/6/3, was 16/13/10/8/6/4/2)
          - her explicit ask, 2026-08-20: "свечение линии чуть усиленнее,
          именно spread" (spread specifically, not just brightness) -
          opacities left as-is. */}
      <Svg width={width} height={height} viewBox={`0 0 ${BAR_VIEWBOX_W} ${BAR_VIEWBOX_H}`} style={styles.svg}>
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={22} strokeOpacity={0.035} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={18} strokeOpacity={0.05} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={14} strokeOpacity={0.07} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={11} strokeOpacity={0.1} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={8} strokeOpacity={0.14} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={6} strokeOpacity={0.2} />
        <Path d={DOME_PATH} fill="none" stroke={colors.violet400} strokeWidth={3} strokeOpacity={0.28} />
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
    position: 'absolute',
    bottom: 0,
  },
  // NOT overflow:'visible' - the kit's own .bottombar-svg has it (so its
  // glow isn't clipped at the dome's edges), but on this Svg it turned out
  // to trigger the same opaque-black-rectangle symptom as the broken SVG
  // filters (see the long comment above) - a known RN/Android footgun
  // where overflow:'visible' forces hardware-layer compositing without
  // alpha. Left off; the glow's own strokeWidths are kept modest enough
  // that the resulting edge-clipping is minor.
  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
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
