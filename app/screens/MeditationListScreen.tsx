import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily, radius } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { BackIcon } from '../components/icons/BackIcon';
import { GradientIcon } from '../components/icons/GradientIcon';
import { MEDITATIONS } from '../content/meditations';
import { useT } from '../i18n/useT';
import { useLanguage } from '../i18n/LanguageContext';

// Pushed from Care's "Медитации" chip - brief 003 / decisions.md
// 2026-11-21/22 #6. Plain list/menu of the 3 available meditations, per her
// explicit "не обязательно сложный UI" - same card-list shape as
// TeaCategoriesScreen's own picker, just icon-led instead of photo-led
// (none of these practices have commissioned art, same situation as the
// two new articles - see content/meditations.ts).
export function MeditationListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const t = useT();
  const { language } = useLanguage();

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
          <Text style={styles.title}>{t('practices.meditationListTitle')}</Text>
          <Text style={styles.subtitle}>{t('practices.meditationListSubtitle')}</Text>
        </View>

        <View style={styles.list}>
          {MEDITATIONS.map((m) => (
            <Pressable
              key={m.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('MeditationInfo', { id: m.id })}
            >
              <View style={styles.iconRing}>
                <GradientIcon name={m.icon} size={28} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{m.title[language]}</Text>
                <Text style={styles.cardDuration}>{m.duration[language]}</Text>
                <Text style={styles.cardDescription}>{m.description[language]}</Text>
              </View>
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
    color: 'rgba(255,255,255,0.75)',
  },
  list: {
    marginTop: 32,
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.cardFillFallback,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  cardPressed: {
    borderColor: colors.violet300,
    transform: [{ scale: 0.98 }],
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.violet300,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  cardDuration: {
    marginTop: 2,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.violet300,
  },
  cardDescription: {
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: colors.textSecondary,
  },
});
