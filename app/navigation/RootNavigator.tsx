import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '../screens/SplashScreen';
import { AboutApp1Screen } from '../screens/onboarding/AboutApp1Screen';
import { AboutApp2Screen } from '../screens/onboarding/AboutApp2Screen';
import { AboutApp3Screen } from '../screens/onboarding/AboutApp3Screen';
import { NameScreen } from '../screens/onboarding/NameScreen';
import { EmailScreen } from '../screens/onboarding/EmailScreen';
import { GenderScreen } from '../screens/onboarding/GenderScreen';
import { SupportScreen } from '../screens/onboarding/SupportScreen';
import { ChooseApproachScreen } from '../screens/onboarding/ChooseApproachScreen';
import { VisualStyleScreen } from '../screens/onboarding/VisualStyleScreen';
import { StylePreviewScreen } from '../screens/onboarding/StylePreviewScreen';
import { PersonalizationScreen } from '../screens/onboarding/PersonalizationScreen';
import { ProfileStartScreen } from '../screens/onboarding/ProfileStartScreen';
import { ProfileDateOfBirthScreen } from '../screens/onboarding/ProfileDateOfBirthScreen';
import { BiorhythmInsightScreen } from '../screens/onboarding/BiorhythmInsightScreen';
import { ProfileSleepScheduleScreen } from '../screens/onboarding/ProfileSleepScheduleScreen';
import { ProfileMenstrualCycleScreen } from '../screens/onboarding/ProfileMenstrualCycleScreen';
import { ProfileMoodScreen } from '../screens/onboarding/ProfileMoodScreen';
import { DevMenuScreen } from '../screens/DevMenuScreen';
import { BreathingInfoScreen } from '../screens/BreathingInfoScreen';
import { BreathingSessionScreen } from '../screens/BreathingSessionScreen';
import { BreathingCompleteScreen } from '../screens/BreathingCompleteScreen';
import { TeaCategoriesScreen } from '../screens/TeaCategoriesScreen';
import { TeaCeremonyScreen } from '../screens/TeaCeremonyScreen';
import { TeaIntuitiveChoiceScreen } from '../screens/TeaIntuitiveChoiceScreen';
import { BiorhythmsScreen } from '../screens/BiorhythmsScreen';
import { ArticleWaterScreen } from '../screens/ArticleWaterScreen';
import { ArticleLightScreen } from '../screens/ArticleLightScreen';
import { ArticlePausesScreen } from '../screens/ArticlePausesScreen';
import { MeditationListScreen } from '../screens/MeditationListScreen';
import { MeditationInfoScreen } from '../screens/MeditationInfoScreen';
import { MeditationSessionScreen } from '../screens/MeditationSessionScreen';
import { MeditationCompleteScreen } from '../screens/MeditationCompleteScreen';
import { StoriesListScreen } from '../screens/StoriesListScreen';
import { StoryReaderScreen } from '../screens/StoryReaderScreen';

// Single stack for the whole app: splash -> onboarding -> "Main" (the tab
// navigator). Splash auto-advances (see SplashScreen.tsx); AboutApp3 calls
// navigation.replace('Main') so onboarding isn't left in the back-stack once
// the user is past it.
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg0,
    card: colors.bg0,
    primary: colors.violet400,
    text: colors.textPrimary,
    border: colors.borderSoft,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      {/* animation: 'none' — each screen fades its own content in via Reanimated
          (see OnboardingSlide.tsx/SplashScreen.tsx), so the native transition
          would just double up on top of that, not fully controllable on
          Android anyway (animationDuration is iOS-only). */}
      <Stack.Navigator
        // __DEV__-only: start on a screen picker instead of Splash so
        // reviewing one specific screen in Expo Go doesn't mean replaying
        // the whole onboarding flow every time. Never true in a real build.
        initialRouteName={__DEV__ ? 'DevMenu' : 'Splash'}
        screenOptions={{ headerShown: false, animation: 'none' }}
      >
        {__DEV__ ? <Stack.Screen name="DevMenu" component={DevMenuScreen} /> : null}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AboutApp1" component={AboutApp1Screen} />
        <Stack.Screen name="AboutApp2" component={AboutApp2Screen} />
        <Stack.Screen name="AboutApp3" component={AboutApp3Screen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="ChooseApproach" component={ChooseApproachScreen} />
        <Stack.Screen name="VisualStyle" component={VisualStyleScreen} />
        <Stack.Screen name="StylePreview" component={StylePreviewScreen} />
        <Stack.Screen name="Personalization" component={PersonalizationScreen} />
        <Stack.Screen name="ProfileStart" component={ProfileStartScreen} />
        <Stack.Screen name="ProfileDateOfBirth" component={ProfileDateOfBirthScreen} />
        {/* Inserted 2026-09-15 (audit finding #7, habit-designer's early-value
            recommendation) - real content computed from the date just entered,
            not a placeholder. See BiorhythmInsightScreen.tsx. */}
        <Stack.Screen name="BiorhythmInsight" component={BiorhythmInsightScreen} />
        <Stack.Screen name="ProfileSleepSchedule" component={ProfileSleepScheduleScreen} />
        <Stack.Screen name="ProfileMenstrualCycle" component={ProfileMenstrualCycleScreen} />
        <Stack.Screen name="ProfileMood" component={ProfileMoodScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        {/* Pushed from Care's "Дыхание" Mini Ritual Tile, not part of the
            tab flow - see CareScreen.tsx and each screen's own comment for
            the full WF25-28 breathing-session flow. */}
        <Stack.Screen name="BreathingInfo" component={BreathingInfoScreen} />
        <Stack.Screen name="BreathingSession" component={BreathingSessionScreen} />
        <Stack.Screen name="BreathingComplete" component={BreathingCompleteScreen} />
        {/* Pushed from Care's "Начать чайную церемонию" button - WF29. All 5
            cards are real destinations behind FEATURE_TEA_FULL_CATEGORIES
            (TeaCategoriesScreen.tsx); flag off keeps only the first category
            ("Успокоение на вечер") available. */}
        <Stack.Screen name="TeaCategories" component={TeaCategoriesScreen} />
        {/* Pushed from TeaCategories with a `categoryId` param - WF30-35,
            now parametrized across all 4 real categories (TeaCeremonyScreen.tsx). */}
        <Stack.Screen name="TeaCeremony" component={TeaCeremonyScreen} />
        {/* Pushed from TeaCategories' "Интуитивный выбор" card (no
            categoryId - it's a mechanic, not a category). */}
        <Stack.Screen name="TeaIntuitiveChoice" component={TeaIntuitiveChoiceScreen} />
        {/* Pushed from Analytics' "Биоритмы" card - WF38. */}
        <Stack.Screen name="Biorhythms" component={BiorhythmsScreen} />
        {/* Was a broken route (Care already called navigate('ArticleWater'),
            no screen existed) - built 2026-09-16 now that she supplied the
            real full text. */}
        <Stack.Screen name="ArticleWater" component={ArticleWaterScreen} />
        {/* Brief 003 - the other two "Основы восстановления" articles, same
            broken-route situation Water had before 2026-09-16. */}
        <Stack.Screen name="ArticleLight" component={ArticleLightScreen} />
        <Stack.Screen name="ArticlePauses" component={ArticlePausesScreen} />
        {/* Pushed from Care's "Медитации" chip - brief 003 / decisions.md
            2026-11-21/22 #6, gated by FEATURE_CARE_PRACTICES. */}
        <Stack.Screen name="MeditationList" component={MeditationListScreen} />
        <Stack.Screen name="MeditationInfo" component={MeditationInfoScreen} />
        <Stack.Screen name="MeditationSession" component={MeditationSessionScreen} />
        <Stack.Screen name="MeditationComplete" component={MeditationCompleteScreen} />
        {/* Pushed from Care's "Сказки" chip - same brief/flag. */}
        <Stack.Screen name="StoriesList" component={StoriesListScreen} />
        <Stack.Screen name="StoryReader" component={StoryReaderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
