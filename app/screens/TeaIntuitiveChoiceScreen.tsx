import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, fontFamily, radius, glow } from '../theme';
import { StarsBackground } from '../components/StarsBackground';
import { TeaRecipeRow } from '../components/TeaRecipeRow';
import { BackIcon } from '../components/icons/BackIcon';
import { useT } from '../i18n/useT';
import { ALL_TEA_HERBS, type TeaHerbContent } from '../content/teaCategories';

// "Интуитивный выбор" (tea category 5) - ADR 001 "3. Чай ×4 категории" /
// decisions.md 2026-11-21/22 #6. Not a category with its own herb list: a
// mechanic that picks one random herb out of all 4 real categories' pools
// (18 herbs total, see content/teaCategories.ts). The result is shown as a
// single static card (title/image/description/recipe), not folded into
// TeaCeremonyScreen's swipe-through-a-category flow - her spec: "как
// единичная карта... НЕ со свайпом по всей категории". The title is only
// ever the herb's own name - never the category it happened to come from
// ("сюрприз важнее категоризации").
//
// Picking animation: ~1.3s of a pulsing "Выбираем для тебя…" line via plain
// Reanimated opacity (withRepeat/withTiming on a shared value, no Skia -
// see project memory on the Skia+Reanimated bridge being broken in this
// Expo Go build; this screen never touches Skia so it isn't affected).
const PICK_DELAY_MS = 1300;

export function TeaIntuitiveChoiceScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const t = useT();
  const [attempt, setAttempt] = useState(0);
  const [herb, setHerb] = useState<TeaHerbContent | null>(null);

  useEffect(() => {
    setHerb(null);
    const timer = setTimeout(() => {
      setHerb(ALL_TEA_HERBS[Math.floor(Math.random() * ALL_TEA_HERBS.length)]);
    }, PICK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [attempt]);

  const pulse = useSharedValue(0.4);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 650, easing: Easing.inOut(Easing.ease) }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      {!herb ? (
        <View style={styles.pickingWrap}>
          <Animated.Text style={[styles.pickingText, pulseStyle]}>{t('tea.intuitivePicking')}</Animated.Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 80, paddingHorizontal: 24, paddingBottom: insets.bottom + 40, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={herb.id} style={styles.resultBlock} entering={FadeIn.duration(400).easing(Easing.inOut(Easing.cubic))}>
            <Text style={styles.title}>{t(herb.titleKey)}</Text>
            <Image
              source={herb.image}
              resizeMode="contain"
              style={{ width: RESULT_IMAGE_HEIGHT * herb.imageRatio, height: RESULT_IMAGE_HEIGHT, marginTop: 20 }}
            />
            {herb.isPlaceholderImage ? <Text style={styles.placeholderCaption}>{t('tea.illustrationPlaceholder')}</Text> : null}
            <Text style={styles.description}>{t(herb.descKey)}</Text>
            <View style={styles.recipeList}>
              <TeaRecipeRow icon="spoon" label={t(herb.spoonKey)} />
              <TeaRecipeRow icon="kettle" label={t(herb.kettleKey)} />
              <TeaRecipeRow icon="clock" label={t(herb.clockKey)} />
            </View>
            <Pressable
              style={({ pressed }) => [styles.tryAnotherButton, pressed && styles.tryAnotherButtonPressed]}
              onPress={() => setAttempt((a) => a + 1)}
            >
              <Text style={styles.tryAnotherLabel}>{t('tea.intuitiveTryAnother')}</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      )}
    </Animated.View>
  );
}

const RESULT_IMAGE_HEIGHT = 244 * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  pickingText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  resultBlock: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
    lineHeight: 30 * 1.15,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    marginTop: 20,
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  placeholderCaption: {
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recipeList: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  // Same height/radius/glow recipe as this flow's other primary CTAs
  // (BreathingCompleteScreen's "cta", CareScreen's teaButton) - 60/radius.md,
  // not the onboarding-specific 54/16px literal convention.
  tryAnotherButton: {
    marginTop: 32,
    width: '100%',
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  tryAnotherButtonPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  tryAnotherLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.bg0,
  },
});
