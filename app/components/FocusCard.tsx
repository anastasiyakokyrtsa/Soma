import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// "Фокус дня" recommendation card - no existing kit component for this one
// (new to the Home screen, Figma node 579:1085) - purple-stroke card style
// matches the same borderVioletFlat family already used for ArticleLinkRow.
export function FocusCard({ icon, title, text }: { icon: GradientIconName; title: string; text: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <GradientIcon name={icon} size={32} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 336,
    height: 167,
    borderWidth: 1,
    borderColor: colors.borderVioletFlat,
    borderRadius: radius.md,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.5,
    color: colors.textPrimary,
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.2,
    color: colors.textPrimary,
  },
});
