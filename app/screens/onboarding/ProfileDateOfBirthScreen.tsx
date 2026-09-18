import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ProfileStepLayout } from './ProfileStepLayout';
import { colors, fontFamily } from '../../theme';
import type { BirthDate } from '../../lib/biorhythm';

// Audit finding #13 (platform-conformance): date pickers are one of the
// component types that must diverge by platform, not share one custom look
// - was a hand-drawn wheel identical on both OSes. Swapped for
// @react-native-community/datetimepicker (confirmed bundled in this Expo Go
// SDK, no native-module risk) rather than DateWheelPicker.tsx, which is now
// unused everywhere and can be deleted.
//
// The two platforms don't just skin differently, they interact differently
// - not an oversight to "fix" into one shape:
//   iOS: `display="spinner"` renders inline, always visible, scrolls live -
//     matches the old wheel picker's own always-on-screen behavior almost
//     exactly, so this is the platform 2026-09-18 was actually building for.
//   Android: the native picker is a modal dialog, not an inline widget - it
//     has to be triggered from a field/button and conditionally rendered,
//     or it pops up unprompted on mount. Built for completeness (this repo
//     targets both platforms) but not the one being tested against today.
//
// minimumDate/maximumDate also give finding #17 (invalid birth date) a
// first, free layer for free - can't pick a future date or one over 120
// years back at all. Doesn't replace #17's other half (showing the date
// back near biorhythms on Home so a plausible-but-wrong date is still
// self-correctable) - that's separate, not done here.
const today = new Date();
const MIN_DATE = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const dateToValue = (d: Date): BirthDate => ({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear() });
const valueToDate = (v: BirthDate): Date => new Date(v.year, v.month, v.day);
const formatRuDate = (v: BirthDate) => `${v.day} ${MONTHS_GENITIVE[v.month]} ${v.year}`;

export function ProfileDateOfBirthScreen({ navigation }: any) {
  const [date, setDate] = useState<BirthDate>({ day: 14, month: 5, year: 1995 });
  const [androidPickerOpen, setAndroidPickerOpen] = useState(false);

  const onChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setAndroidPickerOpen(false);
    if (selected) setDate(dateToValue(selected));
  };

  return (
    <ProfileStepLayout
      step={1}
      title="Когда ты родился?"
      description="Дата рождения нужна, чтобы рассчитать индивидуальные биоритмы и ритмы восстановления"
      onPressNext={() => navigation.navigate('BiorhythmInsight', { birth: date })}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.pickerWrap}>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={valueToDate(date)}
            mode="date"
            display="spinner"
            onChange={onChange}
            maximumDate={today}
            minimumDate={MIN_DATE}
            themeVariant="dark"
            style={styles.iosPicker}
          />
        ) : (
          <>
            <Pressable style={styles.androidField} onPress={() => setAndroidPickerOpen(true)}>
              <Text style={styles.androidFieldText}>{formatRuDate(date)}</Text>
            </Pressable>
            {androidPickerOpen ? (
              <DateTimePicker value={valueToDate(date)} mode="date" display="default" onChange={onChange} maximumDate={today} minimumDate={MIN_DATE} />
            ) : null}
          </>
        )}
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
  iosPicker: {
    alignSelf: 'center',
  },
  androidField: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  androidFieldText: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.textPrimary,
  },
});
