import Svg, { Rect } from 'react-native-svg';

// Take 2 - the first version ported the two bars straight out of UI Kit's
// play.svg sprite (a non-square, off-origin viewBox cropped from a larger
// sheet) and it rendered visibly off/cut off on her device ("кнопка с
// двумя палочками, она кривая, там как-то не полностью палки видно и как
// будто они не по середине"). Rather than debug why that specific ported
// path misbehaved, drawn fresh instead: two simple rounded bars in a clean
// square viewBox, symmetric by construction (equal margins on both sides,
// equal gap) - can't be off-center since there's no inherited geometry to
// get wrong.
export function PauseIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={4} width={5} height={16} rx={2} fill={color} />
      <Rect x={14} y={4} width={5} height={16} rx={2} fill={color} />
    </Svg>
  );
}
