import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { gradients } from '../../theme';
import { gradientIconPaths, type GradientIconName } from './gradientIconPaths';

export type { GradientIconName };

// Renders one of the kit's "Gradient" icon family (icons-clean/*.svg) - same
// 3-stop pink->lavender->violet fill as gradients.headingText, just with each
// icon's own real per-file diagonal direction (see gradientIconPaths.ts).
// preserveAspectRatio="none" matches Figma's own technique for these (a
// mask-image sized to an exact square frame, e.g. 28x28, stretching a
// non-square source shape to fit) - not the RN/SVG default "contain" behavior.
export function GradientIcon({ name, size }: { name: GradientIconName; size: number }) {
  const def = gradientIconPaths[name];
  const gradIds = def.paths.map((_, i) => `${name}Grad${i}`);

  return (
    <Svg width={size} height={size} viewBox={def.viewBox} preserveAspectRatio="none">
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
