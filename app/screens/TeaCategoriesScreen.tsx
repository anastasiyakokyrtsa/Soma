import { View, Text, Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily, radius } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { BackIcon } from '../components/icons/BackIcon';
import { useT } from '../i18n/useT';
import { FEATURE_TEA_FULL_CATEGORIES } from '../lib/featureFlags';
import type { TeaCategoryId } from '../content/teaCategories';

type Category = {
  titleKey: string;
  descKey: string;
  image: ImageSourcePropType;
  ratio: number;
  // Present for the 4 real categories - TeaCeremony is parametrized by this
  // id (content/teaCategories.ts). Absent only for "Интуитивный выбор"
  // (cat5), which isn't a category with its own herb list - it's a
  // mechanic (TeaIntuitiveChoiceScreen) that draws from all 4 others.
  categoryId?: TeaCategoryId;
};

// WF 29 "Tea categories" - the real entry point of "Чай как ритуал", her
// correction 2026-09-07: Care's "Начать церемонию" was going straight into
// the "Успокоение на вечер" stories, skipping this picker screen entirely -
// "мы же изначально должны попасть на экран где категории чаев".
//
// Originally only "Успокоение на вечер" had real herb content behind it, so
// the other 4 were shown but marked "Скоро" and not tappable - same
// "visible unavailable state, not a silent dead tap" treatment the scenario
// audit already called for on Care's own dead elements
// (docs/state/findings.md #1). ADR 001 "3. Чай ×4 категории" /
// decisions.md 2026-11-21/22 #6 build out the other 4 (text+recipes real,
// illustrations a placeholder until she sends real art) behind
// FEATURE_TEA_FULL_CATEGORIES - flag off keeps the exact original
// "only cat1 available" behavior.
const CATEGORIES: Category[] = [
  {
    titleKey: 'tea.cat1Title',
    descKey: 'tea.cat1Desc',
    image: require('../assets/tea/category-calming.png'),
    ratio: 686 / 686,
    categoryId: 'calming',
  },
  {
    titleKey: 'tea.cat2Title',
    descKey: 'tea.cat2Desc',
    image: require('../assets/tea/category-soft-energy.png'),
    ratio: 734 / 686,
    categoryId: 'softEnergy',
  },
  {
    titleKey: 'tea.cat3Title',
    descKey: 'tea.cat3Desc',
    image: require('../assets/tea/category-focus.png'),
    ratio: 686 / 686,
    categoryId: 'focus',
  },
  {
    titleKey: 'tea.cat4Title',
    descKey: 'tea.cat4Desc',
    image: require('../assets/tea/category-warmth.png'),
    ratio: 686 / 686,
    categoryId: 'warmth',
  },
  {
    titleKey: 'tea.cat5Title',
    descKey: 'tea.cat5Desc',
    image: require('../assets/tea/category-intuitive-choice.png'),
    ratio: 662 / 686,
    // No categoryId - see the type's own comment above.
  },
];

const IMAGE_SIZE = 140;

export function TeaCategoriesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const t = useT();

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('tea.categoriesTitle')}</Text>
          <Text style={styles.subtitle}>{t('tea.categoriesSubtitle')}</Text>
        </View>

        <View style={styles.list}>
          {CATEGORIES.map((c) => {
            // Flag off: only "Успокоение на вечер" (calming) is available,
            // exactly the previous behavior. Flag on: all 5 cards are real
            // destinations - the 4 categories push TeaCeremony with their
            // id, "Интуитивный выбор" (no categoryId) pushes the picker
            // mechanic instead.
            const available = FEATURE_TEA_FULL_CATEGORIES || c.categoryId === 'calming';
            return (
              <Pressable
                key={c.titleKey}
                disabled={!available}
                onPress={() => {
                  if (c.categoryId) navigation.navigate('TeaCeremony', { categoryId: c.categoryId });
                  else navigation.navigate('TeaIntuitiveChoice');
                }}
                style={({ pressed }) => [styles.card, !available && styles.cardUnavailable, available && pressed && styles.cardPressed]}
              >
                {!available ? (
                  <View style={styles.soonBadge}>
                    <Text style={styles.soonBadgeLabel}>{t('tea.soonBadge')}</Text>
                  </View>
                ) : null}
                <Text style={styles.cardTitle}>{t(c.titleKey)}</Text>
                <Image
                  source={c.image}
                  resizeMode="contain"
                  style={{ width: IMAGE_SIZE * c.ratio, height: IMAGE_SIZE, marginTop: 20 }}
                />
                <Text style={styles.cardDescription}>{t(c.descKey)}</Text>
              </Pressable>
            );
          })}
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
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    // White at 75%, not textSecondary - subtext under the screen title,
    // same role as every other "title + description" screen header (her
    // secondary-color rule, 2026-10-12).
    color: 'rgba(255,255,255,0.75)',
  },
  list: {
    marginTop: 32,
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: radius.card,
    backgroundColor: colors.cardFillFallback,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  cardPressed: {
    borderColor: colors.violet300,
  },
  cardUnavailable: {
    opacity: 0.55,
  },
  soonBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  soonBadgeLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cardDescription: {
    marginTop: 20,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
