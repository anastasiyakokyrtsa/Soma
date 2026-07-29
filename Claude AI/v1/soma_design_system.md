# SOMA — Design System Master Document
## Version 1.0 · Production-Grade Specification

---

> **Document purpose:** Single source of truth for all design, engineering, and AI generation decisions.
> Optimized for Claude Design, Figma, React/Tailwind, and long-term scalability.

---

## TABLE OF CONTENTS

1. [Product Foundation](#1-product-foundation)
2. [Design Philosophy](#2-design-philosophy)
3. [Token System](#3-token-system)
4. [Typography System](#4-typography-system)
5. [Spacing & Layout](#5-spacing--layout)
6. [Color System](#6-color-system)
7. [Elevation & Depth](#7-elevation--depth)
8. [Motion System](#8-motion-system)
9. [Component Architecture](#9-component-architecture)
10. [Component Inventory](#10-component-inventory)
11. [Pattern Library](#11-pattern-library)
12. [Accessibility System](#12-accessibility-system)
13. [React/Tailwind Implementation](#13-reacttailwind-implementation)
14. [Figma Architecture](#14-figma-architecture)
15. [Claude Design Prompting Guide](#15-claude-design-prompting-guide)
16. [Implementation Rules](#16-implementation-rules)
17. [Quality Checklist](#17-quality-checklist)

---

## 1. PRODUCT FOUNDATION

### Identity
**Product name:** Soma
**Tagline:** Прислушайся к ритмам своего тела
**Design concept:** "Внутренний космос" — Inner cosmos
**Core metaphor:** A personal observatory for self-knowledge

### The Design Question
Every decision must pass this test:
> *"Does this feel like inner space, or does it feel like a dashboard?"*
When in doubt, remove. Silence is content here.

### Product Personality
| Quality | Expression |
|---------|-----------|
| Calm intelligence | Never lectures, never panics |
| Scientific warmth | Data without clinical distance |
| Intimate atmosphere | Like reading your own journal |
| Quiet authority | Observes, doesn't command |
| Poetic precision | Beautiful and accurate simultaneously |

### User Emotional Modes
| Mode | User | Design response |
|------|------|----------------|
| Overloaded | Filipp, Irina | Reduce cognitive load, fast insight |
| Attuned | Alina | Beauty, rhythm, nature connection |
| Curious | Timur | Data legibility, scientific framing |

### Emotional Contract
*"We don't tell you what to do. We help you see what is already there."*

---

## 2. DESIGN PHILOSOPHY

### UX Principles

**01 · Minimum viable attention**
Every screen delivers core value within 3 seconds. No explanation required. Hierarchy makes purpose self-evident.

**02 · Earned complexity**
Density increases as the user goes deeper. Home = sparse. Analytics = rich. Nothing complex appears uninvited.

**03 · Soft authority**
Copy uses second-person singular (ты). Observational, never prescriptive. "Сегодня важно…" not "Вам нужно…"

**04 · Contextual intelligence**
The app knows the time, moon phase, biorhythm state and adjusts what it surfaces. Intelligence is felt, not displayed.

**05 · Ritual affordance**
Every feature has the quality of a ritual. Ceremonial, not transactional.

### Visual Philosophy

**Dark is intimate, not aggressive**
Near-black backgrounds are the visual metaphor of turning inward. Not dark mode for battery — it is the product's soul.

**Light is signal, not decoration**
Glowing elements represent active energy, biorhythm peaks, important data. Where there is glow, something matters.

**Silence is content**
Generous dark-space carries emotional weight equal to the elements themselves.

**Depth without noise**
Fine grain overlay (3–5% opacity) creates material depth. Never competing with content.

### Emotional Interaction Principles

- Touch should feel like presence — buttons compress, sliders resist, breathing circle is membrane-like
- Feedback should feel like response, not confirmation
- Negative states deserve more care, not less beauty
- Completion should feel earned, not celebrated

### Copy Voice
- Second-person singular (ты) throughout
- Present tense, present moment
- Observational, never prescriptive
- Brief, warm, precise
- Scientific without jargon
- Poetic without being vague

---

## 3. TOKEN SYSTEM

### Architecture: Three-Tier Token Chain

```
Tier 1: Primitive tokens     → raw values, never used directly in components
Tier 2: Semantic tokens      → map primitives to meaning
Tier 3: Component tokens     → scope semantics to component context
```

### Tier 1: Primitive Tokens

```css
/* Background primitives */
--primitive-void-100: #07080F;
--primitive-void-200: #0C0E1A;
--primitive-void-300: #131525;
--primitive-void-400: #1A1D30;
--primitive-void-500: #252840;

/* Violet primitives */
--primitive-violet-100: #C4BBFA;
--primitive-violet-200: #A89CF8;
--primitive-violet-300: #8B7CF6;
--primitive-violet-400: #7B6FF0;
--primitive-violet-500: #6B5FD4;

/* Text primitives */
--primitive-white-100: #F2F0FA;
--primitive-white-200: #D4D0EC;
--primitive-white-300: #8A8FA8;
--primitive-white-400: #5A5F78;
--primitive-white-500: #44495E;

/* Semantic color primitives */
--primitive-teal-300: #5BC4A0;
--primitive-rose-300: #E891A8;
--primitive-amber-300: #F4C06A;
--primitive-lavender-300: #A8A4D8;
```

### Tier 2: Semantic Tokens

```css
/* === BACKGROUND SEMANTICS === */
--color-void:           var(--primitive-void-100);     /* absolute background */
--color-deep:           var(--primitive-void-200);     /* primary page background */
--color-surface:        var(--primitive-void-300);     /* card backgrounds */
--color-elevated:       var(--primitive-void-400);     /* elevated components, inputs */
--color-border:         var(--primitive-void-500);     /* default borders */
--color-border-glow:    rgba(139, 124, 246, 0.20);    /* accent borders */

/* === ACCENT SEMANTICS === */
--color-accent:         var(--primitive-violet-300);  /* primary accent */
--color-accent-hover:   var(--primitive-violet-200);  /* hover state */
--color-accent-press:   var(--primitive-violet-500);  /* pressed state */
--color-accent-subtle:  rgba(139, 124, 246, 0.12);   /* bg fills */
--color-accent-glow:    rgba(139, 124, 246, 0.25);   /* ambient glow */

/* === BIORHYTHM SEMANTICS === */
--color-physical:       var(--primitive-teal-300);    /* physical state — teal */
--color-emotional:      var(--primitive-rose-300);    /* emotional state — rose */
--color-intellectual:   var(--primitive-violet-300);  /* intellectual — violet (= accent) */
--color-solar:          var(--primitive-amber-300);   /* solar activity — amber */
--color-lunar:          var(--primitive-lavender-300);/* lunar cycle — lavender */

/* === TEXT SEMANTICS === */
--text-primary:         var(--primitive-white-100);   /* #F2F0FA */
--text-secondary:       var(--primitive-white-300);   /* #8A8FA8 */
--text-tertiary:        var(--primitive-white-500);   /* #44495E */
--text-inverse:         var(--primitive-void-200);    /* on light surfaces */

/* === FUNCTIONAL SEMANTICS === */
--color-success:        var(--primitive-teal-300);
--color-warning:        var(--primitive-amber-300);
--color-error:          var(--primitive-rose-300);    /* soft rose — never alarming red */
--color-info:           var(--primitive-violet-300);
```

### Tier 3: Component Tokens (examples)

```css
/* Button */
--btn-primary-bg:       var(--color-accent);
--btn-primary-text:     var(--text-primary);
--btn-primary-glow:     var(--color-accent-glow);
--btn-secondary-bg:     var(--color-elevated);
--btn-secondary-border: rgba(139, 124, 246, 0.40);

/* Card */
--card-bg:              var(--color-surface);
--card-border:          var(--color-border);
--card-radius:          var(--radius-l);
--card-padding:         var(--space-5);

/* Input */
--input-bg:             var(--color-elevated);
--input-border:         var(--color-border);
--input-border-focus:   var(--color-accent);
--input-text:           var(--text-primary);
--input-placeholder:    var(--text-tertiary);
```

---

## 4. TYPOGRAPHY SYSTEM

### Typeface
**Primary:** Inter Variable
**Rationale:** Scientific legibility + Cyrillic quality + variable weight for ultralight numerals
**Rule:** Single typeface only. No serif/sans mixing. Unity creates intimacy.

### Type Scale

```css
/* Display — hero moments */
--type-display:     font-size: 32px; font-weight: 300; line-height: 1.2; letter-spacing: -0.01em;

/* Screen titles */
--type-hero:        font-size: 28px; font-weight: 400; line-height: 1.25; letter-spacing: -0.005em;
--type-title-l:     font-size: 22px; font-weight: 400; line-height: 1.3;
--type-title-m:     font-size: 18px; font-weight: 500; line-height: 1.35;
--type-title-s:     font-size: 16px; font-weight: 500; line-height: 1.4;

/* Body */
--type-body-l:      font-size: 16px; font-weight: 400; line-height: 1.65;
--type-body-m:      font-size: 14px; font-weight: 400; line-height: 1.6;
--type-body-s:      font-size: 13px; font-weight: 400; line-height: 1.55;

/* Labels */
--type-label:       font-size: 12px; font-weight: 500; line-height: 1.3; letter-spacing: 0.04em;
--type-micro:       font-size: 11px; font-weight: 500; line-height: 1.3; letter-spacing: 0.08em;

/* Data — the product's emotional signature */
--type-data-hero:   font-size: 52px; font-weight: 200; line-height: 1.0; letter-spacing: -0.02em;
--type-data-xl:     font-size: 36px; font-weight: 200; line-height: 1.0; letter-spacing: -0.02em;
--type-data-l:      font-size: 28px; font-weight: 200; line-height: 1.1; letter-spacing: -0.02em;
--type-data-m:      font-size: 22px; font-weight: 300; line-height: 1.1; letter-spacing: -0.01em;
```

### Typography Rules
- Maximum font weight: 500 (Medium). Never 600 or 700.
- Data numerals always 200–300 weight. Heavy numbers feel clinical.
- Letter-spacing: negative on large data (-0.02em), positive on micro labels (0.08em)
- Russian/Cyrillic: minimum line-height 1.55 on any body text
- No ALL CAPS except micro-labels (11–12px, +0.08em tracking)

### Tailwind Config

```js
// tailwind.config.js — typography
fontSize: {
  'display':    ['32px', { lineHeight: '1.2', fontWeight: '300', letterSpacing: '-0.01em' }],
  'hero':       ['28px', { lineHeight: '1.25', fontWeight: '400' }],
  'title-l':    ['22px', { lineHeight: '1.3', fontWeight: '400' }],
  'title-m':    ['18px', { lineHeight: '1.35', fontWeight: '500' }],
  'body-l':     ['16px', { lineHeight: '1.65', fontWeight: '400' }],
  'body-m':     ['14px', { lineHeight: '1.6', fontWeight: '400' }],
  'body-s':     ['13px', { lineHeight: '1.55', fontWeight: '400' }],
  'label':      ['12px', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.04em' }],
  'micro':      ['11px', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.08em' }],
  'data-hero':  ['52px', { lineHeight: '1.0', fontWeight: '200', letterSpacing: '-0.02em' }],
  'data-xl':    ['36px', { lineHeight: '1.0', fontWeight: '200', letterSpacing: '-0.02em' }],
  'data-m':     ['22px', { lineHeight: '1.1', fontWeight: '300', letterSpacing: '-0.01em' }],
},
fontWeight: {
  'extralight': '200',
  'light':      '300',
  'normal':     '400',
  'medium':     '500',
  // 600, 700 intentionally omitted
},
```

---

## 5. SPACING & LAYOUT

### Base Grid: 4pt

```css
--space-1:   4px;    /* icon-to-label, micro gaps */
--space-2:   8px;    /* chip gaps, inline spacing */
--space-3:  12px;    /* card internal gaps, list items */
--space-4:  16px;    /* component padding, default gaps */
--space-5:  20px;    /* card padding, screen margins */
--space-6:  24px;    /* between related sections */
--space-8:  32px;    /* between sections */
--space-10: 40px;    /* major section breaks */
--space-12: 48px;    /* top screen padding */
--space-16: 64px;    /* hero spacing */
--space-20: 80px;    /* bottom nav clearance */
```

### Border Radius Scale

```css
--radius-s:    8px;     /* chips, tags, small inputs */
--radius-m:   16px;     /* cards, buttons, inputs */
--radius-l:   24px;     /* large cards, sheets */
--radius-xl:  32px;     /* panels, floating elements */
--radius-full: 9999px;  /* pills, toggles, avatars */
```

### Layout Specifications

```
Mobile baseline:    375px (iPhone 14 Pro)
Content width:      335px (375 - 40px margins)
Horizontal margins: 20px each side
Bottom nav height:  80px (includes 34px safe area)
Status bar clear:   48px
Scroll padding-b:   100px (prevents nav overlap)
Card gutters:       12px
Section gap:        32px above each section header
```

### Grid System

| Columns | Usage |
|---------|-------|
| 1 col (full width) | Articles, onboarding, breathing, tea detail — dominant layout |
| 2 col (50/50) | Lunar/solar pair, analytics tiles, focus card pairs |
| 3 col (equal) | Quick-action tiles, biorhythm summary circles |
| Horizontal scroll | Card carousels — 1.15 cards visible, 20px peek |

### Tailwind Spacing Config

```js
spacing: {
  '1':  '4px',
  '2':  '8px',
  '3':  '12px',
  '4':  '16px',
  '5':  '20px',
  '6':  '24px',
  '8':  '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
},
borderRadius: {
  's':    '8px',
  'm':    '16px',
  'l':    '24px',
  'xl':   '32px',
  'full': '9999px',
},
```

---

## 6. COLOR SYSTEM

### Complete Semantic Color Map

```js
// tailwind.config.js — colors
colors: {
  // Backgrounds
  void:     '#07080F',
  deep:     '#0C0E1A',
  surface:  '#131525',
  elevated: '#1A1D30',
  border:   '#252840',

  // Accent system
  accent: {
    DEFAULT: '#8B7CF6',
    hover:   '#A89CF8',
    press:   '#6B5FD4',
    subtle:  'rgba(139, 124, 246, 0.12)',
    glow:    'rgba(139, 124, 246, 0.25)',
    border:  'rgba(139, 124, 246, 0.40)',
  },

  // Biorhythm semantic colors
  physical:     '#5BC4A0',
  emotional:    '#E891A8',
  intellectual: '#8B7CF6',  // = accent
  solar:        '#F4C06A',
  lunar:        '#A8A4D8',

  // Text
  text: {
    primary:   '#F2F0FA',
    secondary: '#8A8FA8',
    tertiary:  '#44495E',
    inverse:   '#0C0E1A',
  },

  // Functional
  success: '#5BC4A0',
  warning: '#F4C06A',
  error:   '#E891A8',
  info:    '#8B7CF6',
},
```

### Color Rules

**NEVER:**
- Use red for biorhythm lows or negative states
- Hardcode hex values in components (always use tokens)
- Use more than 3–4 colors on a single screen
- Use warning/error colors for data that is "low" (low ≠ bad)

**ALWAYS:**
- Use semantic tokens (--color-physical, not #5BC4A0)
- Pair any colored element with a text label (color alone is never the only signal)
- Keep text contrast ≥ 4.5:1 against its background

### Contrast Reference

| Combination | Ratio | WCAG |
|------------|-------|------|
| --text-primary on --color-deep | 13.2:1 | AAA ✓ |
| --text-primary on --color-surface | 11.8:1 | AAA ✓ |
| --text-secondary on --color-surface | 4.6:1 | AA ✓ |
| --color-accent on --color-deep | 5.1:1 | AA ✓ |
| --text-tertiary on --color-surface | 2.1:1 | Decorative only |

---

## 7. ELEVATION & DEPTH

### Depth System

Depth in Soma is created through translucency and controlled glow — not harsh drop shadows.

```css
/* Elevation levels */
--elevation-0: background: var(--color-deep); /* base — no treatment */

--elevation-1:
  background: rgba(19, 21, 37, 0.70);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.04);

--elevation-2:
  background: rgba(26, 29, 48, 0.85);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.06);

--elevation-3:
  background: rgba(19, 21, 37, 0.96);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(139, 124, 246, 0.15);

/* Glow effects — for data and accent elements */
--glow-accent-s:  0 0 12px rgba(139, 124, 246, 0.20);
--glow-accent-m:  0 0 24px rgba(139, 124, 246, 0.25);
--glow-accent-l:  0 0 48px rgba(139, 124, 246, 0.20), 0 0 16px rgba(139, 124, 246, 0.15);

/* Semantic glow variants */
--glow-physical:    0 0 20px rgba(91, 196, 160, 0.25);
--glow-emotional:   0 0 20px rgba(232, 145, 168, 0.25);
--glow-solar:       0 0 20px rgba(244, 192, 106, 0.25);
```

### Background Texture

The starfield/grain texture is structural — not decorative. Without it, dark backgrounds feel flat and dead.

```css
/* Implementation */
.screen-bg {
  background-color: var(--color-deep);
  position: relative;
}
.screen-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('noise.png');  /* fine grain, ~200×200px tile */
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
}

/* CSS-only noise alternative */
.screen-bg {
  background-color: #0C0E1A;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}
```

---

## 8. MOTION SYSTEM

### Duration Scale

```css
--dur-micro:      100ms;  /* button press, toggle flick */
--dur-fast:       200ms;  /* chip select, input focus */
--dur-standard:   350ms;  /* card appear, state change */
--dur-deliberate: 500ms;  /* page transition, modal open */
--dur-data:       600ms;  /* number count-up on first render */
--dur-breath-in:  4000ms; /* breathing circle expand */
--dur-breath-out: 6000ms; /* breathing circle contract */
--dur-orbital:    8000ms; /* ambient background glow pulse */
```

### Easing Curves

```css
--ease-gentle:   cubic-bezier(0.25, 0.0, 0.0, 1.0);   /* default UI motion */
--ease-breath:   cubic-bezier(0.45, 0.0, 0.55, 1.0);  /* breathing, tidal */
--ease-arrive:   cubic-bezier(0.0,  0.0, 0.2, 1.0);   /* sheets from bottom */
--ease-depart:   cubic-bezier(0.4,  0.0, 1.0, 1.0);   /* elements leaving */
--ease-complete: cubic-bezier(0.34, 1.2, 0.64, 1.0);  /* completion only */
```

### Page Transitions

```css
/* Forward navigation — screen rises into view */
.page-enter {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 450ms var(--ease-gentle), transform 450ms var(--ease-gentle);
}

/* Back navigation — screen recedes */
.page-exit {
  opacity: 1;
  transform: translateY(0);
}
.page-exit-active {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 350ms var(--ease-depart), transform 350ms var(--ease-depart);
}
```

### Data Count-Up Animation

```js
// Number animation utility
function countUp(element, target, duration = 600) {
  const start = performance.now();
  const startValue = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out: fast start, slow arrival
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (target - startValue) * eased;
    element.textContent = current.toFixed(1) + '%';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
```

### Motion Rules

- No bounce on standard navigation or negative states
- Spring easing reserved for completion moments only
- Ambient animations (glow pulse, background) always check prefers-reduced-motion
- Tab switches are instant — no animation
- Data count-up only on first render; subsequent updates are instant

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Breathing session: remove visual animation but keep text guidance */
  .breathing-circle { animation: none !important; }
  .breathing-text { display: block; } /* text fallback always present */
}
```

---

## 9. COMPONENT ARCHITECTURE

### Component Taxonomy

```
Atoms           → tokens + single-purpose elements
  └─ Button, Icon, Badge, Divider, Avatar

Molecules       → 2–4 atoms combined for a function
  └─ InputField, Chip, Card, ListItem, Toggle

Organisms       → complex functional units
  └─ BottomNav, BiorhythmRing, MoodSlider, SleepArc, BreathingCircle

Templates       → screen-level layout patterns
  └─ HomeTemplate, AnalyticsTemplate, OnboardingTemplate

Screens         → populated templates
  └─ All 38 wireframe screens
```

### State Machine — Universal

Every interactive component must define all 9 states:

| State | Treatment |
|-------|-----------|
| Default | Resting — standard visual weight |
| Hover | Desktop: bg lift +10%. Mobile: skip |
| Focus | 2px accent ring, 2px offset |
| Pressed | scale(0.97–0.98), bg darkens |
| Selected | accent-subtle bg + accent border |
| Disabled | opacity: 0.35, no interaction |
| Loading | Skeleton shimmer, no spinners |
| Error | Rose color — never alarming red |
| Success | Teal glow, quiet checkmark |

---

## 10. COMPONENT INVENTORY

### NAVIGATION (4 components)

#### BottomNav
```
Purpose:    Primary 5-destination navigation + FAB
Height:     80px (incl. 34px safe area)
Background: --elevation-2 (backdrop-blur: 32px)
Tabs:       Home / Support / [FAB] / Journal / Analytics
Active:     icon + label, --color-accent
Inactive:   icon only, --text-tertiary
FAB:        56×56px, --color-accent, glow-accent-m
```

#### ScreenHeader
```
Variants:   back+title | back only | back+action | close(×)
Height:     44px
Back icon:  ti-arrow-left, 20px, --text-primary
Close icon: ti-x, 20px, --text-primary
Title:      --type-title-m, centered or left
```

#### ProgressBar (step indicator)
```
Variants:   linear bar | dot row | numeric "Шаг 2/4"
Height:     2px (bar) / 6px dots
Track:      --color-border
Fill:       --color-accent
Transition: width, 300ms --ease-gentle
```

#### SectionHeader
```
Variants:   label only | label + link | label + subtitle
Title:      --type-title-s (17px/500), --text-primary
Link:       --type-label, --color-accent, right-aligned
Spacing:    32px above, 12px below
```

---

### INPUTS (8 components)

#### TextField
```
Height:         52px
Radius:         --radius-m
Background:     --color-elevated
Border default: 1px --color-border
Border focus:   1.5px --color-accent
Error border:   1.5px --color-emotional
Text:           --type-body-l, --text-primary
Placeholder:    --text-tertiary
```

#### MoodSlider
```
Variants:   full 5-point | compact 3-point | read-only
Track:      pill, 4px height
Thumb:      28px white circle, accent glow
Emoji:      56px, centered above, crossfade 120ms
States:     Очень плохо / Плохо / Нейтрально / Хорошо / Отлично
```

#### SleepArcPicker
```
SVG diameter:    240px
Arc stroke:      6px --color-accent
Track stroke:    2px --color-border
Handles:         20px white circles, draggable
Center text:     duration in --type-data-m
Wrap:            midnight crossing handled seamlessly
```

#### DateScrollPicker
```
Variants:       3-column drum-roll | calendar range
Column items:   5 visible, center = selected
Item height:    44px
Non-selected:   opacity: 0.4, slight scale reduction
Snap:           to item on release, momentum scrolling
```

#### SelectionChip
```
Variants:   multi-select | single-select | expandable | read-only tag
Height:     36px
Padding:    0 16px
Radius:     --radius-full
Default:    --color-elevated bg
Selected:   --color-accent-subtle + 1px --color-accent border
Transition: 150ms
```

#### Toggle
```
Track:      51×31px, --radius-full
Off color:  --color-border
On color:   --color-accent
Thumb:      27×27px white circle
Transition: 200ms --ease-breath
```

#### VisualStyleSelector
```
Grid:       2×2 square tiles
Gap:        12px
Selected:   2px --color-accent border + top-right checkmark
4 themes:   Внутренний космос | Тихая забота | Научный | Природа
```

#### SearchField
```
Height:     44px
Radius:     --radius-full
Icon left:  ti-search, 16px, --text-tertiary
Clear right: ti-x (when filled)
Debounce:   300ms
```

---

### CARDS (7 components)

#### StandardCard
```
Background: --color-surface
Border:     1px --color-border
Radius:     --radius-l (24px)
Padding:    20px
Variants:   default | atmospheric (blur) | accent-left | interactive
Press:      scale(0.99), 100ms
```

#### QuickActionTile
```
Size:       ~103×110px (3-column grid)
Radius:     --radius-m
Icon:       28px --color-accent + radial glow halo
Label:      12px/400
Meta:       11px --text-tertiary
Completed:  checkmark icon, muted text
```

#### FeaturedRitualCard
```
Width:      full (335px)
Radius:     --radius-l
Layout:     illustration 40% | text 60%
Illustration: atmospheric, violet-toned, painterly glow
CTA:        pill button, accent, internal to card
```

#### ArticleListItem
```
Height:     72px
Radius:     --radius-m
Layout:     [icon 40×40] [gap 12] [text stack] [chevron]
Icon bg:    --color-elevated, radius 10px
Title:      14px/500, 1-line ellipsis
Subtitle:   13px/400, --text-secondary
```

#### QuoteCard
```
Opening mark: 32px decorative, --text-tertiary
Quote text:   --type-body-l, italic
Attribution:  13px, --text-secondary, right-aligned
Actions:      bookmark + share, 20px icon-only
```

#### LunarSolarCard
```
Variants:   compact pair | full detail
Visual:     programmatic SVG (moon phase accurate, solar rings)
Colors:     --color-lunar | --color-solar
Data:       key:value rows, 13px, <dl> structure
Insight:    12px italic below data
```

#### DailyFocusCard
```
Grid:       always paired (2-column, 2 cards)
Icon:       24px semantic category color
Title:      14px/500
Description: 13px, --text-secondary, 2–3 lines
Selection:  AI-based on biorhythm state
```

---

### BIOMETRICS (6 components)

#### HeroBiorhythmRing
```
Diameter:     220–240px
SVG layers:   (1) bg fill (2) track arc (3) value arc (4) glow (5) bloom (6) text
Ring stroke:  3px + blurred glow duplicate
Value:        --type-data-hero (52px/200), center
Label:        --type-micro, --text-secondary, below value
Ambient:      opacity pulse 15→30→15%, 8s loop
Count-up:     600ms ease-out on first render
Negative:     displayed with '−' prefix, same color (no alarm treatment)
```

#### BiorhythmSummaryTrio
```
3-column row: Physical / Emotional / Intellectual
Diameter:     88–96px
Value:        --type-data-xl (36px/200)
Label:        11px/500, --text-tertiary, below
Glow:         scales with absolute value magnitude
Tappable:     navigates to detail screen
```

#### BiorhythmWaveChart
```
SVG path:     smooth cubic bezier, 120px height
Lines:        3 curves, 1.5px stroke, 0.85 opacity
Colors:       physical/emotional/intellectual semantic
Today:        dashed vertical line, intersection dots
Interaction:  tap+hold crosshair tooltip
Range:        up to 90 days horizontal scroll
```

#### BreathingCircle
```
Outer ring:   280px, fixed
Inner circle: 120–240px, animated
Phases:       inhale 4s | hold | exhale 6s
Easing:       --ease-breath for all phases
Glow:         scales linearly with inner circle size
Label:        "Вдыхай" / "Задержи" / "Выдыхай", fade-in 200ms
Reduced-motion: static + countdown text fallback
```

#### StateArcGauge
```
Variants:   full circle | half arc | segmented
Sizes:      48px (inline) | 88px (summary) | 160px (feature)
Usage:      sleep quality, stress level, energy indicators
```

#### ProcessingAnimation
```
Steps:      2 pills connected by vertical line
Step 1:     spinner → complete checkmark (2–3s)
Step 2:     empty ring → complete checkmark (1.5s)
Connector:  dashed → solid on step 1 complete
Purpose:    perceived intelligence (plays full even if data is faster)
```

---

### ONBOARDING (6 components)

#### SplashScreen
```
Variants:   title | value prop (2) | CTA
Carousel:   3 dots progress, swipe or "Далее"
Image area: 50% screen height, atmospheric full-bleed
Always:     "У меня уже есть аккаунт" link
```

#### OnboardingQuestion
```
Layout:     progress bar → back → title → subtitle → input → CTA → skip
Title:      --type-hero (28px/400)
Subtitle:   15px, --text-secondary (rationale text)
CTA:        "Продолжить", primary button, bottom
Skip:       "Пропустить онбординг ⓘ", ghost link
```

#### ApproachSelector
```
3 options:  Научно-практический | Астрологический | Синтез
Behavior:   tap to expand description (accordion)
Selection:  separate from expansion state
Impact:     changes content language across entire app
```

#### ProfileDataFlow
```
Steps:      4 (birth date → sleep → cycle/skip → mood)
Indicator:  "Шаг N/4" label in header
Branch:     gender=female: 4 steps; gender=male: 3 steps
Always:     "Заполнить позже ⓘ" on every step
```

#### OnboardingComplete
```
States:     Processing → Complete
CTA label:  "Начать исследование" (not "Готово")
Philosophy: user is beginning an investigation, not finishing setup
```

#### ContextualTooltip
```
Trigger:    ⓘ icon, explicit tap only — never auto-shown
Size:       max 200px wide, --radius-m, 12px padding
Text:       13px, --text-primary
Dismiss:    tap outside, Escape
```

---

### MODALS & SHEETS (5 components)

#### BottomSheet
```
Variants:   half (~50vh) | full | confirmation (~180px)
Entry:      slide up, 450ms --ease-arrive
Background: dim + blur behind
Handle:     36×4px pill, --color-border, top center
Dismiss:    drag down or × close
```

#### LogEntrySheet
```
Trigger:    FAB tap
Mode:       quick (mood only) | full (all fields)
Fields:     mood slider + energy dots + optional note
CTA:        "Сохранить", primary bottom
```

#### SessionInfoSheet
```
Purpose:    pre-session context panel
Content:    name + duration + description
CTA:        "Я готов" — no × close, drag only
Effect:     forces reading before starting
```

#### ConfirmationDialog
```
Used for:   destructive/significant actions only
Title:      describes outcome, not action
Destructive CTA: specific ("Удалить всё", not "Да")
Default focus: CANCEL button (safer)
```

#### ContextualUpsell
```
Philosophy: never blocks content
Preview:    gated feature always visible (blurred)
CTA:        "Попробовать 7 дней", "Позже" always present
Max height: 50% of screen
```

---

### CHARTS (5 components)

#### BiorhythmSinusoid
- 3 overlapping smooth curves (1.5px, semantic colors)
- No grid lines, no fill under curves
- Today marker: dashed vertical + intersection dots
- Interaction: tap+hold scrubber tooltip
- Time range: Day / Week / Month tabs

#### SleepBars
- 7-day horizontal bars
- Length = duration, Color = quality tier (teal/rose/violet)
- Recommended duration reference line
- Color always supplemented by text label

#### LunarPhaseTimeline
- 30-day horizontal scroll
- Accurate SVG moon phase icons per day
- Mood correlation dots below each icon
- AI insight text beneath timeline

#### CorrelationScatter
- Two-variable relationship chart
- Each dot = one day, --color-accent
- Trend line: dashed --color-lunar
- Tap dot: popover with date + values

#### SolarActivityIndicator
- SVG sun with spike length = Kp index
- Color: --color-solar
- 3-day forecast mini bars
- Always includes plain-language interpretation

---

### ANALYTICS (5 components)

#### AnalyticsGrid
- 2-column, 3-row entry dashboard
- Each tile: sparkline preview + label
- Sections: Биоритмы / Сон / Состояния / Луна / Солнце / Паттерны

#### TimeRangeSelector
- 3-tab pill: День / Неделя / Месяц
- Sliding indicator animation (200ms)
- Updates all charts simultaneously on select

#### PatternInsightRow
- Icon + insight text + significance + expandable
- Inline expansion (never modal)
- "Как это работает" link to supporting article

#### SleepQualityRow
- Date + bar + duration per day
- 7-day view
- Color quality encoding + text quality label

#### WeeklySummaryCard
- Date range + 3 mini rings + AI narrative
- Narrative: 2–3 sentences, observational tone
- Always: one positive + one awareness note

---

### EMOTIONAL INSIGHTS (5 components)

#### DailyStateNarrative
- Location: below biorhythm rings on home
- No card wrapper — floats in scroll flow
- Italic --type-body-l, --text-primary
- Max 3 sentences, state-specific, never generic
- Generated by Claude, tone-filtered

#### SupportContextHeader
- Dynamic title based on biorhythm state
- 12 copy variants mapped to state combinations
- Example: "Твоё состояние сегодня изменчиво / Дай себе мягкое восстановление"

#### RecommendationList
- 3-column quick-action tiles + chip filter
- Ranked: state match → time of day → history
- Completion: checkmark, label → "Выполнено"

#### TeaRecommendation
- 5 collections: Успокоение / Энергия / Фокус / Тепло / Интуитивный
- Detail: herb name (display size) + illustration + description + recipe
- Recommendation based on current state, no explicit reason shown

#### ArticleReader
- Semantic HTML: article, h1–h3, p, ul, blockquote
- Reading progress: thin top bar
- Pull quotes, inline links, "Все статьи" end link

---

### PROFILE (5 components)

#### ProfileHeader
- Avatar 64px (initials default) + name + approach badge
- Edit: ti-pencil, 20px, --text-tertiary
- Photo upload via bottom sheet

#### ProfileCompleteness
- Thin progress bar + "N% заполнено"
- Incomplete items as tappable chips
- Positive framing only ("Добавь X для Y")

#### StreakTracker
- 7-day dot row (filled/empty)
- Breaking streak: no negative treatment
- Copy: "Возвращаться — тоже часть практики"

#### ConnectedTracker
- States: not-connected | connected | syncing | error
- Sources: Apple Health, Google Fit, Garmin, Oura
- Error: rose dot + retry (never alarming red)

#### JournalEntryRow
- Height: 60px
- Layout: date | separator | mood dot + note preview + mini rings
- Grouped by week
- Swipe-left (iOS): delete with confirmation

---

### SETTINGS (4 components)

#### SettingsGroup
- Group label: 11px/500 uppercase tracking, --text-tertiary
- Card with intra-row dividers (left-indented)
- Groups: Профиль / Внешний вид / Уведомления / Трекеры / Подписка / О приложении

#### SettingsRow
- Variants: navigation | toggle | value | destructive
- Height: 52px
- Text: 15px/400, --text-primary
- Value/chevron: 14px, --text-tertiary
- No colorful icon backgrounds

#### NotificationPreferences
- Master toggle → per-type toggles → time pickers
- Types: Утреннее / Вечернее / Рекомендации / Биоритм-события
- Time: drum-roll picker in bottom sheet

#### VisualStylePicker (settings)
- Same as onboarding selector + current selection checkmark
- "Предпросмотр" button: full-screen live preview
- Apply: 600ms crossfade across entire app

---

### AI INTERACTIONS (4 components)

#### AIInsightCard
- No "AI says:" label — appears as app's own voice
- Optional ti-sparkles 16px icon (--text-tertiary)
- "Почему именно это?" inline expansion
- Maximum 1 per scroll view

#### PersonalizedRecommendation
- Contextual anchor: "Сегодня, когда эмоциональный фон снижен…"
- "Почему это?" available on every recommendation
- Post-completion micro-survey: "Помогло?" Yes / Немного / Нет

#### AIGenerationState
- Skeleton: rounded rect placeholders, opacity pulse
- First load: full skeleton
- Refresh: previous content remains, new crossfades in (no flicker)
- Pulse respects prefers-reduced-motion

#### TransparencyLayer
- Access: "Как Soma это знает?" link (--text-tertiary, 13px)
- Bottom sheet: data used + pattern detected + confidence (low/medium/high)
- Tone: "Мы заметили, что…" not "p=0.04"

---

## 11. PATTERN LIBRARY

### Screen Anatomy Patterns

#### Home Screen Pattern
```
48px   → Status bar clearance
20px   → Section top padding
        → Greeting + date (--type-title-m)
32px   → Section gap
        → HeroBiorhythmRing (centered, 240px)
16px   → Gap
        → BiorhythmSummaryTrio (3-column)
12px   → Gap
        → DailyStateNarrative (italic, no card)
32px   → Section gap
        → SectionHeader "Что поможет сейчас"
12px   → Gap
        → QuickActionTile × 3
32px   → Section gap
        → SectionHeader "Восстановление ресурса"
8px    → Gap
        → Chip filters (flex-wrap)
32px   → Section gap
        → SectionHeader "Чай как ритуал"
12px   → Gap
        → FeaturedRitualCard
32px   → Section gap
        → SectionHeader "О теле и ритмах"
12px   → Gap
        → ArticleListItem × 3
        → "Все статьи" link
        → QuoteCard (float, no card bg)
100px  → Bottom scroll padding
```

#### Onboarding Question Pattern
```
        → ProgressBar (2px, full width, fixed top)
20px   → Screen padding top
        → ← Back arrow
24px   → Gap
        → Question title (--type-hero)
8px    → Gap
        → Rationale subtitle (15px, optional)
32px   → Gap
        → Input component (varies by question)
flex   → Spacer (pushes CTA to bottom)
        → Primary CTA "Продолжить"
12px   → Gap
        → "Пропустить онбординг ⓘ" ghost
20px   → Bottom padding
```

#### Analytics Detail Pattern
```
        → ScreenHeader (back + title + optional calendar icon)
20px   → Content top padding
        → TimeRangeSelector pill
24px   → Gap
        → Chart component (primary, full width)
24px   → Gap
        → Supporting metric cards (2-column)
32px   → Section gap
        → SectionHeader + PatternInsightRow × N
32px   → Section gap
        → WeeklySummaryCard
```

### Interaction Patterns

#### List of Do's and Don'ts

**Do: Gentle entry**
New screens rise 8px into view (translateY). Takes 450ms. Feels like breath.

**Don't: Slide horizontally**
Horizontal transitions create disorientation. The product is a space, not a sequence.

**Do: Inline expansion**
Analytics pattern insights expand inline. Never modal. Context is preserved.

**Don't: Full-screen interruption**
Never interrupt the user's flow with mandatory overlays except for truly critical actions.

**Do: Soft loading**
Skeleton in place of content. Never spinner covering a screen.

**Don't: Flash of unloaded content**
Refresh: keep old content, crossfade new in. Never flash skeleton on refresh.

---

## 12. ACCESSIBILITY SYSTEM

### Core Requirements

| Requirement | Standard | Soma Implementation |
|------------|---------|-------------------|
| Text contrast | WCAG 2.1 AA (4.5:1) | Primary text: 13.2:1 |
| Touch targets | 44×44px minimum | All interactive elements |
| Focus indicators | Visible, high contrast | 2px accent ring, 2px offset |
| Screen reader | Full semantic markup | All components specified |
| Motion | prefers-reduced-motion | All animations check |
| Color alone | Never sole signal | Always paired with text/label |

### ARIA Roles by Component

```
BottomNav:           role="tablist" / role="tab" (each item)
BottomSheet:         role="dialog" aria-modal="true"
ConfirmationDialog:  role="alertdialog" aria-modal="true"
BreathingCircle:     aria-live="polite" (phase announcements)
BiorhythmRing:       role="img" aria-label with full context
MoodSlider:          role="slider" aria-valuetext={label}
SelectionChip:       role="checkbox" / role="radio" in role="group"
Toggle:              role="switch" aria-checked
ProgressBar:         role="progressbar" aria-valuenow/min/max
AIInsightCard:       no special role — standard paragraph
ProcessingAnimation: role="status" aria-live="polite"
ToastNotification:   role="status" / role="alert" (error)
ContextualTooltip:   role="tooltip" on popover
```

### Keyboard Navigation

All interactive elements must be keyboard accessible:
- Tab/Shift+Tab: focus traversal
- Enter/Space: activate buttons and checkboxes
- Arrow keys: sliders, radio groups, carousels
- Escape: close modals, sheets, tooltips, menus

### Screen Reader Priority Matrix

| Component | Priority | Implementation |
|-----------|---------|---------------|
| Biorhythm data | High | Full aria-label with value + state + unit |
| AI insights | Medium | Standard text — reads naturally |
| Decorative illustrations | None | aria-hidden="true" |
| Ambient glow animation | None | aria-hidden + prefers-reduced-motion |
| Chart visualizations | High | Adjacent text summary + "Показать таблицу" |

---

## 13. REACT/TAILWIND IMPLEMENTATION

### Project Setup

```bash
# Install dependencies
npm install inter-variable @fontsource-variable/inter
npm install framer-motion  # for complex animations
npm install class-variance-authority clsx tailwind-merge  # for component variants
```

### tailwind.config.js — Complete

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display':   ['32px', { lineHeight: '1.2',  fontWeight: '300', letterSpacing: '-0.01em' }],
        'hero':      ['28px', { lineHeight: '1.25', fontWeight: '400' }],
        'title-l':   ['22px', { lineHeight: '1.3',  fontWeight: '400' }],
        'title-m':   ['18px', { lineHeight: '1.35', fontWeight: '500' }],
        'title-s':   ['16px', { lineHeight: '1.4',  fontWeight: '500' }],
        'body-l':    ['16px', { lineHeight: '1.65', fontWeight: '400' }],
        'body-m':    ['14px', { lineHeight: '1.6',  fontWeight: '400' }],
        'body-s':    ['13px', { lineHeight: '1.55', fontWeight: '400' }],
        'label':     ['12px', { lineHeight: '1.3',  fontWeight: '500', letterSpacing: '0.04em' }],
        'micro':     ['11px', { lineHeight: '1.3',  fontWeight: '500', letterSpacing: '0.08em' }],
        'data-hero': ['52px', { lineHeight: '1.0',  fontWeight: '200', letterSpacing: '-0.02em' }],
        'data-xl':   ['36px', { lineHeight: '1.0',  fontWeight: '200', letterSpacing: '-0.02em' }],
        'data-l':    ['28px', { lineHeight: '1.1',  fontWeight: '200', letterSpacing: '-0.02em' }],
        'data-m':    ['22px', { lineHeight: '1.1',  fontWeight: '300', letterSpacing: '-0.01em' }],
      },
      fontWeight: {
        'extralight': '200',
        'light':      '300',
        'normal':     '400',
        'medium':     '500',
      },
      colors: {
        void:     '#07080F',
        deep:     '#0C0E1A',
        surface:  '#131525',
        elevated: '#1A1D30',
        border:   '#252840',
        accent: {
          DEFAULT: '#8B7CF6',
          hover:   '#A89CF8',
          press:   '#6B5FD4',
          subtle:  'rgba(139, 124, 246, 0.12)',
          glow:    'rgba(139, 124, 246, 0.25)',
          dim:     'rgba(139, 124, 246, 0.40)',
        },
        physical:     '#5BC4A0',
        emotional:    '#E891A8',
        solar:        '#F4C06A',
        lunar:        '#A8A4D8',
        text: {
          primary:   '#F2F0FA',
          secondary: '#8A8FA8',
          tertiary:  '#44495E',
        },
      },
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '5':  '20px',
        '6':  '24px',
        '8':  '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      borderRadius: {
        's':    '8px',
        'm':    '16px',
        'l':    '24px',
        'xl':   '32px',
        'full': '9999px',
      },
      transitionTimingFunction: {
        'gentle':   'cubic-bezier(0.25, 0.0, 0.0, 1.0)',
        'breath':   'cubic-bezier(0.45, 0.0, 0.55, 1.0)',
        'arrive':   'cubic-bezier(0.0,  0.0, 0.2, 1.0)',
        'depart':   'cubic-bezier(0.4,  0.0, 1.0, 1.0)',
        'complete': 'cubic-bezier(0.34, 1.2, 0.64, 1.0)',
      },
      transitionDuration: {
        'micro':     '100ms',
        'fast':      '200ms',
        'standard':  '350ms',
        'deliberate':'500ms',
        'data':      '600ms',
      },
      keyframes: {
        'ambient-glow': {
          '0%, 100%': { opacity: '0.15' },
          '50%':       { opacity: '0.30' },
        },
        'breath-expand': {
          '0%':   { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(0.9)' },
        },
        'breath-contract': {
          '0%':   { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(0.5)' },
        },
        'skeleton': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.7' },
        },
        'count-up': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'ambient-glow':      'ambient-glow 8s ease-in-out infinite',
        'breath-expand':     'breath-expand 4s cubic-bezier(0.45, 0, 0.55, 1) forwards',
        'breath-contract':   'breath-contract 6s cubic-bezier(0.45, 0, 0.55, 1) forwards',
        'skeleton':          'skeleton 1.5s ease-in-out infinite',
      },
      boxShadow: {
        'glow-s':         '0 0 12px rgba(139, 124, 246, 0.20)',
        'glow-m':         '0 0 24px rgba(139, 124, 246, 0.25)',
        'glow-l':         '0 0 48px rgba(139, 124, 246, 0.20), 0 0 16px rgba(139, 124, 246, 0.15)',
        'glow-physical':  '0 0 20px rgba(91, 196, 160, 0.25)',
        'glow-emotional': '0 0 20px rgba(232, 145, 168, 0.25)',
        'glow-solar':     '0 0 20px rgba(244, 192, 106, 0.25)',
      },
    },
  },
  plugins: [],
}
```

### Core Component Examples

#### Button Component

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-fast ease-gentle active:scale-[0.97] disabled:opacity-35 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-deep',
  {
    variants: {
      variant: {
        primary:  'w-full h-14 bg-accent text-text-primary text-title-s shadow-glow-s hover:bg-accent-hover active:bg-accent-press',
        secondary:'w-full h-14 bg-elevated border border-accent-dim text-accent text-title-s',
        ghost:    'h-11 text-text-secondary text-body-s underline-offset-4 hover:underline',
        destructive: 'w-full h-14 bg-elevated border border-emotional text-emotional text-title-s',
      },
      size: {
        default: 'h-14 px-6',
        sm:      'h-10 px-4 text-body-m',
        icon:    'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

#### Card Component

```tsx
// components/ui/Card.tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'atmospheric' | 'accent-left' | 'interactive'
  accentColor?: 'physical' | 'emotional' | 'intellectual' | 'solar'
}

export function Card({ variant = 'default', accentColor, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-l p-5',
        {
          'bg-surface border border-border':
            variant === 'default',
          'bg-surface/80 backdrop-blur-xl border border-white/[0.06]':
            variant === 'atmospheric',
          'bg-surface border border-border pl-5 border-l-2 rounded-l-none':
            variant === 'accent-left',
          'bg-surface border border-border active:scale-[0.99] transition-transform duration-micro cursor-pointer':
            variant === 'interactive',
        },
        accentColor === 'physical'     && variant === 'accent-left' && 'border-l-physical',
        accentColor === 'emotional'    && variant === 'accent-left' && 'border-l-emotional',
        accentColor === 'intellectual' && variant === 'accent-left' && 'border-l-accent',
        accentColor === 'solar'        && variant === 'accent-left' && 'border-l-solar',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

#### BiorhythmRing Component

```tsx
// components/biometrics/BiorhythmRing.tsx
'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type BiometricType = 'physical' | 'emotional' | 'intellectual' | 'solar' | 'lunar'

interface BiorhythmRingProps {
  value: number       // -100 to 100
  type: BiometricType
  size?: 'hero' | 'summary' | 'compact'
  label?: string
  animate?: boolean
}

const typeConfig: Record<BiometricType, { color: string; glow: string }> = {
  physical:     { color: '#5BC4A0', glow: 'rgba(91, 196, 160, 0.25)' },
  emotional:    { color: '#E891A8', glow: 'rgba(232, 145, 168, 0.25)' },
  intellectual: { color: '#8B7CF6', glow: 'rgba(139, 124, 246, 0.25)' },
  solar:        { color: '#F4C06A', glow: 'rgba(244, 192, 106, 0.25)' },
  lunar:        { color: '#A8A4D8', glow: 'rgba(168, 164, 216, 0.25)' },
}

const sizeConfig = {
  hero:    { diameter: 232, stroke: 3, fontSize: 'text-data-hero', labelSize: 'text-micro' },
  summary: { diameter: 92,  stroke: 2, fontSize: 'text-data-xl',   labelSize: 'text-micro' },
  compact: { diameter: 56,  stroke: 2, fontSize: 'text-data-m',    labelSize: '' },
}

export function BiorhythmRing({
  value,
  type,
  size = 'summary',
  label,
  animate = true,
}: BiorhythmRingProps) {
  const config = typeConfig[type]
  const { diameter, stroke, fontSize, labelSize } = sizeConfig[size]
  const radius = (diameter - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const normalizedValue = (Math.abs(value) / 100)
  const strokeDashoffset = circumference * (1 - normalizedValue)
  const cx = diameter / 2
  const cy = diameter / 2

  const displayValue = `${value > 0 ? '' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(1)}%`

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="img"
      aria-label={`${label || type}: ${displayValue}`}
    >
      <div
        className="relative"
        style={{
          width: diameter,
          height: diameter,
          filter: `drop-shadow(0 0 ${diameter * 0.1}px ${config.glow})`,
        }}
      >
        <svg width={diameter} height={diameter} aria-hidden="true">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="#252840"
            strokeWidth={stroke}
          />
          {/* Value arc */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: animate ? 'stroke-dashoffset 600ms cubic-bezier(0.25, 0, 0, 1)' : 'none',
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(fontSize, 'font-extralight text-text-primary tabular-nums')}>
            {displayValue}
          </span>
        </div>
      </div>
      {label && (
        <span className={cn(labelSize, 'text-text-tertiary uppercase tracking-widest')}>
          {label}
        </span>
      )}
    </div>
  )
}
```

#### Skeleton Component

```tsx
// components/ui/Skeleton.tsx
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-m bg-elevated animate-skeleton', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

// Usage: replace content during load
export function BiorhythmRingSkeleton({ size = 'summary' }: { size?: 'hero' | 'summary' }) {
  const dim = size === 'hero' ? 232 : 92
  return (
    <div className="flex flex-col items-center gap-2" aria-busy="true" aria-label="Загрузка данных">
      <Skeleton className="rounded-full" style={{ width: dim, height: dim }} />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}
```

### Utility Functions

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Biorhythm phase label
export function getBiorhythmPhase(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 80) return value > 0 ? 'Пик' : 'Низкая точка'
  if (abs >= 50) return value > 0 ? 'Высокая фаза' : 'Снижение'
  if (abs >= 20) return 'Средняя фаза'
  return 'Переходная фаза'
}

// Format biorhythm value for display
export function formatBioValue(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}
```

---

## 14. FIGMA ARCHITECTURE

### File Structure

```
Soma Design System (Library file)
├── 🎨 Foundations
│   ├── Colors        → All semantic tokens as Figma variables
│   ├── Typography    → Text styles for all 14 scale levels
│   ├── Spacing       → Auto-layout gap/padding documentation
│   └── Effects       → Glow, elevation layer styles
│
├── 🧩 Components
│   ├── Atoms         → Button, Icon, Badge, Avatar, Divider
│   ├── Molecules     → Card, Input, Chip, Toggle, ListItem
│   ├── Organisms     → BiorhythmRing, BottomNav, MoodSlider
│   └── Templates     → HomeTemplate, AnalyticsTemplate, OnboardingTemplate
│
├── 📱 Screens
│   ├── Onboarding    → Screens 1–24
│   ├── Home          → Screens 23–24
│   ├── Support       → Screens 47–48
│   ├── Analytics     → Screens 37–38, 44–45
│   ├── Breathing     → Screens 25–28
│   ├── Tea           → Screens 29–35
│   ├── Articles      → Screen 36
│   └── Profile/Settings → Screens 16–22
│
└── 📐 Grid & Layout
    ├── Mobile frame  → 375×812px
    ├── Content guide → 335px content width, 20px margins
    └── Nav overlay   → 80px bottom clearance guide
```

### Variable Naming Convention

```
Group/Token Name → Value

Background/void         → #07080F
Background/deep         → #0C0E1A
Background/surface      → #131525
Background/elevated     → #1A1D30
Background/border       → #252840

Accent/default          → #8B7CF6
Accent/hover            → #A89CF8
Accent/press            → #6B5FD4
Accent/subtle           → rgba(139, 124, 246, 0.12)

Biometrics/physical     → #5BC4A0
Biometrics/emotional    → #E891A8
Biometrics/intellectual → #8B7CF6
Biometrics/solar        → #F4C06A
Biometrics/lunar        → #A8A4D8

Text/primary            → #F2F0FA
Text/secondary          → #8A8FA8
Text/tertiary           → #44495E
```

### Component Property Guidelines

Every Figma component must have:
- `Variant` property: all visual variants
- `State` property: Default / Hover / Pressed / Selected / Disabled / Loading / Error
- `Size` property (if applicable)
- Boolean properties for optional elements (icon, subtitle, badge)
- Auto-layout throughout — no fixed frames without reason
- Detach-safe: variables and tokens used, not hardcoded values

### Effect Styles

```
Glow/Accent Small    → Drop shadow: X:0 Y:0 Blur:12 Spread:0 rgba(139,124,246,0.20)
Glow/Accent Medium   → Drop shadow: X:0 Y:0 Blur:24 Spread:0 rgba(139,124,246,0.25)
Glow/Accent Large    → Drop shadow: X:0 Y:0 Blur:48 Spread:0 rgba(139,124,246,0.20)
                       Drop shadow: X:0 Y:0 Blur:16 Spread:0 rgba(139,124,246,0.15)
Glow/Physical        → Drop shadow: X:0 Y:0 Blur:20 Spread:0 rgba(91,196,160,0.25)
Glow/Emotional       → Drop shadow: X:0 Y:0 Blur:20 Spread:0 rgba(232,145,168,0.25)
Glow/Solar           → Drop shadow: X:0 Y:0 Blur:20 Spread:0 rgba(244,192,106,0.25)

Elevation/1          → Fill: rgba(19,21,37,0.70) + Background blur: 20
Elevation/2          → Fill: rgba(26,29,48,0.85) + Background blur: 32
Elevation/3          → Fill: rgba(19,21,37,0.96) + Background blur: 40
```

---

## 15. CLAUDE DESIGN PROMPTING GUIDE

### Master System Prompt

When generating screens in Claude Design, include this context header:

```
I am designing Soma, a premium biometrics/wellness iOS app.
Design system: "Внутренний космос" (Inner cosmos).

VISUAL RULES:
- Dark background: #0C0E1A (deep) or #131525 (surface)
- Fine grain texture overlay at 4% opacity on backgrounds
- Primary accent: #8B7CF6 (violet) — used sparingly as signal
- Semantic colors: Physical=#5BC4A0 Emotional=#E891A8 Solar=#F4C06A Lunar=#A8A4D8
- Typography: Inter Variable, max weight 500, data numerals weight 200
- Data values: 36–52px, extralight, letter-spacing -0.02em
- Cards: #131525 bg, 1px #252840 border, 24px radius, 20px padding
- No harsh shadows — glow effects only (rgba(139,124,246,0.20–0.25))
- Screen margins: 20px horizontal

EMOTIONAL RULES:
- The product feels like inner space, not a dashboard
- Light = signal. Glow = data. Silence = content.
- Never use red for biorhythm lows. Low ≠ bad.
- Negative states deserve more beauty, not less
- Copy: second-person (ты), observational, never prescriptive

WHAT NOT TO DO:
- No generic wellness green
- No white backgrounds
- No heavy typography (max weight 500)
- No clinical data tables without narrative context
- No confetti or celebration animations
- No alarming red for any state
```

### Screen-Specific Prompts

#### Home Screen
```
Generate the Soma home screen.
Shows: morning greeting, 240px biorhythm ring (42% with violet glow),
3 small rings (physical/emotional/intellectual in teal/rose/violet),
state narrative (italic, 14px, "Сегодня ты можешь ощущать..."),
3-tile quick actions, resource recovery chips, tea ritual card,
3 article list items, floating quote.
Background: deep (#0C0E1A) with fine grain texture.
```

#### Biorhythm Detail
```
Generate the Soma biorhythm analytics screen.
Shows: back header "Биоритмы", time range tabs (День/Неделя/Месяц),
sinusoidal wave chart (3 curves: teal/rose/violet, no grid lines, today marker),
3 summary rings below chart, section headers with explanatory text per rhythm,
"Физический уровень" section with do/avoid chips.
Dark atmospheric throughout.
```

#### Breathing Session
```
Generate the Soma breathing session screen.
Full screen, no navigation chrome except back arrow.
Center: large circle (280px outer ring), inner circle 50% size labeled "Вдыхай",
below circle: "Вдыхай через нос 4 секунды" in body text,
bottom controls: favorite / pause / volume icons, minimal, tertiary color.
Background: void (#07080F), single violet glow emanating from circle.
Profound stillness — this is the most intimate moment in the app.
```

### Component Prompting Templates

```
# Button
Soma primary button: full-width, 56px height, fully rounded,
#8B7CF6 fill, white label text (16px/500),
subtle violet glow (0 0 24px rgba(139,124,246,0.30))

# Card
Soma standard card: #131525 background, 1px #252840 border,
24px radius, 20px internal padding, dark and quiet

# Chip (selected)
Soma selected chip: pill shape, 36px height, 16px h-padding,
rgba(139,124,246,0.12) bg, 1px #8B7CF6 border, white text 13px/500

# Section header  
Soma section header: "Что поможет сейчас" in 17px/500 white,
"Подробнее" link right-aligned in 12px #8B7CF6
```

---

## 16. IMPLEMENTATION RULES

### The Never List

```
NEVER use font-weight 600 or 700 anywhere in the product
NEVER use red (#FF0000 or similar) for biorhythm or state data
NEVER use hardcoded color values — always reference tokens
NEVER place key content below the 80px bottom nav zone
NEVER show a full-screen spinner — use skeleton in place
NEVER bounce on standard navigation (spring = completion moments only)
NEVER use more than 3–4 semantic colors on a single screen
NEVER create a one-off component — always extend the system
NEVER show AI-generated label as "AI says:" — first-person voice only
NEVER use ALL CAPS except micro-labels (11–12px with tracking)
NEVER use horizontal page transitions — always vertical
NEVER auto-advance carousels — user must control
NEVER display negative biorhythm values in alarming visual treatment
NEVER assume color alone communicates state — always pair with text
```

### The Always List

```
ALWAYS test every screen with grain texture layer active
ALWAYS verify first-viewport calm: ≤1 major data point above fold
ALWAYS provide plain-language narrative alongside every data visualization  
ALWAYS respect 20px horizontal margin on every screen state
ALWAYS include "Пропустить" / "Заполнить позже" on data-collection screens
ALWAYS make the breathing circle the most beautiful element on its screen
ALWAYS write copy in intimate second-person singular (ты)
ALWAYS check prefers-reduced-motion before any continuous animation
ALWAYS use semantic tokens, never primitive hex values in components
ALWAYS define all 9 states before shipping any interactive component
ALWAYS pair icon-only buttons with aria-label
ALWAYS keep data charts adjacent to their plain-language interpretation
```

### Token Usage Enforcement

```
✓ color: var(--text-primary)           → correct
✗ color: #F2F0FA                       → use token

✓ background: var(--color-surface)     → correct
✗ background: #131525                  → use token

✓ box-shadow: var(--glow-accent-m)     → correct
✗ box-shadow: 0 0 24px rgba(139,...)   → use token

✓ font-weight: var(--weight-extralight) → correct
✗ font-weight: 700                      → NEVER
```

### Naming Conventions

```
Components:    PascalCase          BiorhythmRing, MoodSlider
CSS variables: kebab-case          --color-accent, --text-primary
Tailwind class:kebab-case          bg-accent, text-title-m
File names:    PascalCase.tsx      BiorhythmRing.tsx
Hooks:         camelCase           useBiorhythm, useMoodLog
Tokens:        semantic/name       Background/deep, Biometrics/physical
```

---

## 17. QUALITY CHECKLIST

### Before Shipping Any Screen

**Visual Quality**
- [ ] Background texture layer is applied and visible at ~4% opacity
- [ ] First viewport: maximum 1 major data point or hero element
- [ ] Screen margins: 20px horizontal on all sides
- [ ] No more than 4 semantic colors visible simultaneously
- [ ] All data values use extralight (200) or light (300) weight
- [ ] All body copy uses regular (400) weight, ≤500 for headers
- [ ] Glow effects are present on key data elements (rings, CTAs)
- [ ] Card borders: 1px #252840, radius 24px
- [ ] Bottom nav clearance: 100px scroll padding

**Interaction Quality**
- [ ] All interactive elements: 44×44px minimum touch target
- [ ] Button press: scale(0.97), 100ms
- [ ] Page entry: Y+8px → Y0, 450ms fade+translate
- [ ] Loading states: skeleton (not spinners)
- [ ] No horizontal page transitions
- [ ] FAB press: scale(0.93)

**Content Quality**
- [ ] Copy: second-person (ты), observational not prescriptive
- [ ] Every data visualization: accompanied by plain-language interpretation
- [ ] Negative biorhythm values: displayed neutrally (no red, no alarm)
- [ ] AI content: first-person app voice, no "AI says:" labels
- [ ] Completion moments: quiet, earned (no confetti)

**Accessibility**
- [ ] All text: ≥4.5:1 contrast
- [ ] All icons: aria-hidden or aria-label
- [ ] All interactive elements: keyboard accessible
- [ ] All modals/sheets: role="dialog", focus trap, Escape closes
- [ ] Charts: adjacent text summary + "Показать таблицу" option
- [ ] Animations: prefers-reduced-motion check present

**Technical**
- [ ] No hardcoded color values in components
- [ ] All font weights ≤500
- [ ] All spacing values from --space-N scale
- [ ] All border radii from --radius-S/M/L/XL/full
- [ ] Token chain: primitive → semantic → component (no shortcuts)
- [ ] Scrollable content: 100px bottom padding

---

*Soma Design System v1.0*
*Compiled from: Product Philosophy, UX Philosophy, Emotional Principles, Visual Language, Sensory Design, Information Hierarchy, Motion Philosophy, Biometrics Visualization Philosophy, Token Strategy, Spacing, Typography, Semantic Colors, Layout, Grid, Accessibility, Component Architecture (63 components), Pattern Library, React/Tailwind Implementation, Figma Architecture, Claude Design Prompting Guide.*

