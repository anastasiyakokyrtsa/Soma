// "Свет и внутренние часы" - second article in the "Основы восстановления"
// series (after "Вода", content/articleWater.ts). Brief 003 / decisions.md
// 2026-11-21/22 #6: content for both this and articlePauses.ts arrived
// already fully translated for both languages (RU first, EN via the
// english-editor agent pass), not drafted here - same model
// (content/articleWater.ts's ArticleBlock union + per-language Record), so
// it plugs straight into the shared components/ArticleReaderScreen.tsx
// reader without inventing a new content shape.
//
// No real photograph exists for this topic (unlike Water's licensed/owned
// water.jpg) - ArticleReaderScreen falls back to an icon-on-gradient cover
// when no `image` is passed (see that file's own comment), rather than this
// screen faking a placeholder photo.
import type { Language } from '../i18n/LanguageContext';
import type { ArticlePage } from './articleWater';
import { ARTICLE_WATER_SERIES } from './articleWater';

// Same series as Water - re-exported under its own name here instead of a
// second "Основы восстановления"/"Foundations of Recovery" string pair
// living in two places that could drift out of sync.
export const ARTICLE_LIGHT_SERIES = ARTICLE_WATER_SERIES;

export const ARTICLE_LIGHT_TITLE: Record<Language, string> = {
  ru: 'Свет\nи внутренние\nчасы',
  en: 'Light\nand the body\'s\ninternal clock',
};
export const ARTICLE_LIGHT_SUBTITLE: Record<Language, string> = {
  ru: 'Почему освещение влияет на энергию и сон',
  en: 'Why light affects your energy and sleep',
};
export const ARTICLE_LIGHT_READ_TIME: Record<Language, string> = {
  ru: '4 минуты чтения',
  en: '4 min read',
};

const h = (text: string): ArticlePage['blocks'][number] => ({ type: 'heading', text });
const sh = (text: string): ArticlePage['blocks'][number] => ({ type: 'subheading', text });
const p = (text: string): ArticlePage['blocks'][number] => ({ type: 'paragraph', text });
const bullets = (items: string[]): ArticlePage['blocks'][number] => ({ type: 'bullets', items });
const link = (text: string): ArticlePage['blocks'][number] => ({ type: 'link', text });

export const ARTICLE_LIGHT_PAGES: Record<Language, ArticlePage[]> = {
  ru: [
    {
      blocks: [
        p(
          'Мы часто виним усталость в недосыпе, забывая, что свет вокруг нас — один из главных переключателей, которые говорят телу, когда быть бодрым, а когда готовиться ко сну.',
        ),
      ],
    },
    {
      blocks: [
        h('Почему свет — это не просто освещение'),
        p(
          'Внутри тела есть циркадные часы — внутренний ритм примерно в сутки, который управляет не только сном, но и температурой тела, выработкой гормонов и даже концентрацией внимания. Главный сигнал, по которому эти часы сверяются с реальным временем суток, — свет, попадающий в глаза. Искусственное освещение появилось совсем недавно по меркам эволюции, и тело всё ещё ждёт от света более простых и однозначных сигналов, чем те, что даёт нам городской вечер.',
        ),
      ],
    },
    {
      blocks: [
        h('Как свет влияет на самочувствие'),
        p(
          'Яркий свет утром помогает быстрее проснуться по-настоящему, а не только формально открыть глаза. Тусклый, тёплый свет вечером, наоборот, готовит тело ко сну — снижает выработку кортизола и позволяет вовремя начать вырабатываться мелатонину. Когда вечером долго горит холодный яркий свет (в том числе экраны), тело получает сигнал «ещё день» — и заснуть становится труднее, даже если очень устал.',
        ),
      ],
    },
    {
      blocks: [
        h('Слушай своё тело'),
        p('Универсальные рекомендации по количеству люкс или точному времени редко работают одинаково для всех — важнее наблюдать за собой:'),
        bullets([
          'получается ли легко проснуться утром или тело будто «застревает»',
          'не клонит ли в сон слишком рано вечером при ярком освещении',
          'как меняется состояние в пасмурные дни без яркого солнца',
        ]),
      ],
    },
    {
      blocks: [
        h('Небольшая практика'),
        sh('Ритуал утреннего света.'),
        p(
          'В первые 15–20 минут после пробуждения постарайся оказаться при естественном свете — у окна или на улице, без солнцезащитных очков. Не нужно смотреть прямо на солнце, достаточно находиться в светлом пространстве несколько минут.',
        ),
      ],
    },
    {
      blocks: [
        p('Обрати внимание:'),
        bullets([
          'насколько ярче кажется свет по сравнению с комнатой',
          'как меняется ощущение бодрости в последующий час',
          'отличается ли это ощущение в разные дни',
        ]),
        p('Иногда самый простой способ помочь своему ритму — не сложная техника, а несколько минут у окна, пока ещё не начался день.'),
        link('Все статьи'),
      ],
    },
  ],
  en: [
    {
      blocks: [
        p(
          "We often blame tiredness on not sleeping enough, without noticing that the light around us is one of the main switches telling the body when to be alert and when to start winding down for sleep.",
        ),
      ],
    },
    {
      blocks: [
        h('Why light is more than just light'),
        p(
          "The body runs on circadian clocks, an internal rhythm of roughly a day that governs not just sleep but body temperature, hormone production, and even attention. The main signal these clocks use to check themselves against the real time of day is light reaching the eyes. Artificial lighting is a very recent arrival in evolutionary terms, and the body still expects simpler, more clear-cut signals from light than what a city evening actually gives it.",
        ),
      ],
    },
    {
      blocks: [
        h('How light affects how you feel'),
        p(
          "Bright light in the morning helps you wake up for real, not just open your eyes. Dim, warm light in the evening does the opposite: it prepares the body for sleep, lowering cortisol and letting melatonin start rising on schedule. When cool, bright light stays on late into the evening, screens included, the body reads it as still daytime, and falling asleep gets harder even when you're exhausted.",
        ),
      ],
    },
    {
      blocks: [
        h('Listen to your body'),
        p('General advice about exact lux levels or timing rarely works the same way for everyone. It helps more to notice your own patterns:'),
        bullets([
          'whether you wake up easily in the morning or your body feels stuck',
          'whether bright light in the evening still leaves you feeling sleepy earlier than expected',
          'how your mood and energy shift on overcast days without strong sunlight',
        ]),
      ],
    },
    {
      blocks: [
        h('A small practice'),
        sh('A morning light ritual'),
        p(
          "Try to get some natural light within the first 15 to 20 minutes after waking: by a window or outside, without sunglasses. You don't need to look directly at the sun. A few minutes in a bright space is enough.",
        ),
      ],
    },
    {
      blocks: [
        p('Notice:'),
        bullets([
          'how much brighter it feels compared to being indoors',
          'how your alertness shifts over the next hour',
          'whether that feeling differs from day to day',
        ]),
        p("Sometimes the simplest way to support your rhythm isn't a technique at all. It's a few minutes by the window before the day really begins."),
        link('All articles'),
      ],
    },
  ],
};
