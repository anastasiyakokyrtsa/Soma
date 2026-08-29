import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius, glow } from '../theme';
import { BackIcon } from '../components/icons/BackIcon';
import { CheckmarkIcon } from '../components/icons/CheckmarkIcon';
import { StarsBackground } from '../components/StarsBackground';

// WF 28 "Breathing session - End". Circle glow reuses ResourceRing's own
// 4-layer halo boxShadow recipe (borderRadius = size/2 so the shadow
// follows the true circle, not a boxy silhouette - established rule this
// whole session) rather than inventing a new glow.
//
// "К другим дыхательным практикам" - active now, her follow-up ask
// 2026-08-28 ("сделай кнопку активной, как обычно мы кнопки делаем...
// пусть ведет обратно на Care экран пока"). Was shipped disabled the round
// before (no practice-list screen exists yet for it to really lead to) -
// now navigates back to the Care tab specifically as a placeholder
// destination, not just `goBack()` (which would land on the Session
// screen mid-flow, wrong) and not a plain `navigate('Main')` (would land
// on whatever tab was last active, not necessarily Care).
export function BreathingCompleteScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={styles.center}>
        <View style={styles.circle}>
          <View style={styles.halo} />
          <CheckmarkIcon size={64} color={colors.violet400} />
        </View>
        <Text style={styles.title}>Поздравляем!{'\n'}Ты выполнил практику</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, { marginBottom: insets.bottom + 40 }, pressed && styles.ctaPressed]}
        onPress={() => navigation.navigate('Main', { screen: 'Care' })}
      >
        <Text style={styles.ctaLabel}>К другим дыхательным практикам</Text>
      </Pressable>
    </View>
  );
}

const CIRCLE_SIZE = 220;

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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(139,124,246,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    boxShadow:
      '0px 0px 50px 12px rgba(139,124,246,0.16), 0px 0px 90px 26px rgba(255,198,241,0.07), inset 0px 0px 60px 22px rgba(139,124,246,0.18), inset 0px 0px 32px 8px rgba(255,198,241,0.12)',
  },
  title: {
    marginTop: 32,
    fontFamily: fontFamily.semiBold,
    fontSize: 22,
    lineHeight: 22 * 1.3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  // Standard active primary CTA, same recipe used everywhere else in this
  // app (BreathingInfoScreen's own "Я готов", CareScreen's tea-ceremony
  // button, etc.) - violet400 fill + glow.btn, pressed state per the
  // standing rule (feedback_rn_app_ui_defaults).
  cta: {
    marginHorizontal: 16,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  ctaPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  ctaLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.bg0,
  },
});
