import Svg, { Path, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors } from '../../theme';
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
// Each icon's viewBox in navIconPaths.ts is a tight bounding box around its
// own path (ported straight from Figma's export), with no spare room - fine
// for the plain outline, but the active glow's blur (stdDeviation 4.5) needs
// somewhere to fade into before hitting that boundary, same clipping bug
// fixed tonight in BiorhythmChart/SleepWheelPicker/BottomBar. This is the
// bottom tab bar - on screen on every tab, in its highlighted state - so
// it's a real, visible instance, not a hypothetical one (her 2026-09-29 ask
// to check every glow spot for this exact iOS symptom).
// Padding is proportional (not a flat px number) since each icon's own
// viewBox is a different, sometimes non-square, size - and computed
// per-axis in pixel space (canvasW/H, marginX/Y) rather than baked into the
// viewBox unconditionally, so the icon's own crisp size in `size`x`size`
// never shrinks to make room; only the (inactive-by-default, invisible)
// canvas around it grows, same "grow the canvas + fold it back with a
// negative margin" technique as BottomBar's own dome glow.
const NAV_GLOW_PAD_RATIO = 0.22;

export function NavIcon({ name, active, size = 27 }: { name: NavIconName; active?: boolean; size?: number }) {
  const def = navIconPaths[name];
  const [vx, vy, vw, vh] = def.viewBox.split(' ').map(Number);
  const padUnits = Math.max(vw, vh) * NAV_GLOW_PAD_RATIO;
  const scaleX = size / vw;
  const scaleY = size / vh;
  const padPxX = padUnits * scaleX;
  const padPxY = padUnits * scaleY;
  const paddedViewBox = `${vx - padUnits} ${vy - padUnits} ${vw + padUnits * 2} ${vh + padUnits * 2}`;

  return (
    <Svg
      width={size + padPxX * 2}
      height={size + padPxY * 2}
      viewBox={paddedViewBox}
      preserveAspectRatio="none"
      style={{ marginHorizontal: -padPxX, marginVertical: -padPxY }}
    >
      {active ? (
        <>
          <Defs>
            {/* stdDeviation bumped ~2.5->4.5, plus drawing the blurred
                copy twice (kit's own doubled-filter intensity trick, also
                used for the dome's glow) - the single-layer version at the
                literal kit blur value read as too weak on her device
                (2026-08-20: "иконкам прибавь свечения"). */}
            <Filter id="navGlowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation={4.5} />
            </Filter>
          </Defs>
          <Path d={def.d} fill={colors.violet400} filter="url(#navGlowBlur)" />
          <Path d={def.d} fill={colors.violet400} filter="url(#navGlowBlur)" />
        </>
      ) : null}
      <Path d={def.d} fill={active ? colors.violet400 : colors.textPrimary} />
    </Svg>
  );
}
