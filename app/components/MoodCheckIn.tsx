import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Text as SvgText,
  Image as SvgImage,
  Filter,
  FeGaussianBlur,
} from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, fontFamily, gradients, radius } from '../theme';
import { MOODS } from './MoodScale';

// A soft violet glow that hugs the mood icon's own silhouette (star points,
// the flower's scalloped edge, etc.), not a bounding box - 2026-09-29, her
// catch: an earlier version glowed via boxShadow on a circular wrapper View,
// which (same lesson as BiorhythmChart's own ring glow, fixed the same
// night) doesn't follow a transparent PNG's actual alpha shape, only the
// wrapper's own box/circle. Same real fix as there: draw the icon through
// react-native-svg's <Image>, which (like <Path>) accepts a `filter` and
// blurs its own rendered pixels - a glow that's genuinely shaped like the
// star, not a generic circle behind it. Canvas is padded well past the
// icon's own box so the blur has room to fade out before hitting the SVG's
// own edge (BiorhythmChart's ring-glow-clipping bug, same night, was exactly
// this without the padding).
// Bumped 4 -> 6 and drawn twice (a wide soft pass + a tighter brighter pass,
// same 2-layer recipe as the app's other glow-behind-a-shape treatments -
// PersonalizationIllustration's stars, BiorhythmChart's ring) - her ask
// 2026-09-29: "можешь даже поярче сделать чтобы было разницу лучше видно".
const MOOD_GLOW_STD_WIDE = 6;
const MOOD_GLOW_STD_TIGHT = 3;
// Proportional to `size`, not a flat px number - a flat 16px pad (this
// component's row icons are 40px, but the chip's is only 22px) made the
// glow's own canvas bigger than the icon it was padding, bleeding into the
// chip's neighboring "Сегодня: " text (only 4px of gap away). Scaling the
// pad down with the icon keeps the glow proportionate at every size this
// component is actually used at.
const MOOD_GLOW_PAD_RATIO = 0.4;

function MoodIcon({ source, size, active, id }: { source: number; size: number; active: boolean; id: string }) {
  const pad = size * MOOD_GLOW_PAD_RATIO;
  const canvas = size + pad * 2;
  return (
    <Svg width={canvas} height={canvas} style={{ margin: -pad }}>
      {active ? (
        <>
          <Defs>
            <Filter id={`moodGlowWide-${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation={MOOD_GLOW_STD_WIDE} />
            </Filter>
            <Filter id={`moodGlowTight-${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation={MOOD_GLOW_STD_TIGHT} />
            </Filter>
          </Defs>
          <SvgImage href={source} x={pad} y={pad} width={size} height={size} filter={`url(#moodGlowWide-${id})`} />
          <SvgImage href={source} x={pad} y={pad} width={size} height={size} filter={`url(#moodGlowTight-${id})`} />
        </>
      ) : null}
      <SvgImage href={source} x={pad} y={pad} width={size} height={size} />
    </Svg>
  );
}

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
//
// 2026-09-29 pass, her on-device catches:
// - icon had no press feedback at all, and once collapsed the chip's icon
//   looked identical to the unanswered card's - added a shared violet glow
//   treatment (same recipe as the app's other active/glow states, see
//   iconGlowActive below) that lights up on press and then stays lit in the
//   chip, so "this one's picked" reads the same in both places.
// - the mood word in the chip ("хорошо") now carries the same gradient as
//   the "Доброе утро, Анастасия" heading (gradients.headingText) instead of
//   a flat color, so the one piece of the chip that names today's answer
//   reads as the same "signal" language as the greeting.
// - chip now stretches to the screen's normal 16px margins like every other
//   block on Home, instead of hugging its own content width.
// Wide enough for "нейтрально" (the longest of the 5 mood words) at this
// fontSize/weight - used as the Svg's width until the real measurement
// lands, so the word is never in a 0-width/unrendered state at all (see
// below).
const GRADIENT_WORD_FALLBACK_WIDTH = 90;

function GradientMoodWord({ text }: { text: string }) {
  // Was `width > 0 ? <Svg>...</Svg> : null` - rendering nothing at all until
  // the hidden measuring Text's onLayout fired. Her 2026-09-29 catch ("слово
  // Хорошо постепенно исчезает" right as the card collapses into the chip)
  // is exactly this word popping in and out of existence while that
  // measurement race overlaps with the chip's own FadeIn - a real gap in the
  // logic, not just a timing coincidence. The Svg now always renders, using
  // this safe fallback width until the precise one lands (a small width
  // correction once it does, same "measure for real" pattern as everywhere
  // else in this app, just never hidden in between).
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const fontSize = 14;
  const width = measuredWidth || GRADIENT_WORD_FALLBACK_WIDTH;

  return (
    <View style={styles.gradientWordWrap}>
      <Text
        style={[styles.chipMoodMeasure, { fontSize }]}
        onLayout={(e: LayoutChangeEvent) => setMeasuredWidth(e.nativeEvent.layout.width)}
      >
        {text}
      </Text>
      {
        <Svg width={width} height={fontSize * 1.3}>
          <Defs>
            <SvgLinearGradient id="chipMoodGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
              <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
              <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
            </SvgLinearGradient>
          </Defs>
          <SvgText x={0} y={fontSize} fontSize={fontSize} fontFamily={fontFamily.semiBold} fill="url(#chipMoodGrad)">
            {text}
          </SvgText>
        </Svg>
      }
    </View>
  );
}

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
          <View style={styles.chipLeft}>
            <MoodIcon source={MOODS[selected].img} size={22} active id="chip" />
            <Text style={styles.chipText}>Сегодня: </Text>
            <GradientMoodWord text={MOODS[selected].label.toLowerCase()} />
          </View>
          <Text style={styles.chipEdit}>изменить</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    // No `exiting` fade here (was FadeOut.duration(150)) - her 2026-09-29
    // catch ("слово Хорошо постепенно исчезает" when the card collapses):
    // that fade applied to the *whole* card, including the option row, so
    // the exact label she'd just tapped visibly dissolved in place under her
    // finger while the chip faded in elsewhere - a real fade, not a
    // rendering bug, but a jarring one specifically because it's the thing
    // she just picked. The card now disappears the instant `selected`
    // changes instead of lingering on screen mid-fade; the chip's own
    // FadeIn is untouched.
    <Animated.View style={styles.card} entering={FadeIn.duration(200)}>
      {/* Real --card-fill port, same recipe as MoonSunCard.tsx (2026-08-20
          fix there): a flat opaque fallback here made the card read as a
          solid box blocking the starfield right at the top of Home, the
          most visible spot on the screen - she caught this on-device
          2026-09-14, ui-designer confirmed it's the same known issue and
          recommended porting the identical gradient rather than inventing
          a second treatment. */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
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
              {({ pressed }) => (
                <>
                  <MoodIcon source={m.img} size={40} active={pressed} id={`opt-${i}`} />
                  <Text style={styles.optionLabel} numberOfLines={1}>
                    {m.label}
                  </Text>
                </>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Border ported from FocusCard, not from a button - 2026-09-14, per
  // ui-designer: glow always means "press me once, one-off action" in this
  // app's visual language (every button), while a plain violet border is
  // the existing signal for "distinct interactive object" (FocusCard) vs.
  // "atmospheric read-only content" (MoonSunCard's own borderless fill,
  // which the card fill itself was ported from). This card is a daily
  // 5-way choice, not a CTA, so it gets the border language, not glow.
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.violet300,
    overflow: 'hidden',
  },
  // Second --card-fill layer (a uniform light wash on top of the radial
  // gradient) - same as MoonSunCard's own whiteWash, too subtle to need
  // its own gradient.
  whiteWash: {
    ...StyleSheet.absoluteFill,
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
  // No fixed width any more (was 56) - a box wide enough for the icon (40)
  // but otherwise hugging its own label's real width. Two problems this
  // fixes at once (2026-09-29, her catch):
  // 1. "Нейтрально" is the longest label - forced into the same 56px box as
  //    the other four, `adjustsFontSizeToFit` was shrinking just that one
  //    word's font size to fit, so it visibly rendered smaller than
  //    "Ужасно"/"Плохо"/"Хорошо"/"Отлично". Letting the box size to content
  //    means no label ever needs to shrink.
  // 2. The fixed-56 box centered a 40px icon inside it, so the first icon
  //    sat ~8px further in from the card's left edge than the "Как ты
  //    сегодня?" text above it (which sits flush at the card's own 16px
  //    padding) - a gap she could see side by side. Content-hugging boxes
  //    are close to the icon's own width, so the left/right icons land
  //    close to flush with that same 16px edge instead.
  option: {
    alignItems: 'center',
    minWidth: 40,
    gap: 6,
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
  //
  // Stretches to the screen's normal 16px margins now (was `alignSelf:
  // 'flex-start'`, hugging its own content) - her ask 2026-09-29: "сама
  // плашка должна быть по ширине как и все остальное". `justifyContent:
  // 'space-between'` puts "изменить" at the now-real right edge instead of
  // stranding it right next to the mood word.
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(11,14,31,0.6)',
    borderWidth: 1,
    borderColor: colors.violet300,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  chipText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  gradientWordWrap: {
    justifyContent: 'center',
  },
  chipMoodMeasure: {
    position: 'absolute',
    opacity: 0,
    fontFamily: fontFamily.semiBold,
  },
  chipEdit: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.violet300,
    textDecorationLine: 'underline',
  },
});
