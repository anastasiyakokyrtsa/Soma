import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { DateWheelPicker, type DateValue } from '../../components/DateWheelPicker';

export function ProfileDateOfBirthScreen({ navigation }: any) {
  const [date, setDate] = useState<DateValue>({ day: 14, month: 5, year: 1995 });

  return (
    <ProfileStepLayout
      step={1}
      title="Когда ты родился?"
      description="Дата рождения нужна, чтобы рассчитать индивидуальные биоритмы и ритмы восстановления"
      onPressNext={() => navigation.navigate('ProfileSleepSchedule')}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.pickerWrap}>
        <DateWheelPicker value={date} onChange={setDate} />
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  // Not flex:1/centered - that vertically centers the picker in the whole
  // remaining screen height instead of sitting a fixed gap below the header
  // text (2026-08-16 review). 24px is what she wants from the description
  // text down to the actual "12" digit, not to the row's own box edge - a
  // row is 44px tall but its text line box is only 24px (DateWheelPicker's
  // rowText lineHeight), centered inside, which already eats ~10px above
  // the glyph ((44-24)/2). 24 - 10 = 14 here so the *visible number* lands
  // 24px down, not the invisible row padding.
  pickerWrap: {
    marginTop: 14,
  },
});
