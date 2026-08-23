import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { gradients } from '../../theme';
import { gradientIconPaths, type GradientIconName } from './gradientIconPaths';

export type { GradientIconName };

// Renders one of the kit's "Gradient" icon family (icons-clean/*.svg) - same
// 3-stop pink->lavender->violet fill as gradients.headingText, just with each
// icon's own real per-file diagonal direction (see gradientIconPaths.ts).
// preserveAspectRatio default ("xMidYMid meet", aspect-preserving, centered) -
// was "none" (force-stretch to an exact square box), which distorted every
// icon here since none of these source viewBoxes are actually square
// (seaWaves especially, 44.8x31.8 - a real ~1.4:1 rectangle forced into a
// square read as visibly squashed). Caught 2026-08-20 on MiniRitualTile's
// icons specifically ("иконки какие-то сплюснутые получились"), but this
// prop is shared by every GradientIcon caller (FocusCard/NavChip/
// ArticleLinkRow too) - the distortion was never scoped to just this one
// component, just most visible here.
export function GradientIcon({ name, size }: { name: GradientIconName; size: number }) {
  const def = gradientIconPaths[name];
  const gradIds = def.paths.map((_, i) => `${name}Grad${i}`);

  return (
    <Svg width={size} height={size} viewBox={def.viewBox}>
      <Defs>
        {def.paths.map((p, i) => {
          const g = p.gradient ?? def.gradient;
          return (
            <LinearGradient key={gradIds[i]} id={gradIds[i]} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} gradientUnits="userSpaceOnUse">
              <Stop offset={0.3} stopColor={gradients.headingText.colors[0]} />
              <Stop offset={0.7} stopColor={gradients.headingText.colors[1]} />
              <Stop offset={1} stopColor={gradients.headingText.colors[2]} />
            </LinearGradient>
          );
        })}
      </Defs>
      {def.paths.map((p, i) =>
        p.stroke ? (
          <Path key={i} d={p.d} stroke={`url(#${gradIds[i]})`} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ) : (
          <Path key={i} d={p.d} fill={`url(#${gradIds[i]})`} />
        )
      )}
    </Svg>
  );
}
