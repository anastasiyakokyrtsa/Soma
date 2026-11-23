// "Паузы и восстановление" - third article in the "Основы восстановления"
// series. See content/articleLight.ts's own comment for the shared model
// and the icon-on-gradient fallback cover (no real photo exists for this
// topic either).
import type { Language } from '../i18n/LanguageContext';
import type { ArticlePage } from './articleWater';
import { ARTICLE_WATER_SERIES } from './articleWater';

export const ARTICLE_PAUSES_SERIES = ARTICLE_WATER_SERIES;

export const ARTICLE_PAUSES_TITLE: Record<Language, string> = {
  ru: 'Паузы\nи восстановление',
  en: 'Pauses\nand recovery',
};
export const ARTICLE_PAUSES_SUBTITLE: Record<Language, string> = {
  ru: 'Как короткий отдых помогает нервной системе',
  en: 'How a short rest helps your nervous system',
};
export const ARTICLE_PAUSES_READ_TIME: Record<Language, string> = {
  ru: '4 минуты чтения',
  en: '4 min read',
};

const h = (text: string): ArticlePage['blocks'][number] => ({ type: 'heading', text });
const sh = (text: string): ArticlePage['blocks'][number] => ({ type: 'subheading', text });
const p = (text: string): ArticlePage['blocks'][number] => ({ type: 'paragraph', text });
const bullets = (items: string[]): ArticlePage['blocks'][number] => ({ type: 'bullets', items });
const link = (text: string): ArticlePage['blocks'][number] => ({ type: 'link', text });

export const ARTICLE_PAUSES_PAGES: Record<Language, ArticlePage[]> = {
  ru: [
    {
      blocks: [
        p(
          'Мы часто планируем отдых как что-то большое — отпуск, выходные, — и пропускаем маленькие паузы в течение дня, хотя именно они не дают напряжению накапливаться.',
        ),
      ],
    },
    {
      blocks: [
        h('Почему пауза — это не потеря времени'),
        p(
          'Нервная система работает циклично: периоды концентрации и активности естественным образом сменяются периодами спада, обычно каждые 90–120 минут. Если игнорировать эти сигналы и продолжать давить на концентрацию через усилие, восстановление всё равно наступит — только позже и в более резкой форме: раздражительностью, рассеянностью или внезапной усталостью.',
        ),
      ],
    },
    {
      blocks: [
        h('Как короткий отдых влияет на самочувствие'),
        p(
          'Даже пауза в несколько минут — без экрана, без новой задачи — позволяет нервной системе снизить уровень возбуждения и вернуться к работе с более свежим вниманием. Это не то же самое, что смена деятельности (например, переключение с одной задачи на другую в телефоне): для настоящего восстановления телу нужна именно пауза, а не просто другой источник стимуляции.',
        ),
      ],
    },
    {
      blocks: [
        h('Слушай своё тело'),
        p('Признаки, что пауза уже нужна, часто появляются раньше, чем мы готовы их заметить:'),
        bullets([
          'мысли начинают перечитывать один и тот же абзац по кругу',
          'растёт раздражение на мелочи, которые обычно не задевают',
          'появляется желание отвлечься на что угодно, лишь бы не на задачу',
        ]),
      ],
    },
    {
      blocks: [
        h('Небольшая практика'),
        sh('Пауза без цели.'),
        p(
          'Один раз в течение дня остановись на 2–3 минуты, ничего не делая специально: не бери телефон, не начинай новую задачу. Можно просто сидеть, смотреть в окно или закрыть глаза.',
        ),
      ],
    },
    {
      blocks: [
        p('Обрати внимание:'),
        bullets([
          'как быстро появляется желание чем-то себя занять',
          'что происходит с дыханием, если дать ему замедлиться',
          'легче ли вернуться к задаче после такой паузы',
        ]),
        p('Пауза без цели непривычна именно потому, что мы разучились ничего не делать — но иногда телу нужно ровно это.'),
        link('Все статьи'),
      ],
    },
  ],
  en: [
    {
      blocks: [
        p(
          "We often think of rest as something big: a vacation, a weekend off. We skip the small pauses during the day, even though those are exactly what keeps tension from building up.",
        ),
      ],
    },
    {
      blocks: [
        h("Why a pause isn't wasted time"),
        p(
          'The nervous system works in cycles. Periods of focus and activity are naturally followed by periods of low energy, usually every 90 to 120 minutes. If you ignore those signals and keep pushing your concentration through sheer effort, the body still forces a break eventually. It just shows up later and rougher: as irritability, scattered attention, or sudden exhaustion.',
        ),
      ],
    },
    {
      blocks: [
        h('How a short rest affects how you feel'),
        p(
          "Even a pause of a few minutes, no screen, no new task, lets the nervous system settle and lets you come back to your work with a clearer head. That's different from switching activities, like moving from one task to another on your phone. Real recovery needs an actual pause, not just a different source of stimulation.",
        ),
      ],
    },
    {
      blocks: [
        h('Listen to your body'),
        p("The signs that you need a pause often show up before you're ready to notice them:"),
        bullets([
          'you catch yourself rereading the same paragraph over and over',
          "small things start to irritate you that normally wouldn't",
          'you feel the urge to get distracted by anything other than the task at hand',
        ]),
      ],
    },
    {
      blocks: [
        h('A small practice'),
        sh('A pause with no purpose'),
        p(
          "At some point during the day, stop for 2 to 3 minutes and don't deliberately do anything: don't pick up your phone, don't start a new task. You can just sit, look out the window, or close your eyes.",
        ),
      ],
    },
    {
      blocks: [
        p('Notice:'),
        bullets([
          'how quickly the urge to occupy yourself shows up',
          'what happens to your breathing if you let it slow down',
          "whether it's easier to return to the task after a pause like this",
        ]),
        p("A pause with no purpose feels unfamiliar because we've lost the habit of doing nothing. But sometimes that's exactly what the body needs."),
        link('All articles'),
      ],
    },
  ],
};
