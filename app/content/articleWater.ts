// "Вода как основа баланса" — первая статья серии "Основы восстановления"
// (счётчик "N/9" на экране — номер страницы внутри этой статьи; серия сама
// по себе отдельная, более крупная сущность, не путать с ней). Полный
// текст — от владельца, 2026-09-16. Разбивка на 9 страниц (было 12 при
// строгом "абзац-два на экран", сжато до 9 без склеивания разных
// заголовков-разделов на одном экране) — согласовано с ней в том же
// разговоре, где решили формат: свайп-сторис, а не вертикальный скролл
// (её сознательный выбор поверх рекомендации ux-architect/ui-designer,
// которые предлагали непрерывный скролл для длинной прозы).
//
// English translation (2026-11-21, via the english-editor agent): natural
// essay-register English, not a literal line-for-line translation - some
// sentences are re-flowed for English rhythm while keeping the same meaning
// and calm tone. See i18n/project memory for the full translation pass.
import type { Language } from '../i18n/LanguageContext';

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'link'; text: string };

export type ArticlePage = { blocks: ArticleBlock[] };

export const ARTICLE_WATER_SERIES: Record<Language, string> = {
  ru: 'Основы восстановления',
  en: 'Foundations of Recovery',
};
export const ARTICLE_WATER_TITLE: Record<Language, string> = {
  ru: 'Вода\nкак основа\nбаланса',
  en: 'Water\nas the foundation\nof balance',
};
export const ARTICLE_WATER_SUBTITLE: Record<Language, string> = {
  ru: 'Почему вода — не просто часть жизни, а ключевой элемент нашего здоровья, энергии и внутреннего равновесия.',
  en: "Water is more than something we drink. It's central to our health, energy, and inner balance.",
};
export const ARTICLE_WATER_READ_TIME: Record<Language, string> = {
  ru: '5 минут чтения',
  en: '5 min read',
};

const h = (text: string): ArticleBlock => ({ type: 'heading', text });
const sh = (text: string): ArticleBlock => ({ type: 'subheading', text });
const p = (text: string): ArticleBlock => ({ type: 'paragraph', text });
const bullets = (items: string[]): ArticleBlock => ({ type: 'bullets', items });
const link = (text: string): ArticleBlock => ({ type: 'link', text });

export const ARTICLE_WATER_PAGES: Record<Language, ArticlePage[]> = {
  ru: [
    {
      // First block was h(...) (big/bold heading treatment) - her ask,
      // 2026-10-07: "вот то что у тебя как заголовок, сделай просто
      // текстом" - just a plain paragraph like the two below it, no special
      // size/weight.
      blocks: [
        p('Мы часто ищем сложные решения, не замечая базовых потребностей тела.'),
        p('Вода — один из самых простых способов мягко поддержать состояние в течение дня.'),
        p(
          'Мы часто воспринимаем воду как нечто само собой разумеющееся. Однако с точки зрения физиологии, водный баланс напрямую связан с работой нервной системы, уровнем энергии и способностью концентрироваться.',
        ),
      ],
    },
    {
      blocks: [
        p('Исследования показывают, что даже небольшое обезвоживание может отражаться на внимании, настроении и субъективном ощущении усталости.'),
        p('Тело реагирует на дефицит жидкости как на мягкий стрессор — активируются механизмы напряжения, которые мы не всегда осознаём.'),
      ],
    },
    {
      blocks: [
        h('Как вода влияет на самочувствие'),
        p(
          'Вода участвует в большинстве процессов в организме: от транспорта питательных веществ до регуляции температуры тела. Для нервной системы это особенно важно — стабильная гидратация поддерживает передачу нервных импульсов и работу когнитивных функций.',
        ),
      ],
    },
    {
      blocks: [
        p('Когда воды не хватает, человек может ощущать:'),
        bullets(['снижение концентрации', 'быструю утомляемость', 'раздражительность или внутреннее напряжение']),
        p('Эти сигналы не всегда считываются как жажда, поэтому легко остаются без внимания.'),
      ],
    },
    {
      blocks: [
        h('Слушай своё тело'),
        p(
          'В рекомендациях часто фигурируют универсальные цифры, однако потребность в воде индивидуальна и зависит от множества факторов: активности, температуры, гормонального фона, фазы цикла и общего состояния. Гораздо устойчивее работает другой подход — регулярность и наблюдение за ощущениями. Небольшие глотки воды в течение дня поддерживают внутренний баланс мягче, чем редкое и обильное питьё.',
        ),
      ],
    },
    {
      blocks: [
        h('Вода как способ вернуться в тело'),
        p('Помимо физиологического эффекта, у воды есть ещё одно важное свойство — она помогает переключить внимание с внешнего на внутреннее.'),
        p('Медленное питьё, ощущение температуры и вкуса создают короткую паузу. Такая пауза даёт нервной системе сигнал безопасности и может снизить уровень фонового напряжения.'),
      ],
    },
    {
      blocks: [
        h('Небольшая практика'),
        sh('Ритуал осознанного питья'),
        p('Сделайте несколько медленных глотков воды.'),
        p('Обратите внимание:'),
        bullets(['на температуру', 'на ощущение во рту и горле', 'на дыхание в этот момент']),
      ],
    },
    {
      blocks: [
        p('Не нужно ничего менять или контролировать. Достаточно заметить ощущения.'),
        p('Даже такая короткая практика может помочь телу немного «выдохнуть».'),
        p(
          'Иногда поддержка начинается не с сложных техник, а с возвращения к базовым потребностям. Вода — один из самых простых и доступных способов напомнить телу, что о нём заботятся.',
        ),
        link('Все статьи'),
      ],
    },
  ],
  en: [
    {
      blocks: [
        p("We often look for complicated solutions and overlook the body's most basic needs."),
        p('Water is one of the simplest ways to gently support how you feel throughout the day.'),
        p(
          'We tend to take water for granted. But physiologically, your water balance is directly tied to your nervous system, your energy, and your ability to concentrate.',
        ),
      ],
    },
    {
      blocks: [
        p('Research shows that even mild dehydration can affect attention, mood, and how tired you feel.'),
        p("The body treats a lack of fluids as a mild stressor, switching on tension responses we don't always notice."),
      ],
    },
    {
      blocks: [
        h('How water affects how you feel'),
        p(
          'Water is involved in almost everything your body does, from carrying nutrients to regulating your temperature. It matters especially for the nervous system, where steady hydration supports nerve signaling and cognitive function.',
        ),
      ],
    },
    {
      blocks: [
        p("When you're not getting enough water, you might notice:"),
        bullets(['trouble concentrating', 'tiring more easily', 'irritability or inner tension']),
        p("These signals don't always register as thirst, which is why they're easy to miss."),
      ],
    },
    {
      blocks: [
        h('Listen to your body'),
        p(
          "You'll often see a one-size-fits-all number in advice columns, but how much water you need is personal, depending on your activity level, the temperature, your hormones, where you are in your cycle, and how you're feeling overall. A steadier approach works better: drink regularly and notice how you feel. Small sips through the day support your inner balance more gently than drinking a lot all at once.",
        ),
      ],
    },
    {
      blocks: [
        h('Water as a way back into your body'),
        p('Beyond its physiological effects, water has another quality worth noticing. It helps shift your focus from the outside world back to yourself.'),
        p('Drinking slowly, noticing the temperature and the taste, creates a brief pause. That pause signals safety to your nervous system and can ease background tension.'),
      ],
    },
    {
      blocks: [
        h('A small practice'),
        sh('A ritual of mindful drinking'),
        p('Take a few slow sips of water.'),
        p('Notice:'),
        bullets(['the temperature', 'how it feels in your mouth and throat', 'your breath in that moment']),
      ],
    },
    {
      blocks: [
        p('There’s nothing to change or control. Just notice what you feel.'),
        p('Even a practice this short can help your body "exhale" a little.'),
        p(
          "Sometimes support isn't about complicated techniques. It starts with returning to basic needs. Water is one of the simplest, most accessible ways to remind your body that it's being taken care of.",
        ),
        link('All articles'),
      ],
    },
  ],
};
