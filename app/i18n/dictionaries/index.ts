import { common } from './common';
import { onboarding } from './onboarding';

// Namespaced by screen/area so screen files only ever touch their own
// section - adding a new screen's translations never risks a merge
// conflict with another screen's.
export const dictionaries = {
  ru: { common: common.ru, onboarding: onboarding.ru },
  en: { common: common.en, onboarding: onboarding.en },
};
