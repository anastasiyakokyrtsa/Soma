# Soma — project context

Soma is a mobile wellness/self-knowledge app centered on biorhythms (physical/emotional/intellectual cycles), sleep, mood, lunar/solar cycles, and menstrual cycle tracking, paired with rituals (breathing sessions, calming teas, meditation, articles).

**Design concept:** "Внутренний космос" (Inner cosmos) — the app is a personal observatory for self-knowledge, not a dashboard. Core line: **"Ты — система. Изучай её."** Dark backgrounds = silence/infinity, glowing elements = the body's internal signals. Cool/deep palette (dark blue, indigo, violet) with soft neon accents (pink, cyan, turquoise).

**Tagline:** "Прислушайся к ритмам своего тела."

## Source of truth

**The Figma file is the actual source of truth for product/audience/flow/wireframes** — not the local research PNGs below (they happen to match it, but always prefer re-checking Figma directly):
https://www.figma.com/design/safGxhsRmzYHIHXf9B3pYu/Biorhythm-Tracking-App (fileKey `safGxhsRmzYHIHXf9B3pYu`)

Known page node-IDs:
- `0:1` — user persona (4 personas)
- `59:1064` — job stories
- `58:34` — cjm (2 tables: simple 5-stage at `58:41`, detailed 7-column at `82:1088`)
- `59:39` — user flow (large — full onboarding + 2-branch app flow)
- `73:877` — wireframes (3 iterations; "Iteration 3 - Text content Inner cosmos" is current/final)
- `221:974` — concepts (2 directions explored — **only "Внутренний космос" is the chosen one**, ignore "Тихая забота")
- `402:2599` — "UI elements" (the actual UI kit page — logo, onboarding art, icons, moon/sun, mood scale, sleep tracker, breathing circle, biorhythm chart, tea screens, personalization, plus finished screens: Home v2, About app 1–3, How to do better, Analytics, Article - Water 1–3)

Note: `get_metadata` with no nodeId only lists the "cover" page — pass an explicit nodeId (from the URL's `node-id` param) to reach any other page.

## Onboarding — 2 branches (from the Figma user-flow page)
Shared start (sign in/up → value-prop slides → name/gender → "Что тебе ближе?" chip picker) branches into:
- **Научный подход** — profile setup: sleep schedule, cycle (if female), current-state scale, improvement goals, dream log. Home: biorhythm-today card, 3-biorhythm "Энергия дня" card, biorhythm chart, top-3 recommendations, breathing practices, grounding checklist, 528Hz player, research articles.
- **Астрологический подход** — profile setup: full birth data (name/date/time/place) for a natal chart. Home: moon-phase "Энергия дня" card, moon/solar-activity correlation, planetary aspects/transits, natal-chart forecast, Tarot & Oracle, daily affirmation.

Both converge on personalization (visual style) → Home. Core sections: Главный экран (Home) · Дневник (Journal) · Статистика (Stats) · Профиль.

**Don't mix branch content** — a Научный-branch screen shouldn't reference natal charts, and vice versa, unless the screen is explicitly shared/common.

## The 4 personas
| Persona | Profile | Core need |
|---|---|---|
| Филипп | 32, product designer, Moscow | Burned out, wants to spot energy dips early, manage his resource with data/logic |
| Алина | 26, yoga instructor, Сочи & Bali | Wants to understand mood/energy swings via lunar cycles; wants beauty, not clinical UI |
| Ирина | 47, literature teacher, Novosibirsk | Chronic winter fatigue, snaps then feels guilty; wants simple, non-overwhelming, guilt-free tools |
| Тимур | 20, physics student, Kazan | Wrecked sleep schedule, skeptical but curious; wants his state as legible data/graphs |

Common thread: they want the app to explain *why* they feel a certain way, without guilt, without becoming "one more overwhelming app."

**Recurring CJM barriers to design against:** distrust of tools that feel "too esoteric" OR "too clinical"; forms asking too much up front; doubt about whether insights are trustworthy; not enough energy to act even on simple recommendations. **Recurring desired outcomes:** feel the system adapts quickly; easy low-effort "what's making today harder" read; short flexible recommendations over rigid prescriptions; small positive feedback after a completed practice.

## Local folder usage rules
- **`Claude AI/v1/`** — do not use for design elements anymore (the design-system doc there is outdated). Wireframes under v1 are still fine. The v1 research (personas/job-stories/CJM/concept) matches Figma, but prefer Figma directly.
- **`Claude AI/v2/Для создания ui kit/`** — use this for design elements (`Элементы и экраны/` exported PNGs/SVGs, `Вайрфреймы/`).
- **`UI Kit/`** — the live static HTML/CSS/JS component-doc build (`index.html`, `css/style.css`, `js/main.js`, `assets/`). Source of truth for exact tokens/values already shipped there. Font: Nunito Sans (the whole kit — no second font). As of 2026-07-19, `assets/icons-clean/` (default + `-alt` active-state icon pairs) is the current icon set, fully wired into the Icons and Navigation sections.
- **`Вайрфреймы/`** (top level) — canonical wireframe screenshots, ~28 screens.
- **`Референсы/`** — competitor/inspiration screenshots (Bettersleep, Clue, Co-Star, Reflectly, Stoic, etc.) — neutral, fine to use regardless of v1/v2.
