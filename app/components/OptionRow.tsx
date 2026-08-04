import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';

// Full-width single-select row (Gender: "Женщина" / "Мужчина"). Same footprint
// as TextField (.field-input: height 64, radius sm) since the wireframe draws
// these as the same rounded-rectangle shape as a text field — reads as one
// consistent "input" family. Selected state uses colors.borderVioletFlat,
// documented in theme/colors.ts as the flat stand-in specifically for spots
// (like RN) that can't render the kit's gradient border.
export function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bg0,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  rowSelected: {
    borderColor: colors.borderVioletFlat,
    backgroundColor: 'rgba(139,124,246,0.12)',
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.textPrimary,
  },
});
