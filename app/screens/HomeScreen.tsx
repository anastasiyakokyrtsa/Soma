import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, useWindowDimensions, type TextLayoutEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily, gradients } from '../theme';
import { BiorhythmChart } from '../components/BiorhythmChart';
import { MoonSunCard } from '../components/MoonSunCard';
import { FocusCard } from '../components/FocusCard';
import { QuoteCard } from '../components/QuoteCard';
import { ProfileIcon } from '../components/icons/ProfileIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { StarsBackground } from '../components/StarsBackground';
import { InfoSheet } from '../components/InfoSheet';
import { MoodCheckIn } from '../components/MoodCheckIn';
import { BAR_VIEWBOX_W, BAR_VIEWBOX_H } from '../components/BottomBar';
import { BIORHYTHM_INFO_TITLE, BIORHYTHM_INFO_PARAGRAPHS } from '../content/biorhythmInfo';
import { useT } from '../i18n/useT';
import { useLanguage } from '../i18n/LanguageContext';
import { dayParagraphs } from '../i18n/dictionaries/home';

const MOON_IMAGE = require('../assets/illustrations/moon-cutout.png');
const SUN_IMAGE = require('../assets/illustrations/sun-cutout.png');

// WF "Home v2" (Figma node 579:510) - 1:1 from get_design_context + the kit's
// already-finished components (Biorhythm Chart, Moon and Sun Activity, Quote
// Card - reused verbatim, not redesigned - 2026-08-17: "бери оттуда, чтобы в
// точности такое же было"). The screen previously filed here was actually
// the Care screen (wrong Figma link) - see CareScreen.tsx.
const SIDE_MARGIN = 16;

const GAP = {
  // Mood check-in (audit findings #6/#11, built 2026-09-14) sits between
  // the greeting and Биоритмы - it needs to happen before the day's
  // interpretation text is read, not after, so it can't go lower on the
  // screen than this. 32 to greeting (matches the old direct
  // greeting->Биоритмы gap this replaced), 60 down to Биоритмы (the
  // established between-blocks rhythm used everywhere else on this screen).
  greetingToMood: 32,
  moodToBiorhythmTitle: 60,
  titleToChart: 20,
  chartToParagraph: 20,
  // block-to-block gaps: tried unifying to 32 (matching the old direct
  // greetingToBiorhythmTitle gap, since renamed/split above)
  // 2026-08-20, then reverted the same day ("ты наверное прав, давай между
  // блоками вернем 60 пикселей") - back to a uniform 60 for every block
  // transition (not the original non-uniform literal Figma deltas 60/67/110).
  paragraphToMoonsun: 60,
  moonsunToFocusTitle: 60,
  focusTitleToCards: 20,
  cardsToQuote: 60,
};

// Transliterated, not translated - a proper name reads as broken/untranslated
// left in Cyrillic inside an otherwise all-English UI (2026-11-21 fix).
const USER_NAME: Record<'ru' | 'en', string> = { ru: 'Анастасия', en: 'Anastasia' };

// 2026-08-19: "тексты ты не сделал разные на каждую дату... на каждую дату
// сделай подходящее описание" - a rule-based generator (pick whichever
// cycle is most extreme) collapsed several different days onto the same
// wording, since only 3 cycles x 2 directions = 6 real templates exist for
// 9 days. Replaced with one hand-written line per day, each read off that
// day's own actual physical/emotional/intellect pattern (see
// BiorhythmChart.tsx's getDayValues for the numbers each of these is
// describing):
// Values below are on the app's current 0-100 scale (no negatives - see
// BiorhythmChart.tsx's yToPct, simplified same-day from an earlier signed
// -100..100 one). The qualitative reads ("X is the low/high point of the
// day") didn't need rewriting when the scale changed, since they're about
// which cycle stands out *relative to the other two on that day*, not about
// hitting a specific absolute number:
// 10: physical 25 emotional 61 intellect 19 - emotional's the outlier (up), body/mind flat-to-low
// 11: physical 47 emotional 43 intellect 8 - intellect notably down, rest steady
// 12: physical 70 emotional 25 intellect 2 - focus almost gone, body strong
// 13: physical 88 emotional 11 intellect 0 - body way up, mind/focus both down
// 14: physical 99 emotional 3 intellect 3 - body very high, mind AND mood both low (not just mood)
// 15: physical 99 emotional 0 intellect 11 - mood at its lowest point of the week, body still strong
// 16: physical 88 emotional 5 intellect 22 - mood still deeply down, body holding
// 17: physical 70 emotional 15 intellect 37 - mood recovering upward, mind holding steady
// 18: physical 47 emotional 30 intellect 52 - intellect's the highlight now, everything else settling
// All 9 used to open with "Сегодня..." - varied the openings so they don't
// all read as the same template with swapped nouns (2026-08-19: "мне не
// нравится что все они одинаково начинаются... как то разнообразь"). Also
// reworked the same day to read less machine-written - the em dash showing
// up in most of them was the specific tell she flagged ("тире часто
// встречается"), swapped for plain commas/periods/colons and less uniform
// sentence rhythm between the 9.
//
// Rewritten again 2026-09-05 per audit findings #3 (wellbeing-safety) and #9
// (claims-reviewer), owner+mentor confirmed: the previous wording stated the
// day's mood/energy as flat fact ("настроение заметно просело") - risks
// reading as a diagnosis and as a self-fulfilling prophecy, and classical
// biorhythm theory has no scientific backing to assert from in the first
// place. Every line now attributes the read to the biorhythm graph itself
// ("биоритм сегодня...", "судя по кривой...") rather than to the person's
// actual state, and softens the graph-to-feeling connection ("может быть
// просто фаза", "причина может быть здесь") instead of asserting it. Same
// underlying per-day pattern and practical suggestion as before (see values
// above) - only the factual/hedged framing changed, not the substance.
// English translation (2026-11-21) keeps this exact hedging - moved to
// i18n/dictionaries/home.ts (dayParagraphs) now that it is bilingual.

// "Доброе утро, {имя}" needs real dynamic line-wrapping (the name's length
// varies) with a gradient fill - unlike the fixed 2-line headings elsewhere,
// which use a hardcoded 2-line SvgText split. RN has no gradient-fill Text,
// so this measures the real wrapped lines with an invisible plain Text first
// (onTextLayout gives each line's real text + position), then renders each
// line through SvgText with the gradient - same "measure for real, don't
// guess" principle as MoodScale's label-width twins.
// 28 - two rounds of "уменьшим шрифт" (2026-08-19): Figma's literal 36, then
// 34, now 28.
const GREETING_FONT_SIZE = 28;

function GreetingHeading({ text }: { text: string }) {
  const [lines, setLines] = useState<{ text: string; y: number }[] | null>(null);

  const onTextLayout = (e: TextLayoutEvent) => {
    setLines(e.nativeEvent.lines.map((l) => ({ text: l.text, y: l.y + l.height * 0.8 })));
  };

  const height = lines ? Math.max(...lines.map((l) => l.y)) + 12 : 80;

  // Web: react-native-web's Text never calls onTextLayout with per-line data,
  // so `lines` stayed null and the greeting simply didn't render on the web
  // link (her 2026-09-24 screenshot: "нет заголовка"). A browser can do the
  // gradient-filled text natively, so no line measuring is needed there.
  if (Platform.OS === 'web') {
    const [c0, c1, c2] = gradients.headingText.colors;
    const [l0, l1, l2] = gradients.headingText.locations;
    const webGradient = {
      backgroundImage: `linear-gradient(135deg, ${c0} ${l0 * 100}%, ${c1} ${l1 * 100}%, ${c2} ${l2 * 100}%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    } as object;
    return (
      <View style={styles.greetingTextWrap} accessible accessibilityRole="header" accessibilityLabel={text}>
        <Text style={[styles.greetingMeasure, { opacity: 1 }, webGradient]}>{text}</Text>
      </View>
    );
  }

  return (
    // accessible+accessibilityLabel on the wrapper collapses the whole
    // subtree into one screen-reader element that reads `text` - without
    // this, VoiceOver/TalkBack have no guaranteed way to read a heading
    // that's drawn as SvgText (for the gradient fill) rather than plain
    // RN Text (audit finding #16, 2026-09-16). Same fix applied to
    // CareScreen's own gradient title.
    <View style={styles.greetingTextWrap} accessible accessibilityRole="header" accessibilityLabel={text}>
      <Text style={styles.greetingMeasure} onTextLayout={onTextLayout}>
        {text}
      </Text>
      {lines ? (
        <Svg width={270} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="greetingGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
              <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
              <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
            </SvgLinearGradient>
          </Defs>
          {lines.map((l, i) => (
            <SvgText key={i} x={0} y={l.y} fontSize={GREETING_FONT_SIZE} fontFamily={fontFamily.bold} fill="url(#greetingGrad)">
              {l.text}
            </SvgText>
          ))}
        </Svg>
      ) : null}
    </View>
  );
}

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [infoVisible, setInfoVisible] = useState(false);
  const t = useT();
  const { language } = useLanguage();
  // Capped at 380 (the kit's own reference width) but shrinks on anything
  // narrower - was a hardcoded 380 that clipped the axis ("18" cut off) on
  // any phone under 412 logical px wide (2026-08-17 review).
  const chartWidth = Math.min(screenWidth - SIDE_MARGIN * 2, 380);
  // MoonSunCard/FocusCard: 336 is only correct on the Figma reference
  // width (412) - 16 (left margin) + 336 = 352, leaving exactly the 60px
  // trailing gap she measured in Figma before the next card peeks in. A
  // literal 336 on a narrower real device (hers isn't 412 logical px wide)
  // eats into that 60px, or overflows past it entirely - so derive the
  // width from the actual screen instead of hardcoding it (2026-08-20:
  // "если ширина экрана 412, а ширина карточки 336... край карточки
  // не видно, чтобы его увидеть надо скроллить").
  const cardWidth = Math.min(screenWidth - SIDE_MARGIN - 60, 336);
  const [selectedDay, setSelectedDay] = useState(14);
  const paragraph = dayParagraphs[language][selectedDay] ?? dayParagraphs[language][14];
  // Real bar height + insets.bottom + a 60px clearance above it - was a flat
  // 160 (2026-08-26, matching Care's own flat number), but a flat value
  // can't track BottomBar's own height, which *grows* by insets.bottom
  // (home indicator / gesture-nav inset), not just shifts position. On an
  // iPhone with a ~34px bottom inset the bar's real total height already
  // eats nearly all of 160, leaving almost no visible gap above it (her
  // 2026-10-01 catch) - Android's smaller/zero inset left real room by
  // comparison, so this never showed up there. Restores the pre-160
  // inset-aware formula this screen used before (see its own prior history
  // in this comment block), which was replaced by the flat number for
  // being "good enough" without having been checked on a big-inset iPhone.
  const bottomBarHeight = BAR_VIEWBOX_H * (Math.min(screenWidth, BAR_VIEWBOX_W) / BAR_VIEWBOX_W);
  const scrollBottomPadding = bottomBarHeight + insets.bottom + 60;

  return (
    // Единый fade-in вход по всему приложению вместо native-stack transition
    // (`animation: 'none'` в RootNavigator) - её явный ask 2026-09-06: "на
    // всех экранах должен быть такой переход для единообразия".
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      {/* Fixed backdrop, not part of the scrollable column (2026-09-05:
          "звезды как бы на одном месте остаются" while content scrolls over
          them) - sized to the viewport, sibling of the ScrollView rather than
          its first child. */}
      <StarsBackground width={screenWidth} height={screenHeight} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: scrollBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.greetingRow}>
            <GreetingHeading text={t('home.greeting', { name: USER_NAME[language] })} />
            <ProfileIcon size={28} />
          </View>

        <View style={{ marginTop: GAP.greetingToMood }}>
          <MoodCheckIn />
        </View>

        <View style={[styles.biorhythmHeader, { marginTop: GAP.moodToBiorhythmTitle }]}>
          <View style={styles.biorhythmTitleRow}>
            <Text style={[styles.biorhythmTitle, { lineHeight: 24 * 1.1 }]}>{t('home.biorhythmsTitle')}</Text>
            <Pressable
              onPress={() => setInfoVisible(true)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('home.biorhythmsA11y')}
            >
              <InfoIcon size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
          <Pressable onPress={() => navigation.navigate('Biorhythms')} hitSlop={8}>
            <Text style={styles.moreLink}>{t('home.biorhythmsDetails')}</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: GAP.titleToChart }}>
          <BiorhythmChart width={chartWidth} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        </View>

        <Text style={[styles.paragraph, { marginTop: GAP.chartToParagraph }]}>{paragraph}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: GAP.paragraphToMoonsun }}
          contentContainerStyle={styles.moonsunScroll}
        >
          <MoonSunCard
            width={cardWidth}
            title={t('home.moonCardTitle')}
            image={MOON_IMAGE}
            date={t('home.demoDate')}
            phase={t('home.moonPhase')}
            rows={[
              { label: t('home.moonIllumination'), value: t('home.moonIlluminationValue') },
              { label: t('home.moonrise'), value: t('home.moonriseValue') },
              { label: t('home.moonset'), value: t('home.moonsetValue') },
              { label: t('home.untilNewMoon'), value: t('home.untilNewMoonValue') },
            ]}
            note={t('home.moonNote')}
          />
          <MoonSunCard
            width={cardWidth}
            title={t('home.sunCardTitle')}
            image={SUN_IMAGE}
            date={t('home.demoDate')}
            phase={t('home.sunPhase')}
            rows={[
              { label: t('home.sunIndex'), value: t('home.sunIndexValue') },
              { label: t('home.sunrise'), value: t('home.sunriseValue') },
              { label: t('home.sunset'), value: t('home.sunsetValue') },
              { label: t('home.daylight'), value: t('home.daylightValue') },
            ]}
            note={t('home.sunNote')}
          />
        </ScrollView>

        <Text style={[styles.focusTitle, { marginTop: GAP.moonsunToFocusTitle }]}>{t('home.focusTitle')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: GAP.focusTitleToCards }}
          contentContainerStyle={styles.focusScroll}
        >
          {/* Text reworded 2026-08-27, take 3. Take 2 fixed the orphaned
              last word on cards 1/3 but shortened them enough to fall
              short of card 2's own line count - "в первой карточке не
              хватает одной строки, а в последней целых две, некрасиво
              когда пустота" (uneven card heights in this horizontally-
              scrolling row read as broken). Simulated real word-wrap at
              this card width's measured ~34-char/line budget (calibrated
              off her actual screenshot) for all 3 texts: card 2 (untouched
              throughout) wraps to 6 lines, card 1 was only 5, card 3 only
              4 - exactly matching what she reported (short by 1 and 2
              lines respectively). Lengthened cards 1 and 3 just enough to
              also land at 6 lines each, re-simulated to confirm, and kept
              each ending on a multi-word final line (not reintroducing the
              orphan-word problem take 2 had just fixed). Card 2 still
              untouched. */}
          <FocusCard width={cardWidth} icon="lotus" title={t('home.focus1Title')} text={t('home.focus1Text')} />
          <FocusCard width={cardWidth} icon="idea" title={t('home.focus2Title')} text={t('home.focus2Text')} />
          <FocusCard width={cardWidth} icon="broom" title={t('home.focus3Title')} text={t('home.focus3Text')} />
        </ScrollView>

        <View style={{ marginTop: GAP.cardsToQuote }}>
          {/* reuses chartWidth - same min(screenWidth-32,380) cap the kit's
              own 380px reference needs on a narrower-than-380 real device
              (2026-08-20). */}
          <QuoteCard
            width={chartWidth}
            quote={t('home.quoteText')}
            author={t('home.quoteAuthor')}
          />
        </View>
        </View>
      </ScrollView>
      <InfoSheet
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
        title={BIORHYTHM_INFO_TITLE[language]}
        paragraphs={BIORHYTHM_INFO_PARAGRAPHS[language]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  content: {
    paddingHorizontal: SIDE_MARGIN,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetingTextWrap: {
    width: 270,
  },
  greetingMeasure: {
    width: 270,
    opacity: 0,
    fontFamily: fontFamily.bold,
    fontSize: GREETING_FONT_SIZE,
    lineHeight: GREETING_FONT_SIZE * 1.1,
  },
  biorhythmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  biorhythmTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  biorhythmTitle: {
    fontFamily: fontFamily.semiBold,
    // 24 - "Биоритмы... уменьшить на 4" (2026-08-19), Figma's literal was 28.
    fontSize: 24,
    lineHeight: 24 * 1.5,
    color: colors.textPrimary,
  },
  moreLink: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.violet300,
    textDecorationLine: 'underline',
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.2,
    color: colors.textPrimary,
  },
  // no paddingRight here: this ScrollView already lives inside `content`
  // (paddingHorizontal:SIDE_MARGIN), so its own viewport right edge is
  // already exactly SIDE_MARGIN from the screen edge - adding paddingRight
  // here too double-counted the margin, landing the last card 32px from
  // the edge instead of 16 when scrolled all the way (caught 2026-08-20).
  moonsunScroll: {
    gap: 12,
  },
  focusTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 22,
    lineHeight: 22 * 1.5,
    color: colors.textPrimary,
  },
  // same double-margin issue as moonsunScroll above - fixed the same way.
  focusScroll: {
    gap: 12,
  },
});
