import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStepLayout } from './ProfileStepLayout';
import { CalendarRangePicker, type CalendarDate } from '../../components/CalendarRangePicker';
import { OptionRow } from '../../components/OptionRow';
import { setOnboardingCycleRange, setOnboardingCycleNotApplicable } from '../../lib/onboardingProfile';
import { useT } from '../../i18n/useT';

const today = new Date();
// A period longer than this is almost certainly a mis-tap, not a real one -
// picking an end further out than this is blocked instead of accepted.
const MAX_PERIOD_DAYS = 10;

export function ProfileMenstrualCycleScreen({ navigation }: any) {
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState<CalendarDate | null>(null);
  const [rangeEnd, setRangeEnd] = useState<CalendarDate | null>(null);
  // Brief 001 / decisions.md 2026-11-21/22 #3 - a real third answer (not a
  // skip) for anyone who can't or doesn't want to give cycle dates right now
  // (pregnancy, menopause, hormonal medication, an irregular cycle - see the
  // 2026-09-23 decision this one replaces). Equal visual weight to the
  // calendar (same OptionRow used for Gender's own two choices), not a small
  // secondary link - picking it is just as valid an answer as picking dates.
  const [noCycle, setNoCycle] = useState(false);
  const t = useT();

  return (
    <ProfileStepLayout
      step={3}
      title={t('onboarding.cycleTitle')}
      // Explicit \n breaks live in the dictionary string itself (see
      // i18n/dictionaries/onboarding.ts) - tuned against a real phone for the
      // Russian text; the English translation's own line lengths differ, so
      // its breaks need a fresh on-device check, not an assumed carry-over.
      description={t('onboarding.cycleDescription')}
      buttonDisabled={!noCycle && (!rangeStart || !rangeEnd)}
      onPressNext={() => {
        if (noCycle) {
          setOnboardingCycleNotApplicable();
        } else if (rangeStart && rangeEnd) {
          setOnboardingCycleRange({ start: rangeStart, end: rangeEnd });
        }
        navigation.navigate('ProfileMood');
      }}
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
            // Picking a real date after having picked "no regular cycle"
            // switches back - the two answers are mutually exclusive, not
            // additive.
            setNoCycle(false);
            setRangeStart(start);
            setRangeEnd(end);
          }}
        />
        <View style={styles.noCycleWrap}>
          <OptionRow
            label={t('onboarding.noCycleOption')}
            selected={noCycle}
            onPress={() => {
              setRangeStart(null);
              setRangeEnd(null);
              setNoCycle(true);
            }}
          />
        </View>
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
  // 24 - same rhythm as the gap already used between this screen's own
  // description and calendar elsewhere in the profile mini-flow, not a new
  // number invented for this one row.
  noCycleWrap: {
    marginTop: 24,
  },
});
