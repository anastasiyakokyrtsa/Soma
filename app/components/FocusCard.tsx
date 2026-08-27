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
  // exact same factor. Only drives the icon size and the header-to-text gap
  // now - title/text themselves switched to literal, unscaled sizes
  // 2026-08-26 to match ArticleLinkRow's literal sizes exactly (see
  // `styles.title`/`styles.text`), so `scale` no longer applies to them.
  const scale = Math.min(width, 336) / 336;
  return (
    // padding stays literal 16 (not scaled) per her explicit ask - unlike
    // MoonSunCard's own padding, which does scale (2026-08-20: "паддинг по
    // 16 со всех сторон").
    <View style={[styles.card, { width, padding: 16, gap: 8 * scale }]}>
      <View style={styles.header}>
        {/* 26, not 36 - 36 read as way oversized next to the text
            (2026-08-20: "иконки чуть поменьше... они намного больше
            шрифта"). Still 26 after the title dropped to 16px 2026-08-26 -
            she didn't ask to revisit the icon itself, only the text. */}
        <GradientIcon name={icon} size={26 * scale} />
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
  },
  // center, not flex-end - the title dropped from 22px to 16px (see below),
  // no longer close to the icon's own 26*scale height, so bottom-aligning
  // now stranded it low with visible daylight above it. Direct consequence
  // of the title-size change, not a separate ask.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Literal (not scaled by this card's own `scale`) 16px/semiBold, matching
  // ArticleLinkRow's title exactly - her consistency ask, 2026-08-26: "взять
  // такой же кегль и такую же жирность шрифта у заголовка как... в блоке О
  // теле и ритмах". Deliberately NOT multiplied by `scale` here (unlike this
  // card's icon/gap) - the whole point is matching Care screen's literal
  // size everywhere, not a proportionally-scaled version of it.
  title: {
    flexShrink: 1,
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: colors.textPrimary,
  },
  // Literal 14px/medium, matching ArticleLinkRow's subtitle - same
  // consistency ask, "и боди тоже". includeFontPadding:false (Android-only)
  // already strips the extra font-metric padding Android adds below a
  // Text's last line - kept from the original 2026-08-20 fix for the exact
  // same "bottom padding reads bigger than 16" complaint. marginBottom:-3 is
  // a further, approximate compensation for the remaining line-height
  // leading below the last line (the header row's icon has none, so the top
  // gap reads tighter than the pure-text bottom gap even with the numeric
  // padding equal on both sides) - an estimate, not a measured fix; flag the
  // exact remaining gap in px if it's still visibly off after this.
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 14 * 1.3,
    color: colors.textPrimary,
    includeFontPadding: false,
    marginBottom: -3,
  },
});
