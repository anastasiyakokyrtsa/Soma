import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';
import { navIconPaths, type NavIconName } from './navIconPaths';

export type { NavIconName };

// Bottom Tab Bar icon - white outline (default) or solid violet400 (active),
// see navIconPaths.ts for why no clip-path port was needed.
export function NavIcon({ name, active, size = 27 }: { name: NavIconName; active?: boolean; size?: number }) {
  const def = navIconPaths[name];
  return (
    <Svg width={size} height={size} viewBox={def.viewBox} preserveAspectRatio="none">
      <Path d={def.d} fill={active ? colors.violet400 : colors.textPrimary} />
    </Svg>
  );
}
