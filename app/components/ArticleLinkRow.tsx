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
        <GradientIcon name={icon} size={32} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <GradientIcon name="forward" size={28} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Explicit per-edge spacing, her follow-up ask 2026-08-26 ("расстояние от
  // иконки до левой стенки 16, от иконки до текста 8, от стрелки до
  // правого края 16. И сверху и снизу по 16") - supersedes the earlier
  // fixed height:112 (align-items:center in a 112px box put ~32px above/
  // below the icon, not the 16px she wants here) - height now hugs
  // padding+content instead of being pinned to a literal number.
  row: {
    width: '100%',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderVioletFlat,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowPressed: {
    backgroundColor: 'rgba(139,124,246,0.12)',
    transform: [{ scale: 0.98 }],
  },
  iconFrame: {
    width: 48,
    height: 48,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
  },
  // 18->16 so the title reliably holds one line at the row's real (narrower
  // than the kit's fixed 380) content width - her explicit ask, 2026-08-26
  // ("надо чтобы заголовки помещались в одну строку, если надо уменьши
  // кегль"). subtitle dropped 16->14 to follow, "соответственно тогда и
  // кегль боди уменьши немного".
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 14 * 1.3,
    color: colors.textPrimary,
  },
});
