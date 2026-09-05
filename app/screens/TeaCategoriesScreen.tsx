import { View, Text, Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily, radius } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { BackIcon } from '../components/icons/BackIcon';

type Category = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  ratio: number;
  available: boolean;
};

// WF 29 "Tea categories" - the real entry point of "Чай как ритуал", her
// correction 2026-09-07: Care's "Начать церемонию" was going straight into
// the "Успокоение на вечер" stories, skipping this picker screen entirely -
// "мы же изначально должны попасть на экран где категории чаев". Only that
// one category has real herb content behind it (see TeaCeremonyScreen.tsx's
// own note on this), so the other 4 are shown but marked "Скоро" and not
// tappable - same "visible unavailable state, not a silent dead tap"
// treatment the scenario audit already called for on Care's own dead
// elements (docs/state/findings.md #1), applied here from the start instead
// of shipping another one of those.
const CATEGORIES: Category[] = [
  {
    title: 'Успокоение на вечер',
    description: 'Для замедления, расслабления и подготовки ко сну',
    image: require('../assets/tea/category-calming.png'),
    ratio: 686 / 686,
    available: true,
  },
  {
    title: 'Мягкая энергия',
    description: 'Для спокойного пробуждения и постепенного наполнения энергией',
    image: require('../assets/tea/category-soft-energy.png'),
    ratio: 734 / 686,
    available: false,
  },
  {
    title: 'Фокус и ясность',
    description: 'Для концентрации, внимания и ясных мыслей',
    image: require('../assets/tea/category-focus.png'),
    ratio: 686 / 686,
    available: false,
  },
  {
    title: 'Тепло и восстановление',
    description: 'Поддержка тела, ощущение уюта и внутреннего тепла',
    image: require('../assets/tea/category-warmth.png'),
    ratio: 686 / 686,
    available: false,
  },
  {
    title: 'Интуитивный выбор',
    description: 'Доверься ощущению — выбери чай без размышлений',
    image: require('../assets/tea/category-intuitive-choice.png'),
    ratio: 662 / 686,
    available: false,
  },
];

const IMAGE_SIZE = 140;

export function TeaCategoriesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

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
          <Text style={styles.title}>Чай как ритуал</Text>
          <Text style={styles.subtitle}>
            Подбери чай под своё состояние — для спокойствия, энергии или мягкой поддержки тела.
          </Text>
        </View>

        <View style={styles.list}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.title}
              disabled={!c.available}
              onPress={() => navigation.navigate('TeaCeremony')}
              style={({ pressed }) => [
                styles.card,
                !c.available && styles.cardUnavailable,
                c.available && pressed && styles.cardPressed,
              ]}
            >
              {!c.available ? (
                <View style={styles.soonBadge}>
                  <Text style={styles.soonBadgeLabel}>Скоро</Text>
                </View>
              ) : null}
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Image
                source={c.image}
                resizeMode="contain"
                style={{ width: IMAGE_SIZE * c.ratio, height: IMAGE_SIZE, marginTop: 20 }}
              />
              <Text style={styles.cardDescription}>{c.description}</Text>
            </Pressable>
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
    color: colors.textSecondary,
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
