import Svg, { Path, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors, glow } from '../../theme';
import { navIconPaths, type NavIconName } from './navIconPaths';

export type { NavIconName };

// Bottom Tab Bar icon - white outline (default) or solid violet400 (active),
// see navIconPaths.ts for why no clip-path port was needed.
//
// Active glow (kit: `.bottombar-item img.icon-active{filter:drop-shadow(0 0
// 5px #8B7CF6)}`) lives here, not as a boxShadow on a wrapping View the way
// BottomBar used to do it (that shadowed the View's rectangular box, read
// as a glowing square, not hugging the icon's real outline - 2026-08-20:
// "свечение должно обволакивать не квадрат а саму иконку по контуру").
// First real port used an SVG FeDropShadow filter directly on the Path -
// real bug, not a rendering choice: on this platform/react-native-svg
// version, FeDropShadow's filter region rendered as a solid opaque
// rectangle and the shadow itself never showed (2026-08-20: "свечения не
// вижу как в ките"). Switched to the same proven technique this app
// already uses for glowing strokes elsewhere (BiorhythmChart rings/curves):
// a duplicate, blurred copy of the same Path drawn underneath the crisp
// one, both filled the same violet400 - works here specifically because
// the active icon's own fill color already *is* the glow color (unlike
// BottomBar's dark-filled dome, which needed a separately-colored stroke
// instead - see that file's own comment).
export function NavIcon({ name, active, size = 27 }: { name: NavIconName; active?: boolean; size?: number }) {
  const def = navIconPaths[name];
  return (
    <Svg width={size} height={size} viewBox={def.viewBox} preserveAspectRatio="none">
      {active ? (
        <>
          <Defs>
            <Filter id="navGlowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation={glow.iconGradient.blur / 2} />
            </Filter>
          </Defs>
          <Path d={def.d} fill={colors.violet400} filter="url(#navGlowBlur)" />
        </>
      ) : null}
      <Path d={def.d} fill={active ? colors.violet400 : colors.textPrimary} />
    </Svg>
  );
}
