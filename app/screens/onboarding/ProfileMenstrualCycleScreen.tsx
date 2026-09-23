import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { CalendarRangePicker, type CalendarDate } from '../../components/CalendarRangePicker';

const today = new Date();
// A period longer than this is almost certainly a mis-tap, not a real one -
// picking an end further out than this is blocked instead of accepted.
const MAX_PERIOD_DAYS = 10;

export function ProfileMenstrualCycleScreen({ navigation }: any) {
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState<CalendarDate | null>(null);
  const [rangeEnd, setRangeEnd] = useState<CalendarDate | null>(null);

  return (
    <ProfileStepLayout
      step={3}
      title="Укажи даты последнего менструального цикла"
      // Explicit breaks: RN has no balanced text-wrap and the greedy wrap left a
      // short last line. Lines are measured against a real phone (~38 chars fit
      // at the standard width, so each line here stays under ~34) - a first
      // 3-line attempt at 39 chars per line overflowed and made it worse
      // (2026-09-23). Breaks fall on clause boundaries; a much narrower
      // phone may still re-wrap, so recheck if a short line turns up.
      description={'Так мы сможем примерно\nпонять, на каком ты этапе\nцикла, и лучше отслеживать,\nкак меняются настроение и энергия'}
      buttonDisabled={!rangeStart || !rangeEnd}
      onPressNext={() => navigation.navigate('ProfileMood')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.wrap}>
        <CalendarRangePicker
          year={year}
          month={month}
          onMonthChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
          maxDate={{ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }}
          maxRangeDays={MAX_PERIOD_DAYS}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onRangeChange={(start, end) => {
            setRangeStart(start);
            setRangeEnd(end);
          }}
        />
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  // 14, matching ProfileDateOfBirthScreen's pickerWrap - both the calendar's
  // month header and the date wheel's row box show real visible content
  // flush with their own top edge (unlike the sleep dial, which has its own
  // ~25px blank SVG margin baked in), so the same 16(content)+14 = 30px
  // total lands the same visual gap here too (was 20, giving 36 - a bit more
  // than the other screens; 2026-08-17: "так же как на предыдущих экранах?").
  wrap: {
    marginTop: 14,
  },
});
