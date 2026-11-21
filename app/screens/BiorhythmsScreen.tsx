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
import { InfoIcon } from '../components/icons/InfoIcon';
import { InfoSheet } from '../components/InfoSheet';
import { BIORHYTHM_INFO_TITLE, BIORHYTHM_INFO_PARAGRAPHS } from '../content/biorhythmInfo';
import { formatBirthDate, type BirthDate } from '../lib/biorhythm';
import { useT } from '../i18n/useT';
import { useLanguage, type Language } from '../i18n/LanguageContext';

type Level = {
  titleKey: string;
  icon: 'pulse' | 'brain';
  useCareIcon?: boolean;
  textKey: string;
  ringValue: string;
  ringCaptionKey: string;
  doKeys: string[];
  dontKeys: string[];
};

// WF38 "Analytics - Biorhythm". Copy ported from the wireframe as closely as
// possible - two obvious wireframe typos corrected ("Перерузки" ->
// "Перегрузки", "Дневника" -> "Дневник", matching the nominative single-word
// style of every other bullet in the same lists), nothing else reworded.
// День/Неделя/Месяц tabs are static (WF only ever shows one real dataset) -
// "День" is the only one wired to anything.
// Ring values stored with a plain decimal point (source-of-truth); the
// Russian locale re-formats it to a comma at render time, see
// formatRingValue below - same pattern as BiorhythmChart's own formatPct.
const LEVELS: Level[] = [
  {
    titleKey: 'biorhythms.physicalTitle',
    icon: 'pulse',
    ringValue: '49.8',
    ringCaptionKey: 'biorhythms.ringPhysical',
    textKey: 'biorhythms.physicalText',
    doKeys: ['biorhythms.physicalDo1', 'biorhythms.physicalDo2', 'biorhythms.physicalDo3'],
    dontKeys: ['biorhythms.physicalDont1', 'biorhythms.physicalDont2', 'biorhythms.physicalDont3'],
  },
  {
    titleKey: 'biorhythms.emotionalTitle',
    icon: 'pulse',
    useCareIcon: true,
    ringValue: '-96.3',
    ringCaptionKey: 'biorhythms.ringEmotional',
    textKey: 'biorhythms.emotionalText',
    doKeys: ['biorhythms.emotionalDo1', 'biorhythms.emotionalDo2', 'biorhythms.emotionalDo3'],
    dontKeys: ['biorhythms.emotionalDont1', 'biorhythms.emotionalDont2', 'biorhythms.emotionalDont3'],
  },
  {
    titleKey: 'biorhythms.intellectTitle',
    icon: 'brain',
    ringValue: '68.1',
    ringCaptionKey: 'biorhythms.ringIntellect',
    textKey: 'biorhythms.intellectText',
    doKeys: ['biorhythms.intellectDo1', 'biorhythms.intellectDo2', 'biorhythms.intellectDo3', 'biorhythms.intellectDo4'],
    dontKeys: ['biorhythms.intellectDont1', 'biorhythms.intellectDont2', 'biorhythms.intellectDont3'],
  },
];

function formatRingValue(value: string, language: Language) {
  return `${language === 'ru' ? value.replace('.', ',') : value}%`;
}

// Finding #17's other half (audit-qa/owner, 2026-09-18): automated
// validation can only catch impossible dates (future, 120+ years back -
// already done on the picker), never a plausible-but-wrong one (a typo
// that still lands on a real date). ux-architect + ui-designer both
// recommended putting the entered date here, inside this screen's own
// InfoSheet, not as a permanent visible element and not repeated on
// Home's copy of the same sheet - Home is "state right now", this screen
// is "how the calculation works," and someone doubting the numbers opens
// this (i) anyway. Mock date for now, matching every other number on
// this screen (chart/rings/summary are all still the hand-authored demo
// data, not wired to a real entered date yet) - swap for the real value
// once birth date actually flows from onboarding through app state.
const MOCK_BIRTH_DATE: BirthDate = { day: 14, month: 5, year: 1995 };

export function BiorhythmsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [selectedDay, setSelectedDay] = useState(14);
  const [infoVisible, setInfoVisible] = useState(false);
  const chartWidth = Math.min(screenWidth - 40, 380);
  const t = useT();
  const { language } = useLanguage();
  const birthDateNote = t('biorhythms.birthDateNote', { date: formatBirthDate(MOCK_BIRTH_DATE) });

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backRow}>
            <Text style={styles.backLabel}>{t('biorhythms.backLink')}</Text>
          </Pressable>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{t('biorhythms.title')}</Text>
            <Pressable
              onPress={() => setInfoVisible(true)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('biorhythms.a11y')}
            >
              <InfoIcon size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          <BiorhythmChart width={chartWidth} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

          <View style={styles.tabsRow}>
            <Text style={[styles.tab, styles.tabActive]}>{t('biorhythms.tabDay')}</Text>
            <Text style={styles.tab}>{t('biorhythms.tabWeek')}</Text>
            <Text style={styles.tab}>{t('biorhythms.tabMonth')}</Text>
          </View>

          <View style={styles.ringsRow}>
            {LEVELS.map((l) => (
              <View key={l.titleKey} style={styles.ring}>
                <Text style={styles.ringValue}>{formatRingValue(l.ringValue, language)}</Text>
                <Text style={styles.ringCaption}>{t(l.ringCaptionKey)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.summary}>{t('biorhythms.summary')}</Text>

          {LEVELS.map((l) => (
            <View key={l.titleKey} style={styles.section}>
              <View style={styles.sectionHeader}>
                {l.useCareIcon ? <CareHandIcon size={26} /> : <GradientIcon name={l.icon} size={26} />}
                <Text style={styles.sectionTitle}>{t(l.titleKey)}</Text>
              </View>
              <Text style={styles.sectionText}>{t(l.textKey)}</Text>
              <View style={styles.columns}>
                <View style={styles.column}>
                  {l.doKeys.map((k) => (
                    <View key={k} style={styles.bulletRow}>
                      <DoIcon size={18} />
                      <Text style={styles.bulletText}>{t(k)}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.column}>
                  {l.dontKeys.map((k) => (
                    <View key={k} style={styles.bulletRow}>
                      <DontIcon size={18} />
                      <Text style={styles.bulletText}>{t(k)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <InfoSheet
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
        title={BIORHYTHM_INFO_TITLE[language]}
        paragraphs={[...BIORHYTHM_INFO_PARAGRAPHS[language], birthDateNote]}
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
  titleRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
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
    // White at 75%, not textSecondary - this is a continuation of the
    // section title's content (an explanation), not a UI chrome label
    // (her secondary-color rule, 2026-10-12).
    color: 'rgba(255,255,255,0.75)',
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
