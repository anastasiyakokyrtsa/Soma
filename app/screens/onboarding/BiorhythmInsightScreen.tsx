import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius, glow } from '../../theme';
import { StarsBackground } from '../../components/StarsBackground';
import { BackIcon } from '../../components/icons/BackIcon';
import { GradientIcon } from '../../components/icons/GradientIcon';
import { CareHandIcon } from '../../components/icons/CareHandIcon';
import { getBiorhythmValues, getStandoutCycle, type BirthDate } from '../../lib/biorhythm';
import { BIORHYTHM_INSIGHTS, BIORHYTHM_INSIGHT_EYEBROW } from '../../content/biorhythmInsight';

// Inserted right after ProfileDateOfBirthScreen (2026-09-15, habit-designer's
// recommendation for audit finding #7 - real value before the onboarding
// flow finishes, not only once on Home at the very end). Date of birth
// itself stays where it already was in the flow - only this reveal moves,
// not the input step (her explicit call, not habit-designer's original
// "move the date-of-birth step earlier" suggestion).
//
// The insight is genuinely computed from the date just entered
// (lib/biorhythm.ts's real 23/28/33-day formula), not a placeholder - a
// screen whose whole point is "look, something real about you" would be
// dishonest if it weren't. One cycle only (whichever reads most extreme
// today), not the full 3-line chart - a complete graph means nothing yet to
// someone who doesn't know what biorhythms are (same reasoning already
// applied to Home's DAY_PARAGRAPHS: one graph-attributed, hedged sentence).
//
// Structure/glow recipe reused verbatim from BreathingCompleteScreen's own
// halo circle (same "glow circle around an icon" motif already established
// in this app) rather than inventing a new one.
export function BiorhythmInsightScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const birth: BirthDate = route?.params?.birth ?? { day: 14, month: 4, year: 1995 };

  const values = getBiorhythmValues(birth);
  const { cycle, direction } = getStandoutCycle(values);
  const insight = BIORHYTHM_INSIGHTS[cycle][direction];

  const icon =
    cycle === 'physical' ? (
      <GradientIcon name="pulse" size={56} />
    ) : cycle === 'intellect' ? (
      <GradientIcon name="brain" size={56} />
    ) : (
      <CareHandIcon size={56} color={colors.violet300} />
    );

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={styles.center}>
        <View style={styles.circle}>
          <View style={styles.halo} />
          {icon}
        </View>
        <Text style={styles.eyebrow}>{BIORHYTHM_INSIGHT_EYEBROW}</Text>
        <Text style={styles.insight}>{insight}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, { marginBottom: insets.bottom + 40 }, pressed && styles.ctaPressed]}
        onPress={() => navigation.navigate('ProfileSleepSchedule')}
      >
        <Text style={styles.ctaLabel}>Продолжить</Text>
      </Pressable>
    </View>
  );
}

const CIRCLE_SIZE = 140;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(139,124,246,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Same halo recipe as BreathingCompleteScreen's own circle - not a second
  // glow treatment, the app's one "milestone/reveal" motif reused.
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    boxShadow:
      '0px 0px 50px 12px rgba(139,124,246,0.16), 0px 0px 90px 26px rgba(255,198,241,0.07), inset 0px 0px 60px 22px rgba(139,124,246,0.18), inset 0px 0px 32px 8px rgba(255,198,241,0.12)',
  },
  eyebrow: {
    marginTop: 28,
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.violet300,
  },
  insight: {
    marginTop: 16,
    fontFamily: fontFamily.medium,
    fontSize: 20,
    lineHeight: 20 * 1.4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cta: {
    marginHorizontal: 20,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}`,
  },
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
