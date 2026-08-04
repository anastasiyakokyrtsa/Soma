import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';

// Ports UI Kit's .select-chip (style.css ~L382): the onboarding multi-select
// chip ("В чем тебе больше всего нужна поддержка?"), which the kit itself
// notes had no pre-existing Figma spec — text-only, stays toggled, selected
// state is a border change only (no fill/glow), kept quiet since several can
// be selected at once on screen. Selected border uses colors.borderVioletFlat
// (the RN-safe stand-in for the kit's gradient border) plus a faint tint so
// the state still reads at a glance without adding glow noise.
//
// Sized down from the kit's documented 48px/20px-padding spec (2026-08-04
// feedback): with 12 chips of very different lengths, that size only fit ~2
// per row, leaving a lot of ragged empty space. Smaller/tighter chips let
// more sit per line, reading as a denser, more balanced cloud instead of a
// sparse list — not yet ported back to the kit doc.
export function SelectChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bg0,
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.borderVioletFlat,
    backgroundColor: 'rgba(139,124,246,0.12)',
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
});
