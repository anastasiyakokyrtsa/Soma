import { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors, fontFamily, glow, radius } from '../theme';
import { BackIcon } from './icons/BackIcon';
import { GradientIcon } from './icons/GradientIcon';
import { SleepWheelPicker } from './SleepWheelPicker';
import { CalendarRangePicker, type CalendarDate } from './CalendarRangePicker';
import { useT } from '../i18n/useT';
import { getOnboardingSleep, setOnboardingSleep, setOnboardingCycleRange } from '../lib/onboardingProfile';

// Brief 002 (FAB quick-log) - BottomBar's "+" opens this instead of doing
// nothing. Same Modal/scrim/slide-up/swipe-to-dismiss shell as InfoSheet.tsx
// (see that file's own comment for the gesture-handler history this copies -
// Modal renders on its own native surface, so the gesture needs its own
// GestureHandlerRootView, App.tsx's doesn't reach in here either), kept as a
// separate component rather than generalizing InfoSheet itself: this sheet
// has real interactive content and a Save action, InfoSheet is deliberately
// static reference text with no action to take.
//
// Three "screens" in one sheet, not three separate modals - `initialScreen`
// is the one real branch decisions.md 2026-11-21/22 #1 asks for:
//   - no relevant cycle (male/unset gender, or "у меня сейчас нет
//     регулярного цикла" already answered) -> straight into the sleep form.
//   - relevant cycle -> the 2-tile menu first, which then drops into
//     whichever form was tapped.
// A `back` arrow only appears once `screen` has moved off `initialScreen`
// *and* the entry point was the menu - the sleep-only path never had a menu
// to go back to.
const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 800;

type Screen = 'menu' | 'sleep' | 'cycle';

function todayDate(): CalendarDate {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

// Same fallback as ProfileSleepScheduleScreen's own first-time default (8h30,
// bed at the dial's "12") - a profile that reaches the FAB without ever
// having set a sleep schedule still needs *something* on the dial.
const DEFAULT_BEDTIME_MIN = 0;
const DEFAULT_WAKETIME_MIN = 510;

export function QuickLogSheet({
  visible,
  onClose,
  initialScreen,
}: {
  visible: boolean;
  onClose: () => void;
  initialScreen: 'menu' | 'sleep';
}) {
  const insets = useSafeAreaInsets();
  const t = useT();
  const translateY = useSharedValue(0);

  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [bedtimeMin, setBedtimeMin] = useState(DEFAULT_BEDTIME_MIN);
  const [waketimeMin, setWaketimeMin] = useState(DEFAULT_WAKETIME_MIN);
  const today = todayDate();
  const [cycleYear, setCycleYear] = useState(today.year);
  const [cycleMonth, setCycleMonth] = useState(today.month);
  // Pre-filled to today/today (not null/null) - the menu tile's own promise
  // is "начался цикл сегодня", a one-tap confirmation, not a blank calendar
  // to fill in from scratch. Still a real CalendarRangePicker underneath, so
  // picking a different day (the period actually started earlier) is just as
  // available as accepting the default.
  const [cycleStart, setCycleStart] = useState<CalendarDate>(today);
  const [cycleEnd, setCycleEnd] = useState<CalendarDate | null>(today);

  // Resets every field to a fresh default each time the sheet opens (not
  // just once on first mount) - this component stays mounted across opens
  // (owned by BottomBar), so a previous session's half-finished edits can't
  // leak into the next time the FAB is pressed.
  useEffect(() => {
    if (!visible) return;
    setScreen(initialScreen);
    const storedSleep = getOnboardingSleep();
    setBedtimeMin(storedSleep?.bedtimeMin ?? DEFAULT_BEDTIME_MIN);
    setWaketimeMin(storedSleep?.waketimeMin ?? DEFAULT_WAKETIME_MIN);
    const now = todayDate();
    setCycleYear(now.year);
    setCycleMonth(now.month);
    setCycleStart(now);
    setCycleEnd(now);
  }, [visible, initialScreen]);

  useEffect(() => {
    if (visible) {
      translateY.value = 400;
      translateY.value = withTiming(0, { duration: 220 });
    }
  }, [visible, translateY]);

  const close = () => onClose();

  const pan = Gesture.Pan()
    .onChange((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        translateY.value = withTiming(700, { duration: 180 }, () => runOnJS(close)());
      } else {
        translateY.value = withSpring(0, { damping: 18 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const saveSleep = () => {
    setOnboardingSleep({ bedtimeMin, waketimeMin });
    onClose();
  };

  const saveCycle = () => {
    if (!cycleEnd) return;
    setOnboardingCycleRange({ start: cycleStart, end: cycleEnd });
    onClose();
  };

  const showBack = screen !== 'menu' && initialScreen === 'menu';
  const title =
    screen === 'menu' ? t('quickLog.menuTitle') : screen === 'sleep' ? t('quickLog.sleepFormTitle') : t('quickLog.cycleFormTitle');
  const description = screen === 'sleep' ? t('quickLog.sleepFormDescription') : screen === 'cycle' ? t('quickLog.cycleFormDescription') : null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={styles.root}>
        <Pressable style={styles.scrimTap} onPress={onClose} accessibilityRole="button" accessibilityLabel={t('common.close')} />
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }, sheetStyle]}>
            <View style={styles.handle} />

            <View style={styles.header}>
              {showBack ? (
                <Pressable onPress={() => setScreen('menu')} hitSlop={10} style={styles.backButton}>
                  <BackIcon size={18} />
                </Pressable>
              ) : (
                <View style={styles.backButton} />
              )}
              <Text style={styles.title}>{title}</Text>
              <View style={styles.backButton} />
            </View>
            {description ? <Text style={styles.description}>{description}</Text> : null}

            {screen === 'menu' ? (
              <View style={styles.menuRow}>
                <Pressable
                  style={({ pressed }) => [styles.menuTile, pressed && styles.menuTilePressed]}
                  onPress={() => setScreen('sleep')}
                >
                  <GradientIcon name="sleep" size={40} />
                  <Text style={styles.menuTileLabel}>{t('quickLog.sleepTileLabel')}</Text>
                  <Text style={styles.menuTileHint}>{t('quickLog.sleepTileHint')}</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.menuTile, pressed && styles.menuTilePressed]}
                  onPress={() => setScreen('cycle')}
                >
                  <GradientIcon name="moonSymbol" size={40} />
                  <Text style={styles.menuTileLabel}>{t('quickLog.cycleTileLabel')}</Text>
                  <Text style={styles.menuTileHint}>{t('quickLog.cycleTileHint')}</Text>
                </Pressable>
              </View>
            ) : null}

            {screen === 'sleep' ? (
              <>
                <View style={styles.sleepPickerWrap}>
                  <SleepWheelPicker
                    bedtimeMin={bedtimeMin}
                    waketimeMin={waketimeMin}
                    size={260}
                    onChange={(b, w) => {
                      setBedtimeMin(b);
                      setWaketimeMin(w);
                    }}
                  />
                </View>
                <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]} onPress={saveSleep}>
                  <Text style={styles.saveButtonLabel}>{t('common.save')}</Text>
                </Pressable>
              </>
            ) : null}

            {screen === 'cycle' ? (
              <>
                <View style={styles.calendarWrap}>
                  <CalendarRangePicker
                    year={cycleYear}
                    month={cycleMonth}
                    onMonthChange={(y, m) => {
                      setCycleYear(y);
                      setCycleMonth(m);
                    }}
                    maxDate={today}
                    maxRangeDays={10}
                    rangeStart={cycleStart}
                    rangeEnd={cycleEnd}
                    onRangeChange={(start, end) => {
                      // A fresh tap after today/today was already filled in
                      // starts a new range the same way the onboarding step
                      // does - setRangeChange's own first-tap/second-tap
                      // logic already handles that, this just accepts
                      // whatever it decides (including a null start, which
                      // the Save button's own `cycleEnd` guard below covers).
                      setCycleStart(start ?? today);
                      setCycleEnd(end);
                    }}
                  />
                </View>
                <Pressable
                  style={({ pressed }) => [styles.saveButton, !cycleEnd && styles.saveButtonDisabled, pressed && !!cycleEnd && styles.saveButtonPressed]}
                  disabled={!cycleEnd}
                  onPress={saveCycle}
                >
                  <Text style={[styles.saveButtonLabel, !cycleEnd && styles.saveButtonLabelDisabled]}>{t('common.save')}</Text>
                </Pressable>
              </>
            ) : null}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrimTap: {
    flex: 1,
    backgroundColor: 'rgba(3,4,10,0.55)',
  },
  sheet: {
    backgroundColor: colors.cardFillFallback,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.borderDefault,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 22 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    marginTop: 12,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 15 * 1.4,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuRow: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  menuTile: {
    flex: 1,
    height: 140,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  menuTilePressed: {
    borderColor: colors.borderVioletFlat,
    backgroundColor: 'rgba(139,124,246,0.12)',
    transform: [{ scale: 0.98 }],
  },
  menuTileLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  menuTileHint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sleepPickerWrap: {
    marginTop: 12,
    alignSelf: 'center',
  },
  calendarWrap: {
    marginTop: 20,
  },
  saveButton: {
    marginTop: 24,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}`,
  },
  saveButtonPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  saveButtonDisabled: {
    backgroundColor: colors.textDisabled,
    boxShadow: 'none',
  },
  saveButtonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.bg0,
  },
  saveButtonLabelDisabled: {
    color: colors.textTertiary,
  },
});
