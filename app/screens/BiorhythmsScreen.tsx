import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { BiorhythmChart } from '../components/BiorhythmChart';
import { GradientIcon } from '../components/icons/GradientIcon';
import { CareHandIcon } from '../components/icons/CareHandIcon';
import { DoIcon } from '../components/icons/DoIcon';
import { DontIcon } from '../components/icons/DontIcon';

type Level = {
  title: string;
  icon: 'pulse' | 'brain';
  useCareIcon?: boolean;
  text: string;
  ring: { value: string; caption: string };
  dos: string[];
  donts: string[];
};

// WF38 "Analytics - Biorhythm". Copy ported from the wireframe as closely as
// possible - two obvious wireframe typos corrected ("Перерузки" ->
// "Перегрузки", "Дневника" -> "Дневник", matching the nominative single-word
// style of every other bullet in the same lists), nothing else reworded.
// День/Неделя/Месяц tabs are static (WF only ever shows one real dataset) -
// "День" is the only one wired to anything.
const LEVELS: Level[] = [
  {
    title: 'Физический уровень',
    icon: 'pulse',
    ring: { value: '49,8%', caption: 'Физиология' },
    text:
      'Твой физический биоритм находится сейчас в средней фазе: организм функционирует стабильно, но не в режиме максимального запаса энергии. В такие дни тело хорошо справляется с привычными задачами, однако ты можешь заметно быстро уставать и чувствительнее переносить недостаток сна, стресс или чрезмерную активность. В этот период необходимо внимательно относиться к своему ритму.',
    dos: ['Прогулки', 'Растяжка', 'Спокойный ритм'],
    donts: ['Интенсивные тренировки', 'Недосып', 'Перегрузки'],
  },
  {
    title: 'Эмоциональный уровень',
    icon: 'pulse',
    useCareIcon: true,
    ring: { value: '−96,3%', caption: 'Эмоции' },
    text:
      'Сейчас твои эмоции в фазе повышенной чувствительности: эмоциональный отклик может ощущаться сильнее, а внутренний запас устойчивости — ниже обычного. В такие периоды реакции чаще рождаются из чувств, а не из рациональных оценок: слова и ситуации могут затрагивать глубже, а собственные мысли — звучать громче. Важно не забывать, что это естественный этап эмоционального ритма.',
    dos: ['Дневник', 'Рефлексия', 'Личные границы'],
    donts: ['Важные решения', 'Конфликты', 'Самокритика'],
  },
  {
    title: 'Интеллектуальный уровень',
    icon: 'brain',
    ring: { value: '68,1%', caption: 'Интеллект' },
    text:
      'Интеллектуальный биоритм сейчас находится в восходящей фазе, что может ощущаться как ясность мышления и более лёгкое понимание сложных тем. Этот период подходит для планирования, анализа и задач, требующих внимательности и умственной вовлечённости. При этом стоит помнить, что высокая интеллектуальная активность не всегда нивелирует эмоциональное или физическое утомление.',
    dos: ['Планирование', 'Учёба', 'Чтение', 'Структура'],
    donts: ['Многозадачность', 'Эмоциональные разговоры', 'Работа на износ'],
  },
];

const SUMMARY =
  'Сегодня твоё состояние неравномерно: ум работает ясно и стабильно, физический ресурс — на среднем уровне, а эмоциональный фон находится в чувствительной фазе. Это день, когда важно не требовать от себя слишком многого и опираться на сильные стороны.';

export function BiorhythmsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [selectedDay, setSelectedDay] = useState(14);
  const chartWidth = Math.min(screenWidth - 40, 380);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backRow}>
            <Text style={styles.backLabel}>← Вернуться в галерею данных</Text>
          </Pressable>

          <Text style={styles.title}>Биоритмы</Text>

          <BiorhythmChart width={chartWidth} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

          <View style={styles.tabsRow}>
            <Text style={[styles.tab, styles.tabActive]}>День</Text>
            <Text style={styles.tab}>Неделя</Text>
            <Text style={styles.tab}>Месяц</Text>
          </View>

          <View style={styles.ringsRow}>
            {LEVELS.map((l) => (
              <View key={l.title} style={styles.ring}>
                <Text style={styles.ringValue}>{l.ring.value}</Text>
                <Text style={styles.ringCaption}>{l.ring.caption}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.summary}>{SUMMARY}</Text>

          {LEVELS.map((l) => (
            <View key={l.title} style={styles.section}>
              <View style={styles.sectionHeader}>
                {l.useCareIcon ? <CareHandIcon size={26} /> : <GradientIcon name={l.icon} size={26} />}
                <Text style={styles.sectionTitle}>{l.title}</Text>
              </View>
              <Text style={styles.sectionText}>{l.text}</Text>
              <View style={styles.columns}>
                <View style={styles.column}>
                  {l.dos.map((d) => (
                    <View key={d} style={styles.bulletRow}>
                      <DoIcon size={18} />
                      <Text style={styles.bulletText}>{d}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.column}>
                  {l.donts.map((d) => (
                    <View key={d} style={styles.bulletRow}>
                      <DontIcon size={18} />
                      <Text style={styles.bulletText}>{d}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  content: {
    paddingHorizontal: 20,
  },
  backRow: {
    alignSelf: 'flex-start',
  },
  backLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  title: {
    marginTop: 16,
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.textPrimary,
  },
  tabsRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  tab: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabActive: {
    color: colors.textPrimary,
    textDecorationLine: 'underline',
  },
  ringsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: colors.violet300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  ringCaption: {
    marginTop: 2,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  summary: {
    marginTop: 24,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.textPrimary,
  },
  section: {
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  sectionText: {
    marginTop: 12,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 15 * 1.45,
    color: colors.textSecondary,
  },
  columns: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 14 * 1.3,
    color: colors.textPrimary,
  },
});
