import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { GradientIcon, type GradientIconName } from './icons/GradientIcon';

// Ports UI Kit's "Mini Ritual Tile" (.mini-tile, style.css ~L676) - WF Home
// "Что поможет сейчас" row (Дыхание/Звуки природы/Медитация). card-fill
// background approximated as a flat fallback (colors.cardFillSmFallback,
// same stand-in the kit's own token doc calls for pending a real
// radial-gradient Card implementation), pressed ring skipped for the same
// reason OptionRow/SelectChip skip it - RN-safe flat border instead of the
// kit's mask-composite gradient ring.
export function MiniRitualTile({
  icon,
  title,
  time,
  iconMarginBottom = 44,
  onPress,
}: {
  icon: GradientIconName;
  title: string;
  time: string;
  // Sea Waves is a wide/short icon (not square like the others) - the kit's
  // own demo overrides this tile's gap to 26px so its wrapped 2-line title
  // still lands at the same vertical spot as the other tiles' 1-line title.
  iconMarginBottom?: number;
  onPress?: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]} onPress={onPress}>
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
    width: 116,
    height: 213,
    borderRadius: radius.card,
    backgroundColor: colors.cardFillSmFallback,
    alignItems: 'center',
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: 'transparent',
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
