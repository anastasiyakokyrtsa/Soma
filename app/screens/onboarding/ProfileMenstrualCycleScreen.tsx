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
  wrap: {
    marginTop: 20,
  },
});
