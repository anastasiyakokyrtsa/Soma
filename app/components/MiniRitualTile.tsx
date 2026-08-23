import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

const TILE_W = 116;

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
  // Sea Waves is a wide/short icon (not square like the others) - the kit's
  // own demo overrides this tile's gap to 26px so its wrapped 2-line title
  // still lands at the same vertical spot as the other tiles' 1-line title.
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
          the 30% CSS stop becomes 0.3*70.7%=21.2% here. */}
      <Svg style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="miniTileFill" cx="50%" cy="50%" r="70.7%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.212" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#miniTileFill)" />
      </Svg>
      <View style={styles.whiteWash} pointerEvents="none" />
      <View style={[styles.iconFrame, { marginBottom: iconMarginBottom }]}>
        <GradientIcon name={icon} size={60} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 213,
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
    width: 70,
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.1,
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
