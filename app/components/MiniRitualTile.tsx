import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

const TILE_W = 116;
const TILE_H = 213;

// Ports UI Kit's "Mini Ritual Tile" (.mini-tile, style.css ~L676) - WF Home
// "Что поможет сейчас" row (Дыхание/Звуки природы/Медитация). Pressed ring
// skipped for the same reason OptionRow/SelectChip skip it - RN-safe flat
// border instead of the kit's mask-composite gradient ring.
export function MiniRitualTile({
  icon,
  title,
  time,
  iconMarginBottom = 44,
  width = TILE_W,
  onPress,
}: {
  icon: GradientIconName;
  title: string;
  time: string;
  // Compensates for a 2-line title ("Звуки\nприроды") vs the other cards'
  // 1-line ones, so the "icon+title" block is the same total height on
  // every card and `time` lands at the same Y regardless. A fixed height
  // on `title` itself was tried instead (2026-08-20 round) so this
  // compensation wouldn't be needed - reverted the same day, it left a
  // visible dead gap between a 1-line title and `time` below it ("Дыхание
  // зачем поднял так... без такой дыры"). Back to this per-card override,
  // the less pretty but visually correct fix - title's own height stays
  // natural (no dead space inside it), the compensation lives in the gap
  // *above* the title instead.
  iconMarginBottom?: number;
  // 116 only holds when 3 tiles + 16px side margins + 12px gaps fit the
  // Figma reference width - on a narrower real device the row overflowed
  // ("Медитация" wrapped, the 3rd tile ran off-screen) - CareScreen now
  // derives this from the real screen width instead (2026-08-20: "они у
  // тебя не помещаются на экране").
  width?: number;
  onPress?: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.tile, { width }, pressed && styles.tilePressed]} onPress={onPress}>
      {/* real --card-fill-sm port (black stop at 30%, not --card-fill's 45%;
          white wash 3%, not 2%) - was the flat colors.cardFillSmFallback
          stand-in, same "card-fill approximated as a flat color" gap
          MoonSunCard had before its own fix - same RadialGradient technique
          (2026-08-20: "фон карточки не как в ките. Такой же фон как и у
          карточек Луны и Солнца на главной"). r=70.7% reproduces CSS
          farthest-corner (see MoonSunCard.tsx's own comment for the math);
          the 30% CSS stop becomes 0.3*70.7%=21.2% here.
          Explicit numeric width/height on the Svg (not just
          style={StyleSheet.absoluteFillObject} + "100%" on the Rect, which
          worked fine on MoonSunCard's own hug-height, closer-to-square
          shape) - on this tile's much more elongated 1:1.8 aspect ratio,
          the percentage-only version rendered a hard flat cutoff partway
          down instead of a continuous gradient (2026-08-20: "треть карточки
          какая-то странная темная"), so give it real known pixel
          dimensions since both `width` and the fixed `TILE_H` are already
          known here. */}
      <Svg width={width} height={TILE_H} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="miniTileFill" cx="50%" cy="50%" r="70.7%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.212" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={TILE_H} fill="url(#miniTileFill)" />
      </Svg>
      <View style={styles.whiteWash} pointerEvents="none" />
      <View style={[styles.iconFrame, { marginBottom: iconMarginBottom }]}>
        <GradientIcon name={icon} size={60} />
      </View>
      {/* 16px side padding, matching the app's standard side margin
          (2026-08-20: "паддинг был по сторонам 16"). title's fontSize
          dropped again, 15->13 - 15 still wrapped "Медитация" on her real
          device ("так у тебя слово Медитация так и не помещается... если
          нужно уменьшить размер шрифта, подгони, во всех") - one shared
          size for every title, not a per-instance auto-fit (would let
          sibling titles render at visibly different sizes - see
          feedback-rn-app-ui-defaults for why that's the wrong default here).
          title height is natural now (no fixed 2-line box) - see the
          iconMarginBottom comment above for why. */}
      <View style={[styles.text, { width: width - 32 }]}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // paddingVertical:36 (back from a brief justifyContent:'center'
  // experiment the same day) - her explicit ask: "чтобы снизу и сверху был
  // паддинг по 36". Centering had made the two gaps equal but at whatever
  // value the leftover space produced, not literally 36 - now that the
  // "icon+title" block is a constant height across all 3 cards again (via
  // iconMarginBottom's per-card compensation, not title's own height), a
  // fixed 36/36 padding lands correctly with no leftover asymmetry either.
  tile: {
    height: TILE_H,
    borderRadius: radius.card,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  whiteWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tilePressed: {
    borderColor: colors.borderVioletFlat,
    transform: [{ scale: 0.98 }],
  },
  iconFrame: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 13 * 1.1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  time: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 14 * 1.1,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
});
