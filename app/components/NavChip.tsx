import { useState } from 'react';
import { Pressable, View, Text, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// Ports UI Kit's "Navigation Chip" (.nav-chip, style.css ~L364) - WF Home's
// practice-shortcut row (Дыхание/Звуки природы/Медитации/Сказки/
// Успокаивающая музыка). Border only appears on press in the kit (no
// standing ring at rest) - RN-safe transparent->borderVioletFlat swap,
// same pattern as OptionRow/SelectChip/MiniRitualTile.
export function NavChip({ icon, label, onPress }: { icon: GradientIconName; label: string; onPress?: () => void }) {
  // Real --card-fill port (was colors.cardFillFallback, the same flat
  // stand-in MoonSunCard/MiniRitualTile had before their own fixes -
  // 2026-08-20). This chip's width is intrinsic (hugs its own label, no
  // fixed prop like the other cards had) so there's no width to pass
  // upfront the way those did - measured via onLayout instead, then given
  // to the Svg/Rect as real numbers rather than percentages (the "100%"
  // + no explicit size version hard-cut off a gradient on MiniRitualTile's
  // own elongated shape earlier this session - not worth risking here on
  // this chip's opposite, very wide/short aspect ratio without a live
  // device to check).
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <Pressable style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]} onPress={onPress} onLayout={onLayout}>
      {size ? (
        <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id={`navChipFill-${icon}`} cx="50%" cy="50%" r="70.7%">
              <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
              <Stop offset="0.318" stopColor="#000000" stopOpacity={0.1} />
              <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={size.width} height={size.height} fill={`url(#navChipFill-${icon})`} />
        </Svg>
      ) : null}
      {/* second --card-fill layer (flat linear-gradient(rgba(255,255,255,.02)...)
          wash on top of the radial one) - same 2-layer recipe as MoonSunCard. */}
      <View style={styles.whiteWash} pointerEvents="none" />
      <GradientIcon name={icon} size={20} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 60,
    paddingHorizontal: 24,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipPressed: {
    borderColor: colors.borderVioletFlat,
    transform: [{ scale: 0.98 }],
  },
  whiteWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
