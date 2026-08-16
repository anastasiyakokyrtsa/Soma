import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow, spacing } from '../../theme';
import { StyleSwatch } from '../../components/StyleSwatch';
import { BackIcon } from '../../components/icons/BackIcon';
import { NextPageIcon } from '../../components/icons/NextPageIcon';
import { VISUAL_STYLES, VisualStyleId } from '../../theme/visualStyles';

// #RRGGBB -> rgba(r,g,b,alpha) — used to turn each mood's solid accent into
// a very faint tinted fill for the nav-icon rings (2026-08-08: "фон... ты
// просто заменяешь тоже на цвет кнопок, но делаешь его очень прозрачным" —
// the kit's neutral gray fill, replaced with the mood color itself at low
// alpha, not a separate gray).
function withAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Per-style theming for the screen's *real* chrome (button, nav icons,
// fonts) — see memory/project_app_development.md for the round this landed
// in. Cosmos's values are the app's actual current design (violet/Nunito
// Sans, standard button radius/glow, plain un-backdropped back icon just
// like every other screen) — it isn't "themed," it's just what the app
// already looks like everywhere else. Review 2026-08-08 caught two places
// this had drifted from that: header/tagline text going near-black (using
// mood.onAccent, meant only for text sitting *on* the accent-colored
// button) and the back icon picking up a backdrop it doesn't have anywhere
// else in the app ("для Космос она остаётся такой же как и везде").
const MOOD: Record<
  VisualStyleId,
  {
    accent: string;
    onAccent: string;
    headerFont: string;
    taglineFont: string;
    taglineSize: number;
    buttonFont: string;
    buttonRadius: number;
    glow: boolean;
    plainBackIcon: boolean;
  }
> = {
  cosmos: {
    accent: colors.violet400,
    onAccent: colors.bg0,
    headerFont: 'NunitoSans_700Bold',
    taglineFont: 'NunitoSans_500Medium',
    taglineSize: 15,
    buttonFont: 'NunitoSans_600SemiBold',
    buttonRadius: 16,
    glow: true,
    plainBackIcon: true,
  },
  focus: {
    accent: '#FFFFFF',
    onAccent: '#000000',
    headerFont: 'IBMPlexMono_600SemiBold',
    taglineFont: 'IBMPlexMono_500Medium',
    taglineSize: 15,
    buttonFont: 'IBMPlexMono_600SemiBold',
    // More angular, per her ask ("предлагаю сделать более угловатую
    // кнопку") — fits the geometric/precise mood better than the app's
    // usual rounded corners.
    buttonRadius: 4,
    glow: false,
    plainBackIcon: false,
  },
  nature: {
    accent: '#5E8350',
    onAccent: '#FFFFFF',
    headerFont: 'Fredoka_600SemiBold',
    taglineFont: 'Fredoka_500Medium',
    taglineSize: 15,
    buttonFont: 'Fredoka_600SemiBold',
    // Fully round/pill — "сделай кнопку в Природа прям более круглой мягкой"
    // — half the button's own height so the ends are true semicircles.
    buttonRadius: 27,
    glow: false,
    plainBackIcon: false,
  },
  dawn: {
    accent: '#B85C7C',
    onAccent: '#FFFFFF',
    headerFont: 'CormorantGaramond_600SemiBold',
    taglineFont: 'CormorantGaramond_500Medium_Italic',
    // 15 -> 18: "кегль описания уж слишком мелкий, чуть прибавь" — the
    // italic serif also just optically reads smaller than the sans-serif
    // taglines at the same size.
    taglineSize: 18,
    buttonFont: 'CormorantGaramond_600SemiBold',
    buttonRadius: 16,
    glow: false,
    plainBackIcon: false,
  },
};

const ICON_BACKDROP = 38.5;

export function StylePreviewScreen({ navigation, route }: any) {
  const found = VISUAL_STYLES.findIndex((s) => s.id === route.params?.initialId);
  const [index, setIndex] = useState(found === -1 ? 0 : found);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const style = VISUAL_STYLES[index];
  const mood = MOOD[style.id];

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(400).easing(Easing.inOut(Easing.cubic))}
    >
      <StyleSwatch styleId={style.id} width={width} height={height} radius={0} />

      <LinearGradient
        colors={['rgba(5,8,22,0.6)', 'transparent']}
        style={styles.topScrim}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(5,8,22,0.8)']}
        style={styles.bottomScrim}
        pointerEvents="none"
      />

      <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
        <Pressable
          style={[
            styles.iconRing,
            mood.plainBackIcon
              ? styles.iconRingPlain
              : { borderColor: mood.accent, backgroundColor: withAlpha(mood.accent, 0.14) },
          ]}
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <BackIcon color={mood.plainBackIcon ? colors.textPrimary : mood.accent} />
        </Pressable>
        {/* Header title / tagline stay plain white always — mood.onAccent is
            only for text sitting on the solid accent button surface below,
            using it here made the title unreadable on Focus (black-on-black)
            and just wrong on Cosmos (should be white, not bg0). */}
        <Text style={[styles.headerTitle, { fontFamily: mood.headerFont }]}>{style.name}</Text>
        {/* Invisible spacer, just to center the title — must stay fully
            transparent, this isn't a real button. (Bug fixed 2026-08-08: it
            was picking up iconRing's real fill/border and showing as a
            visible gray circle — "убери эти круги серые в верхних правых
            углах".) */}
        <View style={[styles.iconRing, styles.iconRingPlain]} />
      </View>

      <Pressable
        style={[
          styles.nextButton,
          { borderColor: mood.accent, backgroundColor: withAlpha(mood.accent, 0.14) },
        ]}
        onPress={() => setIndex((i) => (i + 1) % VISUAL_STYLES.length)}
        hitSlop={8}
      >
        {/* Full kit size again, not shrunk — "возьми стрелку Дальше из кита". */}
        <NextPageIcon size={ICON_BACKDROP} color={mood.accent} />
      </Pressable>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 60 }]}>
        <Text
          style={[
            styles.tagline,
            { fontFamily: mood.taglineFont, fontSize: mood.taglineSize, lineHeight: mood.taglineSize * 1.2 },
          ]}
        >
          {style.tagline}
        </Text>

        {/* Same recipe as OnboardingStepLayout's/OnboardingSlide's primary
            button — this is now the 3rd copy of it. Worth extracting into a
            shared PrimaryButton if a 4th screen needs it. */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: mood.accent,
              borderRadius: mood.buttonRadius,
              boxShadow: mood.glow ? `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}` : 'none',
            },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.replace('Personalization')}
        >
          <Text style={[styles.buttonLabel, { fontFamily: mood.buttonFont, color: mood.onAccent }]}>
            Применить стиль
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Fill/border colors are set inline per-mood (withAlpha(mood.accent, ...)
  // + mood.accent) — this base just fixes shape/size. Border thin (1.2px)
  // per "обводка чуть тоньше".
  iconRing: {
    width: ICON_BACKDROP,
    height: ICON_BACKDROP,
    borderRadius: ICON_BACKDROP / 2,
    borderWidth: 1.2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Cosmos back icon: no ring/fill at all — plain bare icon, matching
  // BackIcon's look on every other screen in the app.
  iconRingPlain: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  headerTitle: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  nextButton: {
    position: 'absolute',
    right: spacing.screenPadding,
    top: '50%',
    marginTop: -ICON_BACKDROP / 2,
    width: ICON_BACKDROP,
    height: ICON_BACKDROP,
    borderRadius: ICON_BACKDROP / 2,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Narrower than the standard screen margin on purpose — review feedback
    // 2026-08-08: "сделать контейнер чуть поуже, чтобы по бокам... больше
    // расстояния оставалось".
    paddingHorizontal: spacing.screenPadding + 12,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 15 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
    // 28 -> 36 and a tighter measure (maxWidth, not full container width) —
    // "подними ещё от кнопки... сожми чуть контейнер чтобы текст так не
    // растекался": a shorter line length reads as more deliberate/composed
    // than text stretched across the whole (already-narrowed) bottom block.
    marginBottom: 36,
    maxWidth: '82%',
    alignSelf: 'center',
  },
  // height 62->54 rolled out app-wide 2026-08-07; radius is now per-mood
  // (see MOOD.buttonRadius) instead of the fixed 16 every other screen uses.
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  buttonLabel: {
    fontSize: 20,
    lineHeight: 20 * 1.15,
  },
});
