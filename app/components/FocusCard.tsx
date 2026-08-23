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
  // Same scale MoonSunCard computes off its own `width` prop - both cards
  // get the exact same `cardWidth` from HomeScreen, so this reproduces the
  // exact same factor. Needed because the title/text below are meant to
  // visually match MoonSunCard's, but MoonSunCard's own sizes are already
  // scaled by its width - a literal (unscaled) 22/16 here rendered *larger*
  // than MoonSunCard's actual (scaled-down, on her narrower-than-336 real
  // device) title/note, so the two never actually matched despite using
  // the same base numbers (caught from her screenshot 2026-08-20, "на
  // скрине видно, что ты не выполнил мое задание" - real miss, not a
  // wrong reading of the ask).
  const scale = Math.min(width, 336) / 336;
  return (
    // padding stays literal 16 (not scaled) per her explicit ask - unlike
    // MoonSunCard's own padding, which does scale (2026-08-20: "паддинг по
    // 16 со всех сторон").
    <View style={[styles.card, { width, padding: 16, gap: 8 * scale }]}>
      <View style={styles.header}>
        {/* 26, not 36 - the 36 bump (paired with the title's move to 22px)
            read as way oversized next to the text (2026-08-20: "иконки чуть
            поменьше... они намного больше шрифта"). */}
        <GradientIcon name={icon} size={26 * scale} />
        {/* numberOfLines+adjustsFontSizeToFit kept as a safety net even
            though "Мягкий старт и обновление" (the one title that actually
            needed it) got shortened to just "Мягкий старт" the same round -
            still per-instance rather than a shared smaller literal size, so
            a future long title shrinks on its own without dragging the
            other cards' titles down with it (see [[project-app-
            development]] 2026-08-20 for the original reasoning).
            flexShrink:1 gives Text a real width to measure against. */}
        <Text
          style={[styles.title, { fontSize: 22 * scale, lineHeight: 22 * 1.2 * scale }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      </View>
      <Text style={[styles.text, { fontSize: 16 * scale, lineHeight: 16 * 1.3 * scale }]}>{text}</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  // fontSize/lineHeight set inline (scaled), only non-scaled properties
  // stay here - matches MoonSunCard's own title (2026-08-20: "настройки
  // шрифта такие же как у заголовка в карточке Лунная активность") - bold,
  // not this card's own previous semiBold.
  title: {
    flexShrink: 1,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  // matches MoonSunCard's own note text (2026-08-20: "body text... сделаем
  // как и в описании в карточках Лунной и солнечной активности").
  // includeFontPadding:false (Android-only) strips the extra font-metric
  // padding Android adds below a Text's last line by default - without it,
  // the visible gap to the card's own 16px bottom padding reads as bigger
  // than 16 even though the numeric padding really is 16 (2026-08-20: "в
  // карточках Фокус дня нижний паддинг не 16 а больше").
  text: {
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    includeFontPadding: false,
  },
});
