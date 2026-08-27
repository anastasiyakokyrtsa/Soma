import Svg, { Path } from 'react-native-svg';

// Ported from UI Kit/assets/icons-clean/close.svg - the source file is a
// sprite sheet (two copies of the X, one used by the kit, one dead weight
// outside the declared viewBox) - same pattern as BackIcon.tsx, cropped to
// just the one glyph actually meant to render.
export function CloseIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="22.8 22.8 38.4 38.4" fill="none">
      <Path
        d="M28.7646 27C28.313 27 27.8614 27.1724 27.5168 27.517C26.8277 28.2061 26.8277 29.3233 27.5168 30.0124L39.5046 42L27.5168 53.9876C26.8277 54.6767 26.8277 55.7939 27.5168 56.483C27.8618 56.828 28.3128 57 28.7646 57C29.2163 57 29.6673 56.828 30.0123 56.483L42 44.4954L53.9877 56.483C54.3327 56.828 54.7837 57 55.2354 57C55.6872 57 56.1382 56.828 56.4832 56.483C57.1723 55.7939 57.1723 54.6767 56.4832 53.9876L44.4954 42L56.4832 30.0124C57.1723 29.3233 57.1723 28.2061 56.4832 27.517C55.794 26.8279 54.6768 26.8279 53.9877 27.517L42 39.5046L30.0123 27.517C29.6677 27.1724 29.2161 27 28.7646 27Z"
        fill={color}
      />
    </Svg>
  );
}
