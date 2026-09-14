import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, fontFamily, radius } from '../theme';
import { MOODS } from './MoodScale';

// Compact daily mood check-in for the top of Home (audit findings #6/#11,
// decided 2026-09-01, actually built 2026-09-14 - the wireframe had this on
// Home but it never made it into HomeScreen.tsx, only into onboarding's own
// full-size MoodScale). Two states:
//   - not yet answered today: a small card, tap a mood to answer
//   - answered: collapses to a one-line chip, tap it to reopen and change
//     today's answer
//
// Deliberately NOT MoodScale's slider - mobile-ux finding #11: a slider up
// here (top of a scrolling screen, opened one-handed, often in bed) is hard
// to drag precisely; five big tappable icons are a single easy hit instead
// of a precise gesture. Same 5 mood images/labels as onboarding, imported
// from there rather than duplicated.
//
// No persistence yet (matches the rest of Home/Care - mock local state,
// same stage as DAY_PARAGRAPHS/ResourceRing) - resets on reload. Backfill
// for a missed day (finding #6) and the history graph both live in
// Аналитика's future "Состояния" card, not here - this component only ever
// answers "today."
export function MoodCheckIn() {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    return (
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
        <Pressable
          style={styles.chip}
          onPress={() => setSelected(null)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Сегодняшнее настроение: ${MOODS[selected].label}. Изменить`}
        >
          <Image source={MOODS[selected].img} style={styles.chipIcon} resizeMode="contain" />
          <Text style={styles.chipText}>
            Сегодня: <Text style={styles.chipMood}>{MOODS[selected].label.toLowerCase()}</Text>
          </Text>
          <Text style={styles.chipEdit}>изменить</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={styles.card} entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
      {/* Real --card-fill port, same recipe as MoonSunCard.tsx (2026-08-20
          fix there): a flat opaque fallback here made the card read as a
          solid box blocking the starfield right at the top of Home, the
          most visible spot on the screen - she caught this on-device
          2026-09-14, ui-designer confirmed it's the same known issue and
          recommended porting the identical gradient rather than inventing
          a second treatment. */}
      <Svg style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="moodFill" cx="50%" cy="50%" r="70.7%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.318" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="1" stopColor={colors.violet300} stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#moodFill)" />
      </Svg>
      <View style={styles.whiteWash} pointerEvents="none" />
      <View style={styles.inner}>
        <Text style={styles.prompt}>Как ты сегодня?</Text>
        <View style={styles.row}>
          {MOODS.map((m, i) => (
            <Pressable
              key={i}
              onPress={() => setSelected(i)}
              hitSlop={4}
              style={styles.option}
              accessibilityRole="button"
              accessibilityLabel={m.label}
            >
              <Image source={m.img} style={styles.optionIcon} resizeMode="contain" />
              <Text style={styles.optionLabel} numberOfLines={1} adjustsFontSizeToFit>
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  // Second --card-fill layer (a uniform light wash on top of the radial
  // gradient) - same as MoonSunCard's own whiteWash, too subtle to need
  // its own gradient.
  whiteWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  inner: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  prompt: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    width: 56,
    gap: 6,
  },
  optionIcon: {
    width: 40,
    height: 40,
  },
  optionLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Chip stays a plain translucent tint, not the full radial-gradient
  // treatment - ui-designer's call: at ~38px tall a radial gradient reads
  // as indistinguishable from a flat fill, not worth the extra SVG layer.
  // A translucent (not opaque) color still lets the starfield show through
  // faintly, consistent in spirit with the card without overbuilding it.
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(11,14,31,0.6)',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 8,
  },
  chipIcon: {
    width: 22,
    height: 22,
  },
  chipText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipMood: {
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
  },
  chipEdit: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.violet300,
    textDecorationLine: 'underline',
  },
});
