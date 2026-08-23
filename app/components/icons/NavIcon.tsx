import Svg, { Path, Defs, Filter, FeDropShadow } from 'react-native-svg';
import { colors, glow } from '../../theme';
import { navIconPaths, type NavIconName } from './navIconPaths';

export type { NavIconName };

// Bottom Tab Bar icon - white outline (default) or solid violet400 (active),
// see navIconPaths.ts for why no clip-path port was needed.
//
// Active glow (kit: `.bottombar-item img.icon-active{filter:drop-shadow(0 0
// 5px #8B7CF6)}`) lives here, as a real SVG FeDropShadow filter on the
// icon's own Path - not a boxShadow on a wrapping View the way BottomBar
// used to do it. A View's boxShadow shadows its rectangular layout box, so
// the glow rendered as a square around the icon instead of hugging the
// icon's actual outline (caught 2026-08-20: "свечение должно обволакивать
// не квадрат а саму иконку по контуру").
export function NavIcon({ name, active, size = 27 }: { name: NavIconName; active?: boolean; size?: number }) {
  const def = navIconPaths[name];
  return (
    <Svg width={size} height={size} viewBox={def.viewBox} preserveAspectRatio="none">
      {active ? (
        <Defs>
          <Filter id="navGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeDropShadow dx={0} dy={0} stdDeviation={glow.iconGradient.blur / 2} floodColor={glow.iconGradient.color} />
          </Filter>
        </Defs>
      ) : null}
      <Path d={def.d} fill={active ? colors.violet400 : colors.textPrimary} filter={active ? 'url(#navGlow)' : undefined} />
    </Svg>
  );
}
