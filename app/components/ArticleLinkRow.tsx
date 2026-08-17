import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// Ports UI Kit's "Article Link Row" (.list-row, style.css ~L704) - WF Home's
// "О теле и ритмах" article list. Border is always on here (not just
// pressed) - the kit's own comment notes there's no fill to read the card's
// edge otherwise - matches the Figma frame too (all 3 rows show a visible
// violet-300 border at rest). RN-safe flat borderVioletFlat, not the kit's
// gradient ring.
export function ArticleLinkRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: GradientIconName;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={onPress}>
      <View style={styles.iconFrame}>
        <GradientIcon name={icon} size={28} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <GradientIcon name="forward" size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 112,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderVioletFlat,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  rowPressed: {
    backgroundColor: 'rgba(139,124,246,0.12)',
    transform: [{ scale: 0.98 }],
  },
  iconFrame: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.3,
    color: colors.textPrimary,
  },
});
