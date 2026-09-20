import Svg, { Path } from 'react-native-svg';

// No "eye" glyph exists yet in UI Kit/assets/icons-clean, and the Figma node
// she pointed to (806-2157) isn't reachable from here (Figma MCP isn't
// authorized in this session) - so this is the standard filled
// eye/visibility glyph (same shape as Material's "visibility" icon: an
// almond outline built as a ring via evenodd fill, plus a solid pupil
// circle), not a 1:1 port. Matches this icon set's own convention either
// way - single flat fill, no stroke. Worth swapping for the real Figma
// asset later if she wants pixel-exact.
export function EyeIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5C6.8 5 2.27 8.11 0 12.5 2.27 16.89 6.8 20 12 20s9.73-3.11 12-7.5C21.73 8.11 17.2 5 12 5Zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3Z"
        fill={color}
      />
    </Svg>
  );
}
