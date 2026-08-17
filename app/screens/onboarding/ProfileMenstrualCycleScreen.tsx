import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { CalendarRangePicker, type CalendarDate } from '../../components/CalendarRangePicker';

const today = new Date();

export function ProfileMenstrualCycleScreen({ navigation }: any) {
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState<CalendarDate | null>(null);
  const [rangeEnd, setRangeEnd] = useState<CalendarDate | null>(null);

  return (
    <ProfileStepLayout
      step={3}
      title="Укажи даты последнего менструального цикла"
      description="Так мы сможем отслеживать твои естественные гормональные фазы и сопоставлять их с изменениями в настроении и энергии"
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
