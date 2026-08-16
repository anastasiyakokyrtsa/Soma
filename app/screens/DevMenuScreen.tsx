import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius, spacing } from '../theme';

// Dev-only screen picker — __DEV__-gated as RootNavigator's initial route
// (see navigation/RootNavigator.tsx), so this never ships in a real build.
// Exists so reviewing a specific screen doesn't require replaying the whole
// onboarding flow from Splash every time in Expo Go.
const ROUTES = [
  'Splash',
  'AboutApp1',
  'AboutApp2',
  'AboutApp3',
  'Name',
  'Email',
  'Gender',
  'Support',
  'ChooseApproach',
  'VisualStyle',
  'StylePreview',
  'Personalization',
  'ProfileStart',
  'ProfileDateOfBirth',
  'ProfileSleepSchedule',
  'ProfileMenstrualCycle',
  'ProfileMood',
  'Main',
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
          key={route}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => navigation.navigate(route)}
        >
          <Text style={styles.rowLabel}>{route}</Text>
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
