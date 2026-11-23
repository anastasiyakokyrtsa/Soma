import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, fontFamily } from '../theme';
import { CloseIcon } from '../components/icons/CloseIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { StarsBackground } from '../components/StarsBackground';
import { STORIES } from '../content/stories';
import { useTimedReveal, estimateReadMs } from '../lib/useTimedReveal';
import { useT } from '../i18n/useT';
import { useLanguage } from '../i18n/LanguageContext';

// Reading screen for one bedtime story - brief 003's explicit "новый
// формат медленно проявляющегося и гаснущего текста... Единый непрерывный
// скролл-формат, не постраничный свайп", distinct on purpose from
// ArticleReaderScreen's swipe-pages (a different, already-approved format
// for a different kind of content - decisions.md 2026-09-16 locked that
// format for articles specifically, not for every long text in the app).
//
// Sentences stack downward one at a time (not a single crossfading line
// like MeditationSessionScreen - a story reads as continuous prose, a
// meditation instruction reads as one cue at a time), auto-scrolling to
// keep the newest line in view. Pacing uses the same reading-speed timer
// as the meditation screen (lib/useTimedReveal.ts) but with a growing
// interval per line ("нарастающим интервалом", her spec) so the pace
// itself slows down as the story goes on, not just a flat repeat. Earlier
// lines dim as newer ones arrive, and the whole screen darkens gradually
// as the story progresses - both read as "settling into sleep", not just
// a visual flourish.
export function StoryReaderScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const t = useT();
  const { language } = useLanguage();
  const id = route?.params?.id;
  const story = STORIES.find((s) => s.id === id) ?? STORIES[0];
  const sentences = story.sentences[language];

  const [paused, setPaused] = useState(false);
  const { revealed } = useTimedReveal(
    sentences.length,
    (i) => {
      const base = estimateReadMs(sentences[i - 1], { msPerWord: 230, settleMs: 1000, minMs: 2600, maxMs: 9000 });
      // Growing interval - each successive line waits a little longer than
      // the last on top of its own reading-length base, per her spec.
      return base * (1 + i * 0.06);
    },
    paused,
  );

  // `any`, not `useRef<ScrollView>` - RN 0.86's new ref typing
  // (`ScrollViewInstance`) doesn't line up with `ScrollView` the component
  // type itself; `scrollToEnd` is a real runtime method either way.
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(timer);
  }, [revealed]);

  const dimOpacity = Math.min(0.45, (revealed / sentences.length) * 0.5);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <View style={[styles.dimOverlay, { opacity: dimOpacity }]} pointerEvents="none" />

      <View style={[styles.topRow, { top: insets.top + 16 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.iconButton}>
          <CloseIcon size={18} />
        </Pressable>
        <Pressable onPress={() => setPaused((v) => !v)} hitSlop={8} style={styles.iconButton}>
          {paused ? <PlayIcon size={16} color={colors.textPrimary} /> : <PauseIcon size={16} color={colors.textPrimary} />}
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 80, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{story.title[language]}</Text>
        <View style={styles.lines}>
          {sentences.slice(0, revealed).map((sentence, i) => {
            const distanceFromLatest = revealed - 1 - i;
            const opacity = Math.max(0.3, 1 - distanceFromLatest * 0.22);
            return (
              <Animated.Text key={i} entering={FadeIn.duration(1100)} style={[styles.line, { opacity }]}>
                {sentence}
              </Animated.Text>
            );
          })}
        </View>
        {paused ? <Text style={styles.pausedLabel}>{t('practices.storyPausedLabel')}</Text> : null}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  topRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  lines: {
    marginTop: 32,
    gap: 20,
  },
  line: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 18 * 1.6,
    color: colors.textPrimary,
  },
  pausedLabel: {
    marginTop: 24,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
