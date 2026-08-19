import { StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { STARS_SVG } from './starsSvgSource';

// Renders her real exported "Stars" SVG (not a code-drawn/Skia recreation -
// see starsSvgSource.ts) stretched to cover an arbitrary width/height via
// preserveAspectRatio="none", same technique used everywhere else in this
// app for a responsive SVG whose internal coordinates shouldn't be touched.
// Meant to sit as an absolutely-positioned first child inside a scrollable
// content column (behind the real content, scrolling together with it, not
// a fixed viewport backdrop) - the caller measures its own content height
// (e.g. ScrollView's onContentSizeChange) and passes it down as `height`.
export function StarsBackground({ width, height }: { width: number; height: number }) {
  if (width <= 0 || height <= 0) return null;
  return (
    <SvgXml
      xml={STARS_SVG}
      width={width}
      height={height}
      viewBox="0 0 412 1955"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFillObject}
    />
  );
}
