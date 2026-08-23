import { Image, View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

const BG = require('../assets/article/quote-nightscape.png');

// Ports UI Kit's "Quote Card" (.quote-card, style.css ~L773) verbatim - same
// 380x272, same nightscape background/quote/icons as the kit's own demo.
// Was rendering at a shorter 159 (a Figma-node override from an earlier
// session), which read as a completely different card next to the kit
// reference - reverted 2026-08-20 per her explicit "возьми прям оттуда"
// (take it exactly from there): the kit is the source of truth for this
// component now, full stop, not a competing Figma instance value.
export function QuoteCard({
  quote,
  author,
  width = 380,
}: {
  quote: string;
  author: string;
  // 380 is the kit's literal reference width - on a narrower real device a
  // literal (unscaled) font size wrapped the quote onto 3 lines instead of
  // the kit's 2 (2026-08-20 screenshot comparison: "оба элемента должны
  // быть в точности как в ui kit"), same class of bug as MoonSunCard/
  // FocusCard's earlier scale-mismatch. HomeScreen caps this the same way
  // it caps chartWidth (min(screenWidth-32, 380)).
  width?: number;
}) {
  const scale = Math.min(width, 380) / 380;
  return (
    // Two layers, not one: the outward glow has to live on a wrapper WITHOUT
    // overflow:hidden (a child's box-shadow gets clipped by a parent's own
    // overflow:hidden in RN, same as most engines) - the kit's web CSS gets
    // this "for free" since a box's own box-shadow is never subject to that
    // same box's own overflow. The inset vignette stays on the clipped inner
    // box, where it belongs either way.
    <View style={[styles.wrap, { width }]}>
      <View style={styles.card}>
        <Image source={BG} style={styles.bg} resizeMode="cover" />
        <View style={styles.insetVignette} pointerEvents="none" />
        {/* height now hugs content + 60px top/bottom (her explicit ask,
            2026-08-20: "сверху и снизу... по 60 пикселей") - not the kit's
            own vertically-centered content, a deliberate override of this
            one property, same as her earlier icon-height ask below. */}
        <View style={[styles.content, { paddingHorizontal: 32 * scale, paddingTop: 60 * scale, paddingBottom: 60 * scale }]}>
          <Text style={[styles.text, { fontSize: 22 * scale, lineHeight: 22 * 1.1 * scale, marginBottom: 16 * scale }]}>
            {quote}
          </Text>
          <Text style={[styles.author, { fontSize: 18 * scale, marginBottom: 10 * scale }]}>{author}</Text>
          <View style={[styles.actions, { gap: 12 * scale }]}>
            {/* 29x29, matching the "Отправить" arrow below, not the kit's
                own 24x24 - her explicit ask (2026-08-20: "иконка Сохранить
                визуально было такой же по высоте как иконка Отправить"),
                a deliberate override of the kit's literal size here. */}
            <Pressable style={[styles.iconButton, { width: 32 * scale, height: 32 * scale }]}>
              <Svg width={29 * scale} height={29 * scale} viewBox="23.76 17.76 36.24 47.24" preserveAspectRatio="none">
                <Path
                  d="M53.7333 59.5999L41.9999 49.3332L30.2666 59.5999V27.3332C30.2666 25.7126 31.5793 24.3999 33.1999 24.3999H50.7999C52.4206 24.3999 53.7333 25.7126 53.7333 27.3332V59.5999Z"
                  fill={colors.textPrimary}
                />
              </Svg>
            </Pressable>
            <Pressable style={[styles.iconButton, { width: 32 * scale, height: 32 * scale }]}>
              <Svg width={29 * scale} height={29 * scale} viewBox="-1.04 4.96 46.08 39.04" preserveAspectRatio="none">
                <Path
                  d="M4.40011 39.5966C4.38636 39.5966 4.37605 39.5966 4.3623 39.5966C3.88793 39.576 3.51324 39.1841 3.52011 38.7097C3.52355 38.4932 4.02886 17.3182 24.6401 16.7338V10.56C24.6401 10.2197 24.836 9.91036 25.142 9.76598C25.4445 9.61817 25.8123 9.66286 26.0735 9.87598L40.1535 21.316C40.3598 21.4844 40.4801 21.7354 40.4801 22C40.4801 22.2647 40.3598 22.5157 40.157 22.6841L26.077 34.1241C25.8123 34.3372 25.4479 34.3785 25.142 34.2341C24.836 34.0897 24.6401 33.7804 24.6401 33.44V27.2869C6.30105 27.6204 5.31105 38.3179 5.27668 38.7785C5.24574 39.2425 4.86074 39.5966 4.40011 39.5966Z"
                  fill={colors.textPrimary}
                />
              </Svg>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 30,
    // kit's own literal outward glow (0 0 40px 8px rgba(139,124,246,.3)) -
    // was missing entirely in the first pass. Can't fully verify this
    // renders as expected in this sandbox - worth a quick on-device look.
    boxShadow: '0px 0px 40px 8px rgba(139,124,246,0.3)',
  },
  // no flex/height - hugs to `content`'s own natural height (60+60 padding
  // + the text stack), now that the vertical position is driven by explicit
  // padding rather than centering within a fixed box.
  card: {
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  insetVignette: {
    ...StyleSheet.absoluteFillObject,
    boxShadow: 'inset 0px 0px 10px rgba(5,8,22,0.8)',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontFamily: fontFamily.medium,
    fontStyle: 'italic',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  // color corrected .65 -> .75 (kit's literal --text-secondary-equivalent
  // alpha, 2026-08-20 audit) - was a real fidelity miss, not a deliberate
  // deviation.
  author: {
    fontFamily: fontFamily.regular,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
