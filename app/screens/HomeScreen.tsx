import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, type NativeSyntheticEvent, type TextLayoutEventData } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily, gradients } from '../theme';
import { BiorhythmChart } from '../components/BiorhythmChart';
import { MoonSunCard } from '../components/MoonSunCard';
import { FocusCard } from '../components/FocusCard';
import { QuoteCard } from '../components/QuoteCard';
import { ProfileIcon } from '../components/icons/ProfileIcon';

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
  paragraphToMoonsun: 60,
  moonsunToFocusTitle: 67,
  focusTitleToCards: 20,
  cardsToQuote: 110,
};

const USER_NAME = 'Анастасия';

// "Доброе утро, {имя}" needs real dynamic line-wrapping (the name's length
// varies) with a gradient fill - unlike the fixed 2-line headings elsewhere,
// which use a hardcoded 2-line SvgText split. RN has no gradient-fill Text,
// so this measures the real wrapped lines with an invisible plain Text first
// (onTextLayout gives each line's real text + position), then renders each
// line through SvgText with the gradient - same "measure for real, don't
// guess" principle as MoodScale's label-width twins.
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
            <SvgText key={i} x={0} y={l.y} fontSize={36} fontFamily={fontFamily.bold} fill="url(#greetingGrad)">
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingRow}>
          <GreetingHeading text={`Доброе утро, ${USER_NAME}`} />
          <ProfileIcon size={40} />
        </View>

        <View style={[styles.biorhythmHeader, { marginTop: GAP.greetingToBiorhythmTitle }]}>
          <Text style={styles.biorhythmTitle}>Биоритмы</Text>
          <Text style={styles.moreLink}>Подробнее</Text>
        </View>

        <View style={{ marginTop: GAP.titleToChart }}>
          <BiorhythmChart />
        </View>

        <Text style={[styles.paragraph, { marginTop: GAP.chartToParagraph }]}>
          Сегодня эмоциональный ресурс ниже обычного. Тело и разум помогут сохранить устойчивость — планируй день спокойно и не забывай про отдых.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: GAP.paragraphToMoonsun }}
          contentContainerStyle={styles.moonsunScroll}
        >
          <MoonSunCard
            title="Лунная активность"
            image={MOON_IMAGE}
            date="14 марта, 18:07"
            phase="Убывающая луна"
            rows={[
              { label: 'Освещенность', value: '24%' },
              { label: 'Восход', value: '4:32 утра' },
              { label: 'Закат', value: '12:15 дня' },
              { label: 'До новолуния', value: '6 дней' },
            ]}
            note="Конец лунного цикла. В ближайшие дни рекомендуется снизить нагрузку и сфокусироваться на отдыхе и восстановлении ресурса."
          />
          <MoonSunCard
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
            note="Солнечная активность умеренная — день подойдёт для спокойной и сосредоточенной работы."
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
            icon="lotus"
            title="Мягкий старт и обновление"
            text="Не время для рекордов, но идеальное время для «входа» в ритм. Подойдет пилатес, растяжка или долгая прогулка. Это поднимет серотонин и сгладит эмоциональный провал."
          />
          <FocusCard
            icon="idea"
            title="Планирование"
            text="Идеальный момент для аналитической работы в одиночестве. Пишите стратегии, учите языки, разбирайте почту. Избегайте брейнштормов и публичных выступлений."
          />
          <FocusCard
            icon="broom"
            title="Пространство"
            text="Выбросьте лишнее из дома и цифрового пространства. Избавление от старого даст чувство контроля и облегчения, что очень важно при низком эмоциональном биоритме."
          />
        </ScrollView>

        <View style={{ marginTop: GAP.cardsToQuote }}>
          <QuoteCard quote={'Важно не то, как ты идёшь, а то, что ты\nне останавливаешься'} author="Конфуций" />
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
    fontSize: 36,
    lineHeight: 36 * 1.1,
  },
  biorhythmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  biorhythmTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 28,
    lineHeight: 28 * 1.5,
    color: colors.textPrimary,
  },
  moreLink: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.violet300,
    textDecorationLine: 'underline',
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.2,
    color: colors.textPrimary,
  },
  moonsunScroll: {
    gap: 20,
    paddingRight: SIDE_MARGIN,
  },
  focusTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 22,
    lineHeight: 22 * 1.5,
    color: colors.textPrimary,
  },
  focusScroll: {
    gap: 12,
    paddingRight: SIDE_MARGIN,
  },
});
