import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';
import { colors, fontFamily } from '../theme';
import { ChevronIcon } from './icons/ChevronIcon';

// WF19 "Укажи даты последнего менструального цикла" — no finished Figma
// frame, built from the wireframe (Вайрфреймы/19 WF Profile - Menstrual
// cycle.png): a month grid with leading/trailing days from adjacent months
// dimmed, and a tap-to-select date *range* (not a single date) - first tap
// sets the start, a second tap after it sets the end, connected by a light
// pill background that spans across week rows.

export type CalendarDate = { year: number; month: number; day: number }; // month is 0-indexed

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
// Monday-first weekday index (0=Mon..6=Sun) for the 1st of the month.
function firstWeekdayIndex(year: number, month: number) {
  const jsDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  return (jsDay + 6) % 7;
}
function cmp(a: CalendarDate, b: CalendarDate) {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}
function sameDate(a: CalendarDate, b: CalendarDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

type Cell = CalendarDate & { inCurrentMonth: boolean };

function buildGrid(year: number, month: number): Cell[][] {
  const total = daysInMonth(year, month);
  const lead = firstWeekdayIndex(year, month);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevTotal = daysInMonth(prevYear, prevMonth);

  const cells: Cell[] = [];
  for (let i = lead - 1; i >= 0; i--) {
    cells.push({ year: prevYear, month: prevMonth, day: prevTotal - i, inCurrentMonth: false });
  }
  for (let d = 1; d <= total; d++) {
    cells.push({ year, month, day: d, inCurrentMonth: true });
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ year: nextYear, month: nextMonth, day: nextDay++, inCurrentMonth: false });
  }

  const rows: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export function CalendarRangePicker({
  year,
  month,
  onMonthChange,
  rangeStart,
  rangeEnd,
  onRangeChange,
}: {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  rangeStart: CalendarDate | null;
  rangeEnd: CalendarDate | null;
  onRangeChange: (start: CalendarDate | null, end: CalendarDate | null) => void;
}) {
  const [cellWidth, setCellWidth] = useState(0);
  const rows = buildGrid(year, month);

  const onGridLayout = (e: LayoutChangeEvent) => {
    setCellWidth(e.nativeEvent.layout.width / 7);
  };

  const goPrev = () => onMonthChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  const goNext = () => onMonthChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

  const handlePress = (date: CalendarDate) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      onRangeChange(date, null);
    } else if (cmp(date, rangeStart) < 0) {
      onRangeChange(date, null);
    } else {
      onRangeChange(rangeStart, date);
    }
  };

  const inRange = (date: CalendarDate) =>
    !!rangeStart && !!rangeEnd && cmp(date, rangeStart) >= 0 && cmp(date, rangeEnd) <= 0;
  const isStart = (date: CalendarDate) => !!rangeStart && sameDate(date, rangeStart);
  const isEnd = (date: CalendarDate) => !!rangeEnd && sameDate(date, rangeEnd);

  return (
    <View>
      <View style={styles.header}>
        <Pressable style={styles.navButton} onPress={goPrev} hitSlop={8}>
          <ChevronIcon direction="left" size={16} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerLabel}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <Pressable style={styles.navButton} onPress={goNext} hitSlop={8}>
          <ChevronIcon direction="right" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={[styles.weekdayLabel, { width: cellWidth || undefined, flex: cellWidth ? undefined : 1 }]}>
            {w}
          </Text>
        ))}
      </View>

      <View onLayout={onGridLayout}>
        {rows.map((row, ri) => {
          const rangeCols = row
            .map((c, ci) => ({ ci, active: inRange(c) }))
            .filter((x) => x.active)
            .map((x) => x.ci);
          const pillLeft = rangeCols.length ? rangeCols[0] * cellWidth : 0;
          const pillWidth = rangeCols.length ? (rangeCols[rangeCols.length - 1] - rangeCols[0] + 1) * cellWidth : 0;
          const roundLeft = rangeCols.length ? row[rangeCols[0]] && isStart(row[rangeCols[0]]) : false;
          const roundRight = rangeCols.length ? row[rangeCols[rangeCols.length - 1]] && isEnd(row[rangeCols[rangeCols.length - 1]]) : false;

          return (
            <View key={ri} style={styles.weekRow}>
              {rangeCols.length > 0 && cellWidth > 0 ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.rangePill,
                    {
                      left: pillLeft,
                      width: pillWidth,
                      borderTopLeftRadius: roundLeft ? 22 : 0,
                      borderBottomLeftRadius: roundLeft ? 22 : 0,
                      borderTopRightRadius: roundRight ? 22 : 0,
                      borderBottomRightRadius: roundRight ? 22 : 0,
                    },
                  ]}
                />
              ) : null}
              {row.map((cell, ci) => {
                const start = isStart(cell);
                const end = isEnd(cell);
                const endpoint = start || end;
                return (
                  <Pressable
                    key={ci}
                    style={[styles.dayCell, { width: cellWidth || undefined, flex: cellWidth ? undefined : 1 }]}
                    onPress={() => handlePress(cell)}
                  >
                    <View style={[styles.dayCircle, endpoint && styles.dayCircleActive]}>
                      <Text
                        style={[
                          styles.dayText,
                          !cell.inCurrentMonth && styles.dayTextDim,
                          endpoint && styles.dayTextActive,
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  weekdayLabel: {
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.textTertiary,
  },
  weekRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  rangePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: 'rgba(139,124,246,0.16)',
  },
  dayCell: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.violet400,
  },
  dayText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  dayTextDim: {
    color: colors.textDisabled,
  },
  dayTextActive: {
    fontFamily: fontFamily.semiBold,
    color: colors.bg0,
  },
});
