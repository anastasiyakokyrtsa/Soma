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
  // Per-icon override for tiles whose glyph reads visually off-center in
  // its 60x60 frame at the default 44 gap - no longer used to compensate
  // for wrap-length differences (title's own fixed 2-line height, below,
  // handles that now), just real per-icon visual balance if one ever needs it.
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
      {/* width: 16px side padding, matching the app's standard side margin
          (2026-08-20: "паддинг был по сторонам 16" - was `width - 16`, an
          8px-a-side squeeze that only fit "Медитация" by crowding the
          edges). title's own fontSize dropped 16->15 to comfortably fit
          inside the now-narrower box on one line without that squeeze
          ("давай наверное чуть уменьшим шрифт"). Fixed 2-line-tall height
          (numberOfLines={2}) still reserved on every tile, now at the new
          15px size, so `time` stays aligned across cards regardless of
          whether a given title wraps ("надписи с минутами все были на
          одном уровне"). */}
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
  // justifyContent:'center' (not the old fixed paddingVertical:36) - her
  // ask, 2026-08-20: the gap from the top edge to the icon should equal the
  // gap from the "time" line to the bottom edge. A fixed top/bottom padding
  // only guarantees that when the content stack's own height happens to
  // exactly fill the remaining space - centering makes the two gaps
  // mathematically equal regardless of content height, robust to future
  // font-size/spacing tweaks instead of needing to re-tune two numbers by hand.
  tile: {
    height: TILE_H,
    borderRadius: radius.card,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
    // fixed to exactly 2 lines' worth of height - see the component body
    // comment for why (keeps `time` aligned across cards regardless of
    // whether this specific title wraps). 15, not the kit's literal 16 -
    // her explicit ask, 2026-08-20, to fit inside a real 16px side padding.
    height: 15 * 1.1 * 2,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 15 * 1.1,
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
