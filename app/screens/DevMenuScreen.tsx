import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius, spacing } from '../theme';

// Dev-only screen picker — __DEV__-gated as RootNavigator's initial route
// (see navigation/RootNavigator.tsx), so this never ships in a real build.
// Exists so reviewing a specific screen doesn't require replaying the whole
// onboarding flow from Splash every time in Expo Go.
// `params` covers screens that live inside the "Main" tab navigator - a
// plain `navigate('Main')` always lands on whichever tab is default (Home),
// not a specific one (2026-09-06, her catch: "почему я не вижу Care и все
// экраны с чаями" - Care existed but was unreachable from here since it's a
// tab, not a top-level stack screen; TeaCeremony was a plain oversight, never
// added when the screen itself was).
const ROUTES: { label: string; screen: string; params?: object }[] = [
  { label: 'Splash', screen: 'Splash' },
  { label: 'AboutApp1', screen: 'AboutApp1' },
  { label: 'AboutApp2', screen: 'AboutApp2' },
  { label: 'AboutApp3', screen: 'AboutApp3' },
  { label: 'Name', screen: 'Name' },
  { label: 'Email', screen: 'Email' },
  { label: 'Gender', screen: 'Gender' },
  { label: 'Support', screen: 'Support' },
  { label: 'ChooseApproach', screen: 'ChooseApproach' },
  { label: 'VisualStyle', screen: 'VisualStyle' },
  { label: 'StylePreview', screen: 'StylePreview' },
  { label: 'Personalization', screen: 'Personalization' },
  { label: 'ProfileStart', screen: 'ProfileStart' },
  { label: 'ProfileDateOfBirth', screen: 'ProfileDateOfBirth' },
  { label: 'ProfileSleepSchedule', screen: 'ProfileSleepSchedule' },
  { label: 'ProfileMenstrualCycle', screen: 'ProfileMenstrualCycle' },
  { label: 'ProfileMood', screen: 'ProfileMood' },
  { label: 'Main → Home', screen: 'Main', params: { screen: 'Home' } },
  { label: 'Main → Care', screen: 'Main', params: { screen: 'Care' } },
  { label: 'Main → Journal', screen: 'Main', params: { screen: 'Journal' } },
  { label: 'Main → Analytics', screen: 'Main', params: { screen: 'Analytics' } },
  { label: 'BreathingInfo', screen: 'BreathingInfo' },
  { label: 'BreathingSession', screen: 'BreathingSession' },
  { label: 'BreathingComplete', screen: 'BreathingComplete' },
  { label: 'TeaCategories', screen: 'TeaCategories' },
  { label: 'TeaCeremony', screen: 'TeaCeremony' },
  { label: 'Biorhythms', screen: 'Biorhythms' },
];

export function DevMenuScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.heading}>Dev menu — jump to screen</Text>
      {ROUTES.map((route) => (
        <Pressable
          key={route.label}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => navigation.navigate(route.screen, route.params)}
        >
          <Text style={styles.rowLabel}>{route.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    gap: 10,
  },
  heading: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  row: {
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  rowPressed: {
    borderColor: colors.violet400,
    backgroundColor: 'rgba(139,124,246,0.12)',
  },
  rowLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
