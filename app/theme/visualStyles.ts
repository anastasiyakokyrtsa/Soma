import type { Language } from '../i18n/LanguageContext';

// "Настрой свой визуальный стиль" (WF 12-13) — data for the 4 pickable visual
// styles. Only Cosmos is actually implemented as a real theme (it's the app's
// one built visual identity so far); the other 3 are deliberately abstract
// mood swatches, not full re-skins — see memory/project_app_development.md
// for why (the user hasn't designed those yet, this screen exists to show a
// real choice, not to ship 4 finished themes). Picking a non-Cosmos style is
// UI-complete but doesn't yet re-theme the app — same "interaction built
// ahead of the content behind it" pattern as Support's tags or
// ChooseApproach's "Синтез двух систем".
export type VisualStyleId = 'cosmos' | 'focus' | 'nature' | 'dawn';

const VISUAL_STYLE_IDS: VisualStyleId[] = ['cosmos', 'focus', 'nature', 'dawn'];

const COPY: Record<Language, Record<VisualStyleId, { name: string; tagline: string }>> = {
  ru: {
    cosmos: {
      name: 'Космос',
      tagline: 'Бескрайность и тайна — пространство\nдля наблюдения за собой',
    },
    // Tagline is verbatim from WF 13 — a real spec, not invented copy.
    focus: {
      name: 'Фокус',
      tagline: 'Когда важно убрать шум и увидеть главное',
    },
    nature: {
      name: 'Природа',
      tagline: 'Заземлённость и мягкость —\nближе к телу и дыханию',
    },
    // Renamed from "Тепло" 2026-08-07 — moodboard reference: Figma
    // safGxhsRmzYHIHXf9B3pYu node 231:52 ("Тихая забота" concept page,
    // kept only as a mood reference here, not revived as a real direction).
    dawn: {
      name: 'Рассвет',
      tagline: 'Нежное рассветное небо — тепло вместо холодного неона',
    },
  },
  en: {
    cosmos: {
      name: 'Cosmos',
      tagline: 'Boundless and mysterious — a space\nfor observing yourself',
    },
    focus: {
      name: 'Focus',
      tagline: 'For when you need to cut the noise and see what matters',
    },
    nature: {
      name: 'Nature',
      tagline: 'Grounded and soft —\ncloser to the body and breath',
    },
    dawn: {
      name: 'Dawn',
      tagline: 'A gentle sunrise sky — warmth instead of cold neon',
    },
  },
};

export function getVisualStyles(language: Language) {
  return VISUAL_STYLE_IDS.map((id) => ({ id, ...COPY[language][id] }));
}
