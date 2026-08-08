import Svg, { Path } from 'react-native-svg';

// Ported from UI Kit/assets/icons-clean/next-page.svg — a self-contained
// circle+arrow glyph (the circle and chevron are one shape). The kit's own
// version dims this to 30%/60% opacity since it's meant to float as a soft
// badge with nothing behind it — but now it always sits on our own
// translucent mood-colored backdrop (StylePreviewScreen's MOOD.iconBackdrop),
// so dimming *both* layers compounded into a washed-out look. Review
// 2026-08-08: "зачем ты снизил прозрачность и у обводок и самих стрелок...
// тут пусть останется цвет" — the backdrop carries the softness now, the
// glyph itself renders at full, clear opacity on top of it. Only real
// addition over the original kit port is the `color` prop, needed so it can
// flip dark on light-backdrop themes (Focus) instead of staying hardcoded
// white.
export function NextPageIcon({
  size = 38.5,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="23.35 23.35 38.50 38.50" fill="none">
      <Path
        d="M42.5 25C52.1648 25 60 32.8352 60 42.5C60 52.1648 52.1648 60 42.5 60C32.8352 60 25 52.1648 25 42.5C25 32.8352 32.8352 25 42.5 25ZM47.9544 43.6319C48.2615 43.3328 48.4349 42.9216 48.4349 42.4928C48.4349 42.0641 48.2615 41.6536 47.9544 41.3538L40.5058 34.0857C39.8782 33.4732 38.8703 33.4843 38.2563 34.1135C37.643 34.7427 37.6549 35.7498 38.2841 36.3631L44.565 42.492L38.269 48.6353C37.6398 49.2486 37.627 50.2565 38.2411 50.8849C38.553 51.2047 38.9666 51.3653 39.3802 51.3653C39.7811 51.3653 40.182 51.215 40.4907 50.9135L47.9544 43.6319Z"
        fill={color}
      />
    </Svg>
  );
}
