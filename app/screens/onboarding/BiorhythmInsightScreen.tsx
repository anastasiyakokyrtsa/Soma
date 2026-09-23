import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, glow } from '../../theme';
import { StarsBackground } from '../../components/StarsBackground';
import { BackIcon } from '../../components/icons/BackIcon';
import { getBiorhythmValues, getStandoutCycle, type BirthDate } from '../../lib/biorhythm';
import {
  BIORHYTHM_INSIGHTS,
  BIORHYTHM_INSIGHT_DEMO,
  BIORHYTHM_INSIGHT_EYEBROW,
} from '../../content/biorhythmInsight';

// TEMPORARY, same pattern as ProfileDateOfBirthScreen's FORCE_IOS_WHEEL_PREVIEW:
// while Home still shows hand-drawn demo curves, the real-formula insight
// below would contradict it on the same birth date (this screen said
// "intellect up" while Home right after showed it at the bottom). Her call
// 2026-09-23: keep it a demo for now, back to the formula later - flip to
// false then (and restyle the other five templates first, see backlog).
const USE_HOME_DEMO_INSIGHT = true;

// Small circular crop of a glowing-bulb illustration (swapped from an
// earlier pendulum image, same day, her call) - a large canvas gave the
// AI-generated art nowhere to hide its generic-render quality (per
// ui-designer consult), where a small, tightly-cropped detail reads fine.
// Cropped to a square centered on the bulb itself, with a few of its
// orbiting particle-spheres visible at the edges; same alpha-key-off-
// near-black-background technique as ProfileStartScreen's astrolabe.
const INSIGHT_BULB = require('../../assets/onboarding/insight-bulb.png');

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
// Back to the original centered "reveal" layout (same halo motif as
// BreathingCompleteScreen) after a same-day detour through a full-screen
// illustration treatment that didn't work out. The circle is a real
// clipping mask (`overflow:'hidden'` + borderRadius), not just a
// decorative ring drawn on top of a rectangular image - that distinction
// is what made an earlier small-illustration attempt today look "криво"
// (her word): the ring there was cosmetic, the image showed past its edges.
export function BiorhythmInsightScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const birth: BirthDate = route?.params?.birth ?? { day: 14, month: 4, year: 1995 };

  const values = getBiorhythmValues(birth);
  const { cycle, direction } = getStandoutCycle(values);
  const insight = USE_HOME_DEMO_INSIGHT ? BIORHYTHM_INSIGHT_DEMO : BIORHYTHM_INSIGHTS[cycle][direction];

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 40 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={styles.center}>
        <View style={styles.circleWrap}>
          <View style={styles.halo} />
          <View style={styles.circleMask}>
            <Image source={INSIGHT_BULB} style={styles.bulbImage} resizeMode="cover" />
          </View>
        </View>
        <Text style={styles.eyebrow}>{BIORHYTHM_INSIGHT_EYEBROW}</Text>
        <Text style={styles.insight}>{insight}</Text>
      </View>

      {/* insets.bottom + 32 is the app-wide button-to-edge formula, but
          ProfileStepLayout's button isn't actually that close to the edge -
          it has a "Заполнить позже" skip row sitting below it, and the
          layout's paddingBottom applies after that row, not right after the
          button. This screen has no skip row, so matching the same flat
          +32 sits the button visibly lower than the date-of-birth screen -
          confirmed by measuring both her screenshots directly (real gap
          104px vs 54px out of 1280px height, not the ~equal result an
          earlier looser color-match measurement wrongly suggested). +64
          approximates the skip row's own missing footprint. */}
      <Pressable
        style={({ pressed }) => [styles.cta, { marginBottom: insets.bottom + 64 }, pressed && styles.ctaPressed]}
        onPress={() => navigation.navigate('ProfileSleepSchedule')}
      >
        <Text style={styles.ctaLabel}>Продолжить</Text>
      </Pressable>
    </View>
  );
}

const CIRCLE_SIZE = 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  // Same footprint/position as ProfileStepLayout's back button (the
  // date-of-birth screen right before this one): 44px, left edge at 8
  // (20px screen padding - 12 margin), top at insets.top + 40.
  backButton: {
    position: 'absolute',
    left: 8,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  circleWrap: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  // Same halo recipe as BreathingCompleteScreen's own circle - the app's
  // one "milestone/reveal" motif, reused rather than reinvented.
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
  // The actual clipping mask - overflow:'hidden' means the image is
  // genuinely cropped to a circle, not just overlaid with a decorative ring.
  // Centers the (now smaller) image so it doesn't fill the circle edge to
  // edge - the halo/stars show through the ring of space around it.
  circleMask: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 75% of the circle (was 60%, then "увеличим до 75%" 2026-09-23) - the
  // outermost orbiting dots still sit inside the circle at this size.
  bulbImage: {
    width: CIRCLE_SIZE * 0.75,
    height: CIRCLE_SIZE * 0.75,
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
    borderRadius: 16,
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
