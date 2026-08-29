import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius, glow } from '../theme';
import { BreathingOrb, ORB_TOP_OFFSET } from '../components/BreathingOrb';
import { CloseIcon } from '../components/icons/CloseIcon';
import { StarsBackground } from '../components/StarsBackground';

// WF 25 "Breathing session - Info" - the practice the "Дыхание" Mini Ritual
// Tile on Care opens straight into, already picked for her current state
// (no picker screen yet, only ever one practice exists right now - see
// route.params below for how a future picker would plug in). Orb is
// BreathingOrb's calm, non-running preview (level A, static "Вдыхай") -
// the same glowing component the active session uses, just at rest, so the
// two screens read as one continuous object rather than a flat placeholder
// swapping for a "real" one once the session starts.
export function BreathingInfoScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const p = route?.params ?? {};
  const title: string = p.title ?? 'Дыхание для возвращения в тело';
  // "2 минуты" - the real length (6 reps x 16s = 96s = 1 мин 36 сек) was
  // used literally here for one round, then reverted: "давай вначале в
  // информации все-таки напишем 2 минуты, а не 1 мин 36 сек" - a rounder,
  // friendlier label over the precise-but-fussy one.
  const durationLabel: string = p.durationLabel ?? '2 минуты';
  const description: string =
    p.description ?? 'Эта практика помогает замедлиться и выровнять дыхание. Подходит, если внутри есть напряжение или усталость.';

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.closeButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <CloseIcon />
      </Pressable>

      {/* Fixed offset from the top, not centered in the leftover flex space
          above the card - centering made the orb sit higher here than on
          the Session screen (that screen has much less content below it,
          so "centered in what's left" landed at a different Y). A spacer
          below absorbs whatever room remains so the card still docks flush
          to the bottom regardless of screen height. */}
      <View style={[styles.orbWrap, { marginTop: insets.top + ORB_TOP_OFFSET }]}>
        <BreathingOrb running={false} wrapSize={300} />
      </View>
      <View style={{ flex: 1 }} />

      <View style={[styles.card, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.duration}>{durationLabel}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => navigation.navigate('BreathingSession', { title })}
        >
          <Text style={styles.ctaLabel}>Я готов</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrap: {
    alignItems: 'center',
  },
  // Rounded-top sheet, flush to the bottom edge - same card-fill family
  // used everywhere else in the app, just with only the top two corners
  // rounded (a bottom sheet, not a floating card).
  card: {
    backgroundColor: colors.cardFillFallback,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  duration: {
    marginTop: 8,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  description: {
    marginTop: 20,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cta: {
    marginTop: 32,
    width: '100%',
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  // Standing rule for every primary CTA in this app (feedback_rn_app_ui_defaults) -
  // was missing here entirely, her explicit catch, 2026-08-27: "забыл кнопке
  // добавить состояние pressed".
  ctaPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  ctaLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.bg0,
  },
});
