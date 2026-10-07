import { Fragment, useRef, useState } from 'react';
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
// Corners squared off (were r6 top / r26 bottom, via `Q` quadratic-curve
// commands into each corner) - her explicit ask, 2026-08-20: "углы по 4
// сторонам сделай просто без закруглений". Bar also goes back to filling
// the full screen width and sitting flush against the true bottom edge
// (both a brief side/bottom-margin experiment, reverted same day: "наверное
// странно... заполнял все пространство справа и слева... опусти вниз").
const DOME_PATH =
  'M 0,50 L 140.12,50 C 159.30,50 158.02,48.79 166.12,31.40 A 44,44 0 0,1 245.88,31.40 C 253.98,48.79 252.70,50 271.88,50 L 412,50 L 412,125 L 0,125 Z';
// Just the top silhouette (flat-hill-flat, open path, left edge to right
// edge) - no glow on the vertical side walls or the bottom edge, per her
// first ask ("убери просто свечение справа и слева и снизу"), but not
// narrowed to only the hill either - she caught that overcorrection right
// away ("почему свечение осталось только над кнопкой плюсом? продли по
// всему горизонту") - it needs to run the full width, just bulging up
// around the FAB in the middle rather than only existing there.
const DOME_TOP_PATH =
  'M 0,50 L 140.12,50 C 159.30,50 158.02,48.79 166.12,31.40 A 44,44 0 0,1 245.88,31.40 C 253.98,48.79 252.70,50 271.88,50 L 412,50';

// Filter-free glow (see the long history in the component below for why no
// SVG <Filter>/blur is used) - a smooth falloff needs many close, small
// steps rather than a few big jumps, and sharp miter corners at the dome's
// flat-to-curve joins need rounding or a wide stroke reads as a straight
// bar poking out of the curve (2026-08-20: "видны слои резкие переходы...
// свечение как будто линия горизонтальная накрывает"). Generated, not
// hand-typed, so the falloff curve is one formula to retune instead of N
// separate literals.
const GLOW_LAYER_COUNT = 14;
const GLOW_MAX_WIDTH = 24;
const GLOW_MIN_WIDTH = 2;
// Both cut ~30% from the previous 0.3/0.02 - her ask, 2026-08-20: "убери
// плотность свечения процентов на 30".
const GLOW_MAX_OPACITY = 0.21;
const GLOW_MIN_OPACITY = 0.014;
// Extra viewBox room on every side so the widest glow layers have somewhere
// to bleed into. The dome's own peak sits only ~6 units below the
// viewBox's y=0 (computed from the arc's own radius/chord - nowhere near
// enough clearance for a 24-wide stroke's 12-unit half-width bleed), so it
// was getting hard-clipped flat right at the viewBox boundary - exactly
// the "приплюснуто линией горизонтальной" (squashed flat by a horizontal
// line) she flagged - the *same* symptom `overflow:'visible'` would fix,
// but padding the viewBox itself is the technique already proven safe
// elsewhere in this app (BiorhythmChart's curve-peak clipping, same root
// cause) rather than risking that style prop's own history of trouble here.
const GLOW_PAD = 20;
const GLOW_LAYERS = Array.from({ length: GLOW_LAYER_COUNT }, (_, i) => {
  const t = i / (GLOW_LAYER_COUNT - 1); // 0 = widest/faintest (drawn first), 1 = narrowest/brightest (drawn last)
  return {
    width: GLOW_MAX_WIDTH - (GLOW_MAX_WIDTH - GLOW_MIN_WIDTH) * t,
    opacity: GLOW_MIN_OPACITY + (GLOW_MAX_OPACITY - GLOW_MIN_OPACITY) * Math.pow(t, 1.5),
  };
});

export function BottomBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const width = Math.min(screenWidth, BAR_VIEWBOX_W);
  const scale = width / BAR_VIEWBOX_W;
  const height = BAR_VIEWBOX_H * scale;
  const totalHeight = height + insets.bottom;

  // Two guesses at the real cause of "the bar floats above the true screen
  // edge" (2026-10-01, her repeated catch on both iOS and Android) already
  // failed: an explicit `top` computed from window height (wrong coordinate
  // space, made it worse everywhere), and a solid filler for the strip
  // DOME_PATH's own fill doesn't reach (reduced nothing - she reloaded and
  // still saw the same gap, so whatever's actually happening isn't a missing
  // fill either). Rather than theorize a *third* cause of a gap whose real
  // mechanism clearly isn't any of the above, this measures where the bar
  // actually lands in true screen coordinates (`measureInWindow` - real
  // device coordinates, not relative to whatever ancestor `position:
  // 'absolute'`/`bottom: 0` are silently resolving against, which is
  // apparently not the physical screen on this device/navigator
  // combination) and corrects any leftover gap directly, however large it
  // turns out to be, instead of computing a guessed number.
  const wrapRef = useRef<View>(null);
  const [floatingGap, setFloatingGap] = useState(0);

  // Re-measures on every real layout pass (onLayout), not once on a timer -
  // the previous rAF-based version may simply have fired before `wrapRef`
  // had a committed native view to measure, silently doing nothing and
  // reproducing the exact old behavior (which is exactly what she reported:
  // no change at all, not even a partial one).
  const measureGap = () => {
    wrapRef.current?.measureInWindow((_x, y, _w, measuredHeight) => {
      const gap = screenHeight - (y + measuredHeight);
      if (gap > 0.5) setFloatingGap(gap);
      else if (gap < -0.5) setFloatingGap(0);
    });
  };

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
    // there to show). Fixed by making `wrap` itself `position:'absolute'`.
    //
    // 2026-10-01: tried replacing `bottom: 0` below with an explicit `top`
    // computed from `useWindowDimensions`' own height, on the theory that
    // iOS's positioning ancestor might not span the full physical screen -
    // that theory was never actually confirmed, and the swap made the bar
    // float above the real edge on *both* platforms instead of just iOS (the
    // window's height isn't the same coordinate space as this View's actual
    // positioned ancestor, so computing `top` from it was simply wrong, not
    // just unverified). Reverted to the plain, Android-confirmed `bottom: 0`.
    // `bottom: -floatingGap` - 0 until the measurement effect above finds a
    // real gap, then pushes the bar down by exactly that much. See that
    // effect's own comment for why this measures instead of computing.
    <View
      ref={wrapRef}
      onLayout={measureGap}
      style={[
        styles.wrap,
        { width, left: (screenWidth - width) / 2, bottom: -floatingGap, height: totalHeight, paddingBottom: insets.bottom },
      ]}
    >
      {/* Kit's glow is filter:drop-shadow(), tracing the dome's alpha
          silhouette. No SVG <Filter> here (FeDropShadow, then
          FeGaussianBlur, both rasterized their filter *region* as an
          opaque black rectangle on this platform - a real, confirmed
          limitation, not a tuning problem) - this is a filter-free glow
          instead: GLOW_LAYERS above, stroked copies of DOME_TOP_PATH (the
          top silhouette only, not the whole bar outline - see that
          constant), widening/fading. strokeLinecap/strokeLinejoin="round" on every
          layer - without it, the sharp miter corner where the flat body
          meets the dome's curve read as a straight bar jutting out of the
          hill at wide stroke widths (2026-08-20: "свечение как будто линия
          горизонтальная накрывает"). */}
      <Svg
        width={width + 2 * GLOW_PAD * scale}
        height={height + 2 * GLOW_PAD * scale}
        viewBox={`${-GLOW_PAD} ${-GLOW_PAD} ${BAR_VIEWBOX_W + 2 * GLOW_PAD} ${BAR_VIEWBOX_H + 2 * GLOW_PAD}`}
        style={[styles.svg, { top: -GLOW_PAD * scale, left: -GLOW_PAD * scale }]}
      >
        {GLOW_LAYERS.map((layer, i) => (
          <Path
            key={i}
            d={DOME_TOP_PATH}
            fill="none"
            stroke={colors.violet400}
            strokeWidth={layer.width}
            strokeOpacity={layer.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        <Path d={DOME_PATH} fill="#0C0D1B" />
      </Svg>

      {/* DOME_PATH's own solid fill is drawn in an <Svg> sized to roughly
          `height` (BAR_VIEWBOX_H*scale) plus a small glow-headroom pad
          (~20px) - nowhere near enough to also cover the *extra* height this
          View itself gets from `insets.bottom` (home indicator on iOS, ~34px
          there - bigger than that glow pad, so real device content showed
          through underneath). The fill only reached as far as its own Svg's
          bottom edge, leaving the true bottom inset strip fully transparent
          - read as "the bar is floating above the screen edge" (2026-10-01,
          her catch - visible on iOS where insets.bottom is biggest, barely
          visible on Android where it's often smaller than the glow pad).
          Plain opaque filler, not another Svg shape - just needs to match
          the dome's own fill color and cover the inset exactly. */}
      <View style={[styles.insetFiller, { height: insets.bottom }]} pointerEvents="none" />

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
  },
  // Covers the bottom-inset strip DOME_PATH's own Svg doesn't reach - see
  // the comment where this is used.
  insetFiller: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0C0D1B',
  },
  // NOT overflow:'visible' - the kit's own .bottombar-svg has it (so its
  // glow isn't clipped at the dome's edges), but on this Svg it briefly
  // looked like a trigger for the same opaque-rectangle symptom the SVG
  // filters caused (that turned out to actually be BottomBar's own missing
  // position:'absolute', see the render body above) - left off anyway
  // since it's a known RN/Android footgun in general; the glow's own
  // strokeWidths stay modest enough that the resulting edge-clipping is minor.
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
