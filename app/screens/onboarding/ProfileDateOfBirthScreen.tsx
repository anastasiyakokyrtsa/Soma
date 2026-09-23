import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ProfileStepLayout } from './ProfileStepLayout';
import { colors, fontFamily } from '../../theme';
import { formatBirthDate, type BirthDate } from '../../lib/biorhythm';
import { DateWheelPicker } from '../../components/DateWheelPicker';
import { profileStepTotal } from '../../lib/onboardingProfile';

// Audit finding #13 (platform-conformance): date pickers are one of the
// component types that must diverge by platform, not share one custom look
// - was a hand-drawn wheel identical on both OSes. Swapped for
// @react-native-community/datetimepicker (confirmed bundled in this Expo Go
// SDK, no native-module risk) instead of the old custom wheel.
//
// The two platforms don't just skin differently, they interact differently
// - not an oversight to "fix" into one shape:
//   iOS: `display="spinner"` renders inline, always visible, scrolls live -
//     matches the old wheel picker's own always-on-screen behavior almost
//     exactly.
//   Android: the native picker is a modal dialog, not an inline widget - it
//     has to be triggered from a field/button and conditionally rendered,
//     or it pops up unprompted on mount.
//
// minimumDate/maximumDate also give finding #17 (invalid birth date) a
// first, free layer for free - can't pick a future date or one over 120
// years back at all. Doesn't replace #17's other half (showing the date
// back near biorhythms on Home so a plausible-but-wrong date is still
// self-correctable) - that's separate, not done here.
//
// TEMPORARY OVERRIDE, 2026-09-19, her explicit ask: she's testing on
// Android but wants to look at the iOS wheel specifically right now
// ("верни колесо как у айфонов, даже если я на андроиде смотрю... пока
// сконцентрируемся на пользователях айфон") - a real native Android
// picker forced into "spinner" mode would render Android's OWN native
// wheel, not an iOS look-alike (UIDatePicker is Apple's own code, it
// physically can't render on Android hardware) - so getting an
// iOS-looking wheel on her Android phone means the hand-drawn
// DateWheelPicker.tsx (restored from before finding #13's fix, its own
// comment there already describes it as "iOS-style"), not the real
// native picker. Deliberately reverses finding #13 on purpose, for this
// phase only - flip back to `false` once real per-platform testing
// (not just an iOS-focused preview) is back in scope, don't leave this
// true by accident later.
const FORCE_IOS_WHEEL_PREVIEW = true;

const today = new Date();
const MIN_DATE = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

const dateToValue = (d: Date): BirthDate => ({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear() });
const valueToDate = (v: BirthDate): Date => new Date(v.year, v.month, v.day);

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
      totalSteps={profileStepTotal()}
      title="Когда ты родился?"
      description="Дата рождения нужна, чтобы рассчитать индивидуальные биоритмы и ритмы восстановления"
      onPressNext={() => navigation.navigate('BiorhythmInsight', { birth: date })}
      onPressBack={() => navigation.goBack()}
      onPressSkip={() => navigation.replace('Main')}
    >
      <View style={styles.pickerWrap}>
        {FORCE_IOS_WHEEL_PREVIEW ? (
          <DateWheelPicker value={date} onChange={setDate} />
        ) : Platform.OS === 'ios' ? (
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
              <Text style={styles.androidFieldText}>{formatBirthDate(date)}</Text>
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
