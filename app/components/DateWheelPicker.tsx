import { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { colors, fontFamily } from '../theme';
import { useLanguage, type Language } from '../i18n/LanguageContext';

// iOS-style scrolling wheel picker (WF17 "Дата рождения" — 3 columns: day /
// month / year). No native picker component gives this exact "fading rows
// either side of a highlighted center" look, so it's built from a plain
// Reanimated-driven ScrollView per column: `scrollEventThrottle`-driven
// shared scroll offset feeds each row's own opacity/scale via
// `useAnimatedStyle`. This is ordinary RN-view animation (Reanimated's core
// use case, used everywhere else in this app - Splash, OnboardingSlide
// fades, the floating text-field label) - not Skia, so the shared-value
// bridge gap documented in memory/project_skia_reanimated_bridge.md doesn't
// apply here.
const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 5;
export const WHEEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const SIDE_PADDING = ROW_HEIGHT * ((VISIBLE_ROWS - 1) / 2);

function Row({ label, index, scrollY }: { label: string; index: number; scrollY: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const dist = Math.abs(scrollY.value / ROW_HEIGHT - index);
    const opacity = interpolate(dist, [0, 1, 2], [1, 0.4, 0.16], Extrapolation.CLAMP);
    const scale = interpolate(dist, [0, 1, 2], [1, 0.82, 0.72], Extrapolation.CLAMP);
    return { opacity, transform: [{ scale }] };
  });
  return (
    <Animated.View style={[styles.row, style]}>
      <Text style={styles.rowText} numberOfLines={1}>
        {label}
      </Text>
    </Animated.View>
  );
}

function WheelColumn({
  data,
  index,
  onIndexChange,
  width,
  align = 'center',
}: {
  data: string[];
  index: number;
  onIndexChange: (i: number) => void;
  width: number;
  align?: 'flex-start' | 'center' | 'flex-end';
}) {
  const scrollY = useSharedValue(index * ROW_HEIGHT);

  const commitFromOffset = useCallback(
    (offsetY: number) => {
      const i = Math.max(0, Math.min(data.length - 1, Math.round(offsetY / ROW_HEIGHT)));
      onIndexChange(i);
    },
    [data.length, onIndexChange]
  );

  // Her catch (2026-11-23): picking a different birth date never changed
  // the onboarding insight that follows it - traced to this wheel's commit
  // path (`onIndexChange`, feeding `ProfileDateOfBirthScreen`'s `date`
  // state) only ever firing from `onMomentumScrollEnd`/`onScrollEndDrag`'s
  // velocity heuristic. Both are genuinely unreliable on web - a mouse
  // drag or a trackpad/wheel scroll doesn't generate the same native
  // momentum-deceleration event sequence a real touch swipe does, so the
  // visible wheel could settle on a new row while the actual committed
  // value silently stayed at its initial default (confirmed: several
  // different automated scroll methods all moved the wheel visually but
  // never fired a commit). Fix: a plain debounce on every `onScroll` frame
  // - commits whatever row is nearest 150ms after scrolling actually
  // stops, regardless of which input method caused it to stop. Kept the
  // two original handlers too (harmless - they just re-commit the same
  // already-correct index a little earlier when they do fire).
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleCommit = useCallback(
    (offsetY: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => commitFromOffset(offsetY), 150);
    },
    [commitFromOffset]
  );

  const handler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      runOnJS(scheduleCommit)(e.contentOffset.y);
    },
  });

  const snap = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      commitFromOffset(e.nativeEvent.contentOffset.y);
    },
    [commitFromOffset]
  );

  return (
    <Animated.ScrollView
      style={{ width, height: WHEEL_HEIGHT }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ROW_HEIGHT}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: SIDE_PADDING }}
      onScroll={handler}
      scrollEventThrottle={16}
      onMomentumScrollEnd={snap}
      onScrollEndDrag={(e) => {
        // if the drag ends without enough momentum to trigger
        // onMomentumScrollEnd, still snap from wherever it settles
        if (Math.abs(e.nativeEvent.velocity?.y ?? 0) < 0.05) snap(e);
      }}
      contentOffset={{ x: 0, y: index * ROW_HEIGHT }}
    >
      {data.map((label, i) => (
        <View key={i} style={{ alignItems: align }}>
          <Row label={label} index={i} scrollY={scrollY} />
        </View>
      ))}
    </Animated.ScrollView>
  );
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
// Находка (2026-11-23, её же ask): month names were the one spot in this
// whole app's otherwise-complete 2026-11-21 i18n pass that stayed
// Russian-only (CalendarRangePicker had the same gap, see its own MONTHS
// below). RU stays genitive ("14 ... мая ... 1995" reads as a normal
// Russian date); EN just uses the plain month name - no genitive case to
// match in English, "14 May 1995" is already natural.
const MONTHS: Record<Language, string[]> = {
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const YEAR_LIST = Array.from({ length: 2015 - 1940 + 1 }, (_, i) => String(1940 + i));

export type DateValue = { day: number; month: number; year: number };

export function DateWheelPicker({
  value,
  onChange,
}: {
  value: DateValue;
  // Her catch (2026-11-23): picking a different birth date never changed
  // the onboarding insight that followed it. Root cause (confirmed with a
  // temporary console.log, not guessed): each column's `onIndexChange`
  // below merged its one changed field into a `value` snapshot captured by
  // closure at render time - `{ ...value, day: i + 1 }` and `{ ...value,
  // month: i }` etc. If she scrolled two columns close together (exactly
  // how anyone actually uses a 3-wheel date picker - set month, then year,
  // before either edit has re-rendered this component with fresh props),
  // both closures captured the SAME stale `value`, so the second `onChange`
  // call's spread silently clobbered the first column's edit with its own
  // stale copy of that field. Logged proof: scrolling month to January
  // then year to 2000 committed month=0 correctly in isolation, but the
  // date actually submitted was `{day:14, month:5 (untouched original),
  // year:2000}` - the month edit was overwritten by year's stale spread.
  // Fix: `onChange` now takes an updater function (`(prev) => next`, same
  // shape React's own `setState` accepts) instead of a finished object, so
  // the caller can pass its state setter directly (see
  // ProfileDateOfBirthScreen's `onChange={setDate}`) and every edit merges
  // from the *latest* state, however many fire in the same tick - not a
  // snapshot frozen at this component's last render.
  onChange: (updater: (prev: DateValue) => DateValue) => void;
}) {
  const { language } = useLanguage();
  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={styles.hairlineTop} />
      <View pointerEvents="none" style={styles.hairlineBottom} />
      <WheelColumn
        data={DAYS}
        index={value.day - 1}
        onIndexChange={(i) => onChange((prev) => ({ ...prev, day: i + 1 }))}
        width={64}
        align="flex-end"
      />
      <WheelColumn
        data={MONTHS[language]}
        index={value.month}
        onIndexChange={(i) => onChange((prev) => ({ ...prev, month: i }))}
        width={140}
      />
      <WheelColumn
        data={YEAR_LIST}
        index={value.year - 1940}
        onIndexChange={(i) => onChange((prev) => ({ ...prev, year: 1940 + i }))}
        width={80}
        align="flex-start"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    height: WHEEL_HEIGHT,
  },
  hairlineTop: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: (WHEEL_HEIGHT - ROW_HEIGHT) / 2,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
  },
  hairlineBottom: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: (WHEEL_HEIGHT + ROW_HEIGHT) / 2,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
  },
  row: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  rowText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 24,
    color: colors.textPrimary,
  },
});
