import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// Ports UI Kit's "Navigation Chip" (.nav-chip, style.css ~L364) - WF Home's
// practice-shortcut row (Дыхание/Звуки природы/Медитации/Сказки/
// Успокаивающая музыка). Border only appears on press in the kit (no
// standing ring at rest) - RN-safe transparent->borderVioletFlat swap,
// same pattern as OptionRow/SelectChip/MiniRitualTile.
export function NavChip({ icon, label, onPress }: { icon: GradientIconName; label: string; onPress?: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]} onPress={onPress}>
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
    backgroundColor: colors.cardFillFallback,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipPressed: {
    borderColor: colors.borderVioletFlat,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
