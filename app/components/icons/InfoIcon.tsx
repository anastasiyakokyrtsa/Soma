import Svg, { Path } from 'react-native-svg';

// Ported from UI Kit/assets/icons-clean/info.svg — used next to "Пропустить
// онбординг" on the profile-setup steps (Name/Email/Gender/Support).
export function InfoIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0.24 0.24 43.52 43.52" fill="none">
      <Path
        d="M21.9999 4.3999C12.2803 4.3999 4.3999 12.2803 4.3999 21.9999C4.3999 31.7195 12.2803 39.5999 21.9999 39.5999C31.7195 39.5999 39.5999 31.7195 39.5999 21.9999C39.5999 12.2803 31.7195 4.3999 21.9999 4.3999ZM23.4666 30.7999H20.5332V20.5332H23.4666V30.7999ZM21.9999 16.8666C20.7855 16.8666 19.7999 15.881 19.7999 14.6666C19.7999 13.4522 20.7855 12.4666 21.9999 12.4666C23.2143 12.4666 24.1999 13.4522 24.1999 14.6666C24.1999 15.881 23.2143 16.8666 21.9999 16.8666Z"
        fill={color}
      />
    </Svg>
  );
}
