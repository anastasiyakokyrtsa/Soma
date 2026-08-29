// ============ SIDEBAR ACTIVE LINK ============
const navLinks = document.querySelectorAll('.kit-nav-link');
const sections = [...document.querySelectorAll('.kit-section')];
const setActiveLink = () => {
  let current = sections[0]?.id;
  for (const s of sections) {
    if (s.getBoundingClientRect().top - 90 <= 0) current = s.id;
  }
  navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + current));
};
document.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// ============ SPACING SCALE (generated) ============
const spaceScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
const spaceRows = document.getElementById('space-rows');
spaceScale.forEach(v => {
  const row = document.createElement('div');
  row.className = 'space-row';
  row.innerHTML = `<span class="space-label">${v}px</span><span class="space-bar" style="width:${v * 3}px"></span>`;
  spaceRows.appendChild(row);
});

// ============ ICON GRID (generated, grouped) ============
// Gradient — colorful illustrative icons (single state)
const iconsGradient = [
  ['weightlifting', 'Weightlifting'], ['brain', 'Brain'], ['trust', 'Trust'], ['lotus', 'Lotus'],
  ['idea', 'Idea'], ['pegasus', 'Pegasus'], ['sea-waves', 'Sea Waves'], ['circle', 'Circle'],
  ['water', 'Water'], ['moon-symbol', 'Moon'], ['sleep', 'Sleep'], ['windy-weather', 'Weather'],
  ['large-tree', 'Large Tree'], ['meditation', 'Meditation'], ['cello', 'Cello'], ['spoon', 'Spoon'],
  ['camping-kettle', 'Kettle'], ['delivery-time', 'Time'], ['pulse', 'Pulse'], ['broom', 'Broom'],
  ['battery', 'Battery'], ['decentralized-network', 'Network'], ['sun', 'Sun'],
];
// Outline — plain white UI/action icons, single state
const iconsOutlineSingle = [
  ['forward-arrow', 'Forward Arrow'], ['info', 'Info'], ['done', 'Done'],
];
// Toggle — two-state icons (default outline + selected/active), shown as pairs
const iconsToggle = [
  ['go-back', 'Go Back'], ['forward', 'Forward'], ['next-page', 'Next Page'], ['previous-page', 'Previous Page'],
  ['expand-arrow', 'Expand'], ['collapse-arrow', 'Collapse'],
  ['close', 'Close'], ['bookmark', 'Bookmark'], ['favorite', 'Favorite'],
  ['play', 'Play'], ['audio', 'Audio'],
  ['profile', 'Profile'], ['calendar-14', 'Calendar'], ['progress-circle', 'Progress'],
];
// Status — flat semantic colors
const iconsStatus = [
  ['dos', 'Dos'], ['donts', "Don'ts"],
];
// Navigation bar — bottom tab icons, default + active
const iconsNav = [
  ['home', 'Home'], ['care', 'Care'], ['journal', 'Journal'], ['analytics-tab', 'Analytics'], ['fab-toggle', 'FAB'],
];

const iconGrid = document.getElementById('icon-grid');
iconsGradient.forEach(([file, label]) => {
  const cell = document.createElement('div');
  cell.innerHTML = `<div class="icon-tile"><img src="assets/icons-clean/${file}.svg" alt=""></div><div class="icon-tile-label">${label}</div>`;
  iconGrid.appendChild(cell);
});

const iconGridOutline = document.getElementById('icon-grid-outline');
iconsOutlineSingle.forEach(([file, label]) => {
  const cell = document.createElement('div');
  cell.innerHTML = `<div class="icon-tile"><img src="assets/icons-clean/${file}.svg" alt=""></div><div class="icon-tile-label">${label}</div>`;
  iconGridOutline.appendChild(cell);
});

const iconGridToggle = document.getElementById('icon-grid-toggle');
iconsToggle.forEach(([file, label]) => {
  const cell = document.createElement('div');
  cell.className = 'icon-pair-cell';
  cell.innerHTML = `
    <div class="icon-pair-wrap">
      <div class="icon-tile"><img src="assets/icons-clean/${file}.svg" alt=""></div>
      <div class="icon-tile is-alt"><img src="assets/icons-clean/${file}-alt.svg" alt=""></div>
    </div>
    <div class="icon-tile-label">${label}</div>`;
  iconGridToggle.appendChild(cell);
});

const iconGridStatus = document.getElementById('icon-grid-status');
iconsStatus.forEach(([file, label]) => {
  const cell = document.createElement('div');
  cell.innerHTML = `<div class="icon-tile"><img src="assets/icons-clean/${file}.svg" alt=""></div><div class="icon-tile-label">${label}</div>`;
  iconGridStatus.appendChild(cell);
});

const iconGridNav = document.getElementById('icon-grid-nav');
iconsNav.forEach(([file, label]) => {
  const cell = document.createElement('div');
  cell.className = 'icon-pair-cell';
  cell.innerHTML = `
    <div class="icon-pair-wrap">
      <div class="icon-tile"><img src="assets/icons-clean/${file}.svg" alt=""></div>
      <div class="icon-tile is-alt"><img src="assets/icons-clean/${file}-alt.svg" alt=""></div>
    </div>
    <div class="icon-tile-label">${label}</div>`;
  iconGridNav.appendChild(cell);
});

// ============ GENERIC TOGGLE HELPERS ============
document.querySelectorAll('[data-toggle-switch]').forEach(el => {
  el.addEventListener('click', () => {
    if (el.classList.contains('is-disabled')) return;
    el.classList.toggle('is-on');
  });
});

document.querySelectorAll('[data-toggle-check]').forEach(el => {
  el.addEventListener('click', () => {
    if (el.classList.contains('is-disabled')) return;
    el.classList.toggle('is-checked');
  });
});

document.querySelectorAll('[data-radio-group]').forEach(group => {
  group.querySelectorAll('[data-toggle-radio]').forEach(radio => {
    radio.addEventListener('click', () => {
      group.querySelectorAll('[data-toggle-radio]').forEach(r => r.classList.remove('is-checked'));
      radio.classList.add('is-checked');
    });
  });
});

// Expandable Choice Card — like the radio group above, but clicking the
// already-open card closes it again (the RN version's "tap to deselect").
document.querySelectorAll('[data-accordion-group]').forEach(group => {
  group.querySelectorAll('[data-accordion-item]').forEach(item => {
    item.addEventListener('click', () => {
      const wasExpanded = item.classList.contains('is-expanded');
      group.querySelectorAll('[data-accordion-item]').forEach(i => i.classList.remove('is-expanded'));
      if (!wasExpanded) item.classList.add('is-expanded');
    });
  });
});

// ============ SEGMENTED CONTROL ============
function initSegmented(root) {
  const thumb = root.querySelector('.segmented-thumb');
  const buttons = [...root.querySelectorAll('button')];
  const move = () => {
    const btn = root.querySelector('button.is-active');
    thumb.style.width = btn.offsetWidth + 'px';
    thumb.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
  };
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    move();
  }));
  window.addEventListener('resize', move);
  requestAnimationFrame(move);
}
document.querySelectorAll('.segmented').forEach(initSegmented);

// ============ DATE WHEEL PICKER ============
// Ported from app/components/DateWheelPicker.tsx (WF17) — real native
// scroll-snap here instead of the app's Reanimated-driven per-row
// opacity/scale, but the same 44px row height / 5 visible rows and the
// same "true-center row reads full strength" idea (toggled via
// .is-center on scroll instead of an interpolated style).
(function initDateWheelPickers() {
  const ROW_HEIGHT = 44;
  const VISIBLE_ROWS = 5;
  const PAD = ROW_HEIGHT * ((VISIBLE_ROWS - 1) / 2);
  const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const YEARS = Array.from({ length: 2015 - 1940 + 1 }, (_, i) => String(1940 + i));
  // Same default as the app's own ProfileDateOfBirthScreen (14 июня 1995).
  const COLUMNS = {
    day: { list: DAYS, index: 13 },
    month: { list: MONTHS, index: 5 },
    year: { list: YEARS, index: 55 },
  };

  document.querySelectorAll('[data-wheel]').forEach((col) => {
    const { list, index } = COLUMNS[col.dataset.wheel];
    col.style.paddingTop = PAD + 'px';
    col.style.paddingBottom = PAD + 'px';
    list.forEach((label) => {
      const row = document.createElement('div');
      row.className = 'wheel-row';
      row.textContent = label;
      col.appendChild(row);
    });
    const rows = [...col.children];
    const updateCenter = () => {
      const centerIndex = Math.round(col.scrollTop / ROW_HEIGHT);
      rows.forEach((row, i) => row.classList.toggle('is-center', i === centerIndex));
    };
    col.addEventListener('scroll', updateCenter, { passive: true });
    col.scrollTop = index * ROW_HEIGHT;
    updateCenter();
  });
})();

// ============ BOTTOM NAV ============
const bottomNav = document.getElementById('bottomNav');
if (bottomNav) {
  // sync icon-default/icon-active with whichever tab is marked is-active in the markup —
  // the click handler below only swaps on interaction, so the initial page-load state needs this too.
  bottomNav.querySelectorAll('.bottombar-item').forEach(i => {
    const active = i.classList.contains('is-active');
    i.querySelector('.icon-default').style.display = active ? 'none' : '';
    i.querySelector('.icon-active').style.display = active ? '' : 'none';
  });
  bottomNav.querySelectorAll('.bottombar-item').forEach(item => {
    item.addEventListener('click', () => {
      bottomNav.querySelectorAll('.bottombar-item').forEach(i => {
        i.classList.remove('is-active');
        i.querySelector('.icon-default').style.display = '';
        i.querySelector('.icon-active').style.display = 'none';
      });
      item.classList.add('is-active');
      item.querySelector('.icon-default').style.display = 'none';
      item.querySelector('.icon-active').style.display = '';
    });
  });
  const fab = bottomNav.querySelector('.bottombar-fab');
  fab?.addEventListener('click', () => {
    fab.classList.toggle('is-open');
    bottomNav.classList.toggle('is-fab-open');
  });
}

// ============ GENERIC DOTS ============
const dotsDemo = document.getElementById('dotsDemo');
dotsDemo?.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    dotsDemo.querySelectorAll('.dot').forEach(d => d.classList.remove('is-active'));
    dot.classList.add('is-active');
  });
});

// ============ PROGRESS RING ANIMATION ============
window.addEventListener('load', () => {
  document.querySelectorAll('.ring-anim').forEach(ring => {
    const target = ring.getAttribute('stroke-dashoffset');
    ring.style.strokeDashoffset = ring.getAttribute('stroke-dasharray');
    ring.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)';
    requestAnimationFrame(() => requestAnimationFrame(() => { ring.style.strokeDashoffset = target; }));
  });
});


// ============ MOOD SCALE ============
const moodData = [
  { label: 'Ужасно', img: 'picture-mood-scala-very-bad.png' },
  { label: 'Плохо', img: 'picture-mood-scala-bad.png' },
  { label: 'Нейтрально', img: 'picture-mood-scala-neutral.png' },
  { label: 'Хорошо', img: 'picture-mood-scala-good.png' },
  { label: 'Отлично', img: 'picture-mood-scala-very-good.png' },
];
const moodLabels = document.querySelectorAll('.mood-labels span');
const moodTitle = document.getElementById('moodTitle');
const moodIllustration = document.getElementById('moodIllustration');
const moodFill = document.getElementById('moodFill');
const moodThumb = document.getElementById('moodThumb');
const moodTrackEl = document.getElementById('moodTrack');

function setMood(index) {
  moodLabels.forEach((l, i) => l.classList.toggle('is-active', i === index));
  moodTitle.textContent = moodData[index].label;
  moodIllustration.src = 'assets/mood/' + moodData[index].img;
  // the fill/thumb reach the true edges of the line at the first/last mood (0% / 100%),
  // evenly spread in between — matching where the icons/labels are centred.
  const pct = (index / (moodData.length - 1)) * 100;
  // 8px floor so the left tail always shows violet, never plain gray, even
  // at index 0 where the literal fill would otherwise be 0 width (2026-08-20,
  // ported from the app's MoodScale.tsx MIN_FILL_WIDTH) — needs a real px
  // width (not %) to floor against, so measure the track directly.
  const trackWidth = moodTrackEl.getBoundingClientRect().width;
  moodFill.style.width = Math.max((pct / 100) * trackWidth, 8) + 'px';
  moodThumb.style.left = pct + '%';
}

// draggable: click or drag anywhere on the track, snaps to the nearest of the 5 stops
function moodIndexFromClientX(clientX) {
  const rect = moodTrackEl.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return Math.round(ratio * (moodData.length - 1));
}
let moodDragging = false;
function moodDragMove(e) {
  if (!moodDragging) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  setMood(moodIndexFromClientX(clientX));
}
function moodDragEnd() {
  moodDragging = false;
  window.removeEventListener('pointermove', moodDragMove);
  window.removeEventListener('pointerup', moodDragEnd);
}
moodTrackEl.addEventListener('pointerdown', e => {
  moodDragging = true;
  moodDragMove(e);
  window.addEventListener('pointermove', moodDragMove);
  window.addEventListener('pointerup', moodDragEnd);
});

setMood(3);

// ============ BREATHING SESSION ============
const breathOrb = document.getElementById('breathOrb');
const breathPhase = document.getElementById('breathPhase');
const breathTimer = document.getElementById('breathTimer');
const breathPlay = document.getElementById('breathPlay');
const breathPlayIcon = document.getElementById('breathPlayIcon');

// 5 effect presets, transcribed straight from the Figma panels (blur/opacity per inset/drop shadow),
// each paired with its own orb diameter. Levels A→D are the inhale ramp (140→180→220→260px);
// E is the hold's overshoot peak (300px); hold alternates E↔D, exhale mirrors the inhale ramp back
// down to A, and the "rest" state before pressing play is also A (bookends the cycle).
const BREATH_LEVELS = {
  A: { size: 140, shadow: 'inset 0 0 24px rgba(139,124,246,.4), inset 0 0 192px rgba(139,124,246,.1), 0 0 80px rgba(139,124,246,.2)' },
  B: { size: 180, shadow: 'inset 0 0 110px rgba(139,124,246,.5), inset 0 0 30px rgba(139,124,246,.4), 0 0 80px rgba(139,124,246,.3)' },
  C: { size: 220, shadow: 'inset 0 0 150px rgba(139,124,246,.7), inset 0 0 40px rgba(139,124,246,.5), 0 0 80px rgba(139,124,246,.4)' },
  D: { size: 260, shadow: 'inset 0 0 220px rgba(139,124,246,1), inset 0 0 50px rgba(139,124,246,.7), 0 0 90px rgba(139,124,246,.6)' },
  E: { size: 300, shadow: 'inset 0 0 250px rgba(139,124,246,1), inset 0 0 50px rgba(139,124,246,.7), 0 0 90px rgba(139,124,246,.7)' },
};
// one step per second, 16 steps total (4 phases x 4-3-2-1s) — real box
// breathing holds on BOTH full and empty lungs. Was 12 (Вдох/Задержка/
// Выдох only, straight back into the next inhale with no post-exhale
// hold) - a real gap in this recipe, caught porting it to the app
// (2026-08-28: "перед новым вдохом тоже была задержка на 4 сек"). The
// second hold is held flat at level A (resting size - lungs are empty,
// unlike the post-inhale hold which peaks at E/D since they're full).
const breathSteps = [
  { name: 'Вдох', sec: 4, level: 'A' },
  { name: 'Вдох', sec: 3, level: 'B' },
  { name: 'Вдох', sec: 2, level: 'C' },
  { name: 'Вдох', sec: 1, level: 'D' },
  { name: 'Задержка', sec: 4, level: 'E' },
  { name: 'Задержка', sec: 3, level: 'D' },
  { name: 'Задержка', sec: 2, level: 'E' },
  { name: 'Задержка', sec: 1, level: 'D' },
  { name: 'Выдох', sec: 4, level: 'D' },
  { name: 'Выдох', sec: 3, level: 'C' },
  { name: 'Выдох', sec: 2, level: 'B' },
  { name: 'Выдох', sec: 1, level: 'A' },
  { name: 'Задержка', sec: 4, level: 'A' },
  { name: 'Задержка', sec: 3, level: 'A' },
  { name: 'Задержка', sec: 2, level: 'A' },
  { name: 'Задержка', sec: 1, level: 'A' },
];
let breathRunning = false;
let breathStepIndex = 0;
let breathInterval = null;

function applyStep(i) {
  const step = breathSteps[i];
  const level = BREATH_LEVELS[step.level];
  breathPhase.textContent = step.name;
  breathTimer.textContent = step.sec + ' сек';
  breathOrb.style.width = level.size + 'px';
  breathOrb.style.height = level.size + 'px';
  breathOrb.style.boxShadow = level.shadow;
}

function tick() {
  breathStepIndex = (breathStepIndex + 1) % breathSteps.length;
  applyStep(breathStepIndex);
}

breathPlay?.addEventListener('click', () => {
  breathRunning = !breathRunning;
  breathPlayIcon.classList.toggle('is-pause', breathRunning);
  if (breathRunning) {
    breathStepIndex = 0;
    applyStep(breathStepIndex);
    breathInterval = setInterval(tick, 1000);
  } else {
    clearInterval(breathInterval);
    breathOrb.style.width = BREATH_LEVELS.A.size + 'px';
    breathOrb.style.height = BREATH_LEVELS.A.size + 'px';
    breathOrb.style.boxShadow = BREATH_LEVELS.A.shadow;
    breathPhase.textContent = 'Готов?';
    breathTimer.textContent = 'Нажми play';
  }
});
