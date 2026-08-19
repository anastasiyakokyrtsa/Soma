import { Image, View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

const BG = require('../assets/article/quote-nightscape.png');

// Ports UI Kit's "Quote Card" (.quote-card, style.css ~L773) - same
// nightscape background/quote/icons as the kit's own demo, just at the
// Home screen's own shorter instance height (159, not the kit doc's 272) -
// literal Figma spec (node 599:1212), not the kit's own taller reference.
export function QuoteCard({ quote, author, height = 159 }: { quote: string; author: string; height?: number }) {
  return (
    // Two layers, not one: the outward glow has to live on a wrapper WITHOUT
    // overflow:hidden (a child's box-shadow gets clipped by a parent's own
    // overflow:hidden in RN, same as most engines) - the kit's web CSS gets
    // this "for free" since a box's own box-shadow is never subject to that
    // same box's own overflow. The inset vignette stays on the clipped inner
    // box, where it belongs either way.
    <View style={[styles.wrap, { height }]}>
      <View style={styles.card}>
        <Image source={BG} style={styles.bg} resizeMode="cover" />
        <View style={styles.insetVignette} pointerEvents="none" />
        <View style={styles.content}>
          <Text style={styles.text}>{quote}</Text>
          <Text style={styles.author}>{author}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.iconButton}>
              <Svg width={24} height={24} viewBox="23.76 17.76 36.24 47.24" preserveAspectRatio="none">
                <Path
                  d="M53.7333 59.5999L41.9999 49.3332L30.2666 59.5999V27.3332C30.2666 25.7126 31.5793 24.3999 33.1999 24.3999H50.7999C52.4206 24.3999 53.7333 25.7126 53.7333 27.3332V59.5999Z"
                  fill={colors.textPrimary}
                />
              </Svg>
            </Pressable>
            <Pressable style={styles.iconButton}>
              {/* kit sizes this one 29x29, not 24x24 like bookmark - equalizes
                  visual weight against the thin outline stroke vs bookmark's
                  solid fill (documented "solid-fill vs outline-stroke at equal
                  box size != equal visual weight" lesson). */}
              <Svg width={29} height={29} viewBox="-1.04 4.96 46.08 39.04" preserveAspectRatio="none">
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
    width: '100%',
    borderRadius: 30,
    // kit's own literal outward glow (0 0 40px 8px rgba(139,124,246,.3)) -
    // was missing entirely in the first pass. Can't fully verify this
    // renders as expected in this sandbox - worth a quick on-device look.
    boxShadow: '0px 0px 40px 8px rgba(139,124,246,0.3)',
  },
  card: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
    // kit's own literal padding (0 32px) - was 38/39, which was this one
    // Figma instance's own hug value, not the kit's already-approved number.
    paddingHorizontal: 32,
  },
  text: {
    fontFamily: fontFamily.medium,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 22 * 1.1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  author: {
    fontFamily: fontFamily.regular,
    fontStyle: 'italic',
    fontSize: 18,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
