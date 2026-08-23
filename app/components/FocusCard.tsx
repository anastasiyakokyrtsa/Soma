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
        {/* 36, not 32 - bumped alongside the title's move to MoonSunCard's
            larger 22px title size (was paired with the old 20px title),
            keeping roughly the same icon-to-title weight ratio (2026-08-20:
            "думаю тут нужно будет и размер иконки адаптировать"). */}
        <GradientIcon name={icon} size={36} />
        {/* numberOfLines+adjustsFontSizeToFit kept as a safety net even
            though "Мягкий старт и обновление" (the one title that actually
            needed it) got shortened to just "Мягкий старт" the same round -
            still per-instance rather than a shared smaller literal size, so
            a future long title shrinks on its own without dragging the
            other cards' titles down with it (see [[project-app-
            development]] 2026-08-20 for the original reasoning).
            flexShrink:1 gives Text a real width to measure against. */}
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // height hugs content now (was a fixed 167) - the only way to guarantee
  // the real last line of `text` sits exactly `padding` (16) from the
  // card's bottom edge regardless of how many lines it wraps to, same
  // reasoning as MoonSunCard's height fix (2026-08-20: "от нижней строки
  // до нижнего края карточки... 16 пикселей").
  card: {
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
  // matches MoonSunCard's own title (2026-08-20: "настройки шрифта такие
  // же как у заголовка в карточке Лунная активность") - bold, 22, 1.2, not
  // this card's own previous semiBold/20/1.5.
  title: {
    flexShrink: 1,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 22 * 1.2,
    color: colors.textPrimary,
  },
  // matches MoonSunCard's own note text (2026-08-20: "body text... сделаем
  // как и в описании в карточках Лунной и солнечной активности") - same
  // fontFamily/fontSize already, only the line-height ratio (1.3, not 1.2)
  // was different.
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.3,
    color: colors.textPrimary,
  },
});
