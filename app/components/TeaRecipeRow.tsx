import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// One "spoon / kettle / clock" pill from WF 31-35's herb detail screens - same
// 3 rows every herb slide, only the icon+label change.
//
// Round 3 on this component's look (2026-09-07): a solid-fill pill read as a
// dark box cut into the starfield; a bordered outer card with dividers still
// didn't land ("не нравится как оформлены"); a chrome-free quiet list read
// as boring ("тихий список скучно"). Landed back on individual pills, but
// with the exact border FocusCard already uses (`violet300`, fully opaque,
// not the translucent borderVioletFlat stand-in) and a transparent fill -
// her explicit spec this round: "такие же плашки как были изначально, только
// обводка как у карточек в Фокус дня и фон прозрачный".
export function TeaRecipeRow({ icon, label }: { icon: GradientIconName; label: string }) {
  return (
    <View style={styles.row}>
      {/* Decorative - the label text already carries the full meaning, so
          hide this from screen readers rather than let TalkBack announce
          the SVG path nodes separately (accessibility review, 2026-09-07). */}
      <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <GradientIcon name={icon} size={22} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.violet300,
    borderRadius: radius.md,
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
