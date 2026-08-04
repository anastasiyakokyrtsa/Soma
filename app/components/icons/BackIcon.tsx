import Svg, { Path } from 'react-native-svg';

// Ported from UI Kit/assets/icons-clean/go-back.svg (its own viewBox already
// crops the sprite down to just this arrow — the source file has a second,
// unused variant path outside that viewBox, dropped here as dead weight).
export function BackIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * (30.4 / 38.4)} viewBox="22.8 26.8 38.4 30.4" fill="none">
      <Path
        d="M38.1852 30.3408C37.8333 30.3464 37.4848 30.4854 37.2211 30.7584L27.2617 41.044C26.7454 41.5768 26.7454 42.4233 27.2617 42.9561L37.2211 53.2418C37.4906 53.5202 37.8492 53.6607 38.208 53.6607C38.5525 53.6607 38.898 53.5311 39.1654 53.2726C39.7106 52.7446 39.725 51.8735 39.1963 51.3283L31.4955 43.3751H55.75C56.509 43.3751 57.125 42.7591 57.125 42.0001C57.125 41.2411 56.509 40.6251 55.75 40.6251H31.4955L39.1963 32.6718C39.7243 32.1266 39.7106 31.2562 39.1654 30.7275C38.8925 30.4635 38.5371 30.3351 38.1852 30.3408Z"
        fill={color}
      />
    </Svg>
  );
}
