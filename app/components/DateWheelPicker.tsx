import { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
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
  const handler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const snap = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.max(0, Math.min(data.length - 1, Math.round(e.nativeEvent.contentOffset.y / ROW_HEIGHT)));
      onIndexChange(i);
    },
    [data.length, onIndexChange]
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
  onChange: (v: DateValue) => void;
}) {
  const { language } = useLanguage();
  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={styles.hairlineTop} />
      <View pointerEvents="none" style={styles.hairlineBottom} />
      <WheelColumn
        data={DAYS}
        index={value.day - 1}
        onIndexChange={(i) => onChange({ ...value, day: i + 1 })}
        width={64}
        align="flex-end"
      />
      <WheelColumn
        data={MONTHS[language]}
        index={value.month}
        onIndexChange={(i) => onChange({ ...value, month: i })}
        width={140}
      />
      <WheelColumn
        data={YEAR_LIST}
        index={value.year - 1940}
        onIndexChange={(i) => onChange({ ...value, year: 1940 + i })}
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
