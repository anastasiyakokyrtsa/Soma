import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// "Фокус дня" recommendation card - no existing kit component for this one
// (new to the Home screen, Figma node 579:1085) - purple-stroke card style
// matches the same borderVioletFlat family already used for ArticleLinkRow.
export function FocusCard({
  width = 336,
  icon,
  title,
  text,
}: {
  // 336 only holds exactly on the Figma reference width (412) - same
  // per-device derivation as MoonSunCard, same reason (2026-08-20).
  width?: number;
  icon: GradientIconName;
  title: string;
  text: string;
}) {
  return (
    <View style={[styles.card, { width }]}>
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
    height: 167,
    borderWidth: 1,
    // Figma's own literal spec for this card is a fully opaque #a89cf8
    // border (colors.violet300), not the translucent borderVioletFlat stand-in
    // used elsewhere for the kit's gradient-border recipe (2026-08-17 audit).
    borderColor: colors.violet300,
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
