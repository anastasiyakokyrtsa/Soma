import { common } from './common';
import { onboarding } from './onboarding';
import { home } from './home';
import { care } from './care';
import { biorhythms } from './biorhythms';
import { analytics } from './analytics';
import { tea } from './tea';
import { breathing } from './breathing';
import { quickLog } from './quickLog';

// Namespaced by screen/area so screen files only ever touch their own
// section - adding a new screen's translations never risks a merge
// conflict with another screen's.
export const dictionaries = {
  ru: {
    common: common.ru,
    onboarding: onboarding.ru,
    home: home.ru,
    care: care.ru,
    biorhythms: biorhythms.ru,
    analytics: analytics.ru,
    tea: tea.ru,
    breathing: breathing.ru,
    quickLog: quickLog.ru,
  },
  en: {
    common: common.en,
    onboarding: onboarding.en,
    home: home.en,
    care: care.en,
    biorhythms: biorhythms.en,
    analytics: analytics.en,
    tea: tea.en,
    breathing: breathing.en,
    quickLog: quickLog.en,
  },
};
