import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, type NativeSyntheticEvent, type TextLayoutEventData } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily, gradients } from '../theme';
import { BiorhythmChart } from '../components/BiorhythmChart';
import { MoonSunCard } from '../components/MoonSunCard';
import { FocusCard } from '../components/FocusCard';
import { QuoteCard } from '../components/QuoteCard';
import { ProfileIcon } from '../components/icons/ProfileIcon';
import { StarsBackground } from '../components/StarsBackground';

const MOON_IMAGE = require('../assets/illustrations/moon-cutout.png');
const SUN_IMAGE = require('../assets/illustrations/sun-cutout.png');

// WF "Home v2" (Figma node 579:510) - 1:1 from get_design_context + the kit's
// already-finished components (Biorhythm Chart, Moon and Sun Activity, Quote
// Card - reused verbatim, not redesigned - 2026-08-17: "бери оттуда, чтобы в
// точности такое же было"). The screen previously filed here was actually
// the Care screen (wrong Figma link) - see CareScreen.tsx.
const SIDE_MARGIN = 16;

const GAP = {
  greetingToBiorhythmTitle: 32,
  titleToChart: 20,
  chartToParagraph: 20,
  // block-to-block gaps: tried unifying to 32 (matching greetingToBiorhythmTitle)
  // 2026-08-20, then reverted the same day ("ты наверное прав, давай между
  // блоками вернем 60 пикселей") - back to a uniform 60 for every block
  // transition (not the original non-uniform literal Figma deltas 60/67/110).
  paragraphToMoonsun: 60,
  moonsunToFocusTitle: 60,
  focusTitleToCards: 20,
  cardsToQuote: 60,
};

const USER_NAME = 'Анастасия';

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
const DAY_PARAGRAPHS: Record<number, string> = {
  10: 'Настроение сегодня заметно приподнятое, отличный повод сделать что-то приятное для себя. Тело и разум пока просят тишины, так что сложные задачи лучше отложить.',
  11: 'Мысли сегодня разбегаются, трудно удержать фокус. Зато тело и настроение в полном порядке, так что переключись на простые понятные дела, а важные решения оставь на потом.',
  12: 'Концентрации сегодня почти не найти, зато сил в теле хоть отбавляй. Отличный день для движения, но не для серьёзных решений.',
  13: 'Тело сегодня полно энергии, а вот голове и настроению нужна пауза. Не старайся успеть всё сразу: лучше займись чем-то физическим, а не умственным.',
  14: 'И мысли, и настроение сегодня заметно просели, хотя тело чувствует себя прекрасно. Не грузи себя решениями и сложными разговорами: лучше направь силы в тело и дай себе спокойно восстановиться.',
  15: 'Похоже, это самый тяжёлый по настроению день недели, хотя тело держится отлично. Будь мягче к себе в общении и отложи важные разговоры на потом.',
  16: 'Эмоции всё ещё ощутимо просели, зато тело полно сил. Физическая активность поможет мягче пережить этот спад.',
  17: 'Настроение потихоньку выравнивается, а разум и тело держатся стабильно. Хороший день для привычных дел без лишнего напряжения.',
  18: 'Голова сегодня особенно ясная, а тело и настроение в спокойном балансе. Удачный момент для аналитической работы и планов.',
};

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

  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setLines(e.nativeEvent.lines.map((l) => ({ text: l.text, y: l.y + l.height * 0.8 })));
  };

  const height = lines ? Math.max(...lines.map((l) => l.y)) + 12 : 80;

  return (
    <View style={styles.greetingTextWrap}>
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

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
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
  // Real content height, measured off the ScrollView itself - the star
  // background needs to span the *whole* scrollable column (it's meant to
  // scroll together with the content, not sit fixed behind the viewport,
  // matching Figma's own "Star Field" frame being part of the tall
  // scrollable Home v2 frame) - can't know this size ahead of a render since
  // it depends on real text wrapping/device width.
  //
  // Only ever grows, never shrinks: `paragraph`'s length (and so the
  // ScrollView's real content height) changes with the selected day, and
  // re-setting this on every change re-stretched the star SVG
  // (preserveAspectRatio="none") to the new height each time - visible as
  // the whole starfield "moving" when tapping a different date. Clamping to
  // the max height ever seen keeps it visually static after it first
  // settles, while still fully covering the tallest real content.
  const [contentHeight, setContentHeight] = useState(0);
  const [selectedDay, setSelectedDay] = useState(14);
  const paragraph = DAY_PARAGRAPHS[selectedDay] ?? DAY_PARAGRAPHS[14];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(_w, h) => setContentHeight((prev) => Math.max(prev, h))}
      >
        <StarsBackground width={screenWidth} height={contentHeight} />

        <View style={styles.content}>
          <View style={styles.greetingRow}>
            <GreetingHeading text={`Доброе утро, ${USER_NAME}`} />
            <ProfileIcon size={28} />
          </View>

        <View style={[styles.biorhythmHeader, { marginTop: GAP.greetingToBiorhythmTitle }]}>
          <Text style={styles.biorhythmTitle}>Биоритмы</Text>
          <Text style={styles.moreLink}>Подробнее</Text>
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
            title="Лунная активность"
            image={MOON_IMAGE}
            date="14 марта, 18:07"
            phase="Убывающая луна"
            rows={[
              { label: 'Освещенность', value: '24%' },
              { label: 'Восход', value: '4:32 утра' },
              { label: 'Закат', value: '12:15 дня' },
              { label: 'До новолуния', value: '6 дней' },
            ]}
            note="Конец лунного цикла. В ближайшие дни рекомендуется снизить нагрузку и сфокусироваться на отдыхе и восстановлении ресурса."
          />
          <MoonSunCard
            width={cardWidth}
            title="Солнечная активность"
            image={SUN_IMAGE}
            date="14 марта, 18:07"
            phase="Умеренная солнечная активность"
            rows={[
              { label: 'Индекс', value: 'Кп 3/9' },
              { label: 'Восход', value: '7:12 утра' },
              { label: 'Закат', value: '18:41 дня' },
              { label: 'Световой день', value: '11 ч 26 мин' },
            ]}
            note="Солнечная активность умеренная, день подойдёт для спокойной и сосредоточенной работы."
          />
        </ScrollView>

        <Text style={[styles.focusTitle, { marginTop: GAP.moonsunToFocusTitle }]}>Фокус дня</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: GAP.focusTitleToCards }}
          contentContainerStyle={styles.focusScroll}
        >
          <FocusCard
            width={cardWidth}
            icon="lotus"
            title="Мягкий старт"
            text="Не время для рекордов, но идеальное время для «входа» в ритм. Подойдет пилатес, растяжка или долгая прогулка. Это поднимет серотонин и сгладит эмоциональный провал."
          />
          <FocusCard
            width={cardWidth}
            icon="idea"
            title="Планирование"
            text="Идеальный момент для аналитической работы в одиночестве. Пишите стратегии, учите языки, разбирайте почту. Избегайте брейнштормов и публичных выступлений."
          />
          <FocusCard
            width={cardWidth}
            icon="broom"
            title="Пространство"
            text="Выбросьте лишнее из дома и цифрового пространства. Избавление от старого даст чувство контроля и облегчения, что очень важно при низком эмоциональном биоритме."
          />
        </ScrollView>

        <View style={{ marginTop: GAP.cardsToQuote }}>
          <QuoteCard quote={'Важно не то, как ты идёшь, а то, что ты\nне останавливаешься'} author="Конфуций" />
        </View>
        </View>
      </ScrollView>
    </View>
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
