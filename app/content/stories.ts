// 3 unvoiced bedtime stories - brief 003 / decisions.md 2026-11-21/22 #6
// ("сказки на ночь (3 истории, БЕЗ озвучки - новый формат медленно
// проявляющегося и гаснущего текста, не постраничный свайп)"). Same
// precomputed-`sentences`-array reasoning as content/meditations.ts.
import type { Language } from '../i18n/LanguageContext';
import type { GradientIconName } from '../components/icons/GradientIcon';

export type StoryId = 'houseByTheSea' | 'lighthouseKeeper' | 'gardenNoOneLookedFor';

export type Story = {
  id: StoryId;
  icon: GradientIconName;
  title: Record<Language, string>;
  readTime: Record<Language, string>;
  sentences: Record<Language, string[]>;
};

export const STORIES: Story[] = [
  {
    id: 'houseByTheSea',
    icon: 'moonSymbol',
    title: { ru: 'Дом у моря', en: 'The House by the Sea' },
    readTime: { ru: '8 минут чтения', en: '8 min read' },
    sentences: {
      ru: [
        'В маленьком доме на самом краю берега жила женщина, которая каждый вечер зажигала одну свечу на подоконнике — не для того, чтобы кого-то встретить, а просто потому что так дом казался теплее.',
        'Море за окном не торопилось: волна набегала, отступала, снова набегала — ровно, без спешки, как будто у него было очень много времени и совсем некуда его тратить.',
        'По вечерам женщина садилась в старое кресло, слушала, как скрипят половицы от ветра, и ни о чём не думала — просто позволяла дню закончиться так же неспешно, как заканчивается волна на песке.',
        'Свеча догорала медленно.',
        'Дом постепенно затихал.',
        'И где-то между шумом моря и мягким светом свечи наступал тот самый момент, когда думать больше не нужно — можно просто быть здесь, в тепле, и слушать, как дышит море за окном.',
      ],
      en: [
        'In a small house at the very edge of the shore lived a woman who lit a single candle on the windowsill every evening.',
        'Not to welcome anyone, just because it made the house feel warmer.',
        'The sea outside never hurried.',
        'A wave would roll in, pull back, roll in again, steady and unhurried, as if it had all the time in the world and nothing in particular to spend it on.',
        'In the evenings the woman would sit in an old armchair, listen to the floorboards creak in the wind, and think about nothing in particular, just let the day end as slowly as a wave settling on the sand.',
        'The candle burned down slowly.',
        'The house grew quiet.',
        "And somewhere between the sound of the sea and the soft candlelight came that moment when there's nothing left to think about, when you can simply be there, warm, listening to the sea breathe outside the window.",
      ],
    },
  },
  {
    id: 'lighthouseKeeper',
    icon: 'moonSymbol',
    title: { ru: 'Хранитель маяка', en: 'The Lighthouse Keeper' },
    readTime: { ru: '10 минут чтения', en: '10 min read' },
    sentences: {
      ru: [
        'На дальнем мысе стоял маяк, и человек, который в нём жил, каждую ночь поднимался по винтовой лестнице, чтобы проверить огонь.',
        'Ступеней было много, но он не считал их — просто шёл, неторопливо, чувствуя под рукой холодный, гладкий камень перил.',
        'Наверху всегда было тихо, только ветер да редкий крик чайки где-то далеко внизу.',
        'Он садился у окна и смотрел, как луч огня медленно поворачивается над тёмной водой — раз, другой, третий — освещая на мгновение волны и снова уходя в темноту.',
        'Ему нравилось это повторяющееся движение, в нём не было ничего внезапного.',
        'Корабли где-то там, за горизонтом, ориентировались по этому свету и знали: здесь безопасно, здесь можно плыть дальше.',
        'А он просто сидел, смотрел на медленный поворот луча и чувствовал, как вместе с ним успокаивается и его собственное дыхание.',
      ],
      en: [
        'On a distant headland stood a lighthouse, and the man who lived there climbed the spiral staircase every night to check the light.',
        'There were many steps, but he never counted them, just walked, slow and steady, feeling the cold, smooth stone of the railing under his hand.',
        'It was always quiet up there, only the wind and, now and then, the cry of a gull somewhere far below.',
        'He would sit by the window and watch the beam of light slowly turn above the dark water, once, twice, three times, lighting up the waves for a moment before sinking back into darkness.',
        'He liked this repeating movement.',
        'Nothing about it was sudden.',
        'Ships somewhere out there, beyond the horizon, found their way by this light and knew it was safe to keep going.',
        'And he would just sit, watching the slow turn of the beam, feeling his own breathing grow calmer along with it.',
      ],
    },
  },
  {
    id: 'gardenNoOneLookedFor',
    icon: 'moonSymbol',
    title: { ru: 'Сад, который никто не искал', en: 'The Garden No One Looked For' },
    readTime: { ru: '7 минут чтения', en: '7 min read' },
    sentences: {
      ru: [
        'За старой каменной стеной, о которой мало кто помнил, рос сад.',
        'В него никто специально не приходил — просто иногда, гуляя, кто-нибудь замечал приоткрытую калитку и заглядывал внутрь.',
        'Там ничего не требовало внимания: яблоня росла себе, как хотела, трава была высокой в одних местах и низкой в других, а в углу, у самой стены, тихо шумел маленький фонтан — вода стекала по камню, ровно, без пауз, снова и снова.',
        'Никто не подстригал этот сад по расписанию и не решал, каким ему быть.',
        'Он просто жил в своём собственном темпе, и от этого в нём было особенно спокойно — не нужно было ничего успевать, ничего доказывать, только сидеть на тёплом камне у фонтана и слушать, как вода находит свой путь вниз, капля за каплей, без спешки.',
      ],
      en: [
        'Behind an old stone wall that few people remembered, there was a garden.',
        'No one came there on purpose, it was more that every once in a while, someone out walking would notice the gate standing slightly open and look inside.',
        'Nothing in there asked for attention.',
        'The apple tree grew however it wanted, the grass was tall in some places and short in others, and in the corner, right by the wall, a small fountain ran quietly, water sliding over the stone, steady, without pausing, again and again.',
        "No one trimmed this garden on a schedule or decided what it should be.",
        'It simply lived at its own pace, and that was exactly what made it so peaceful.',
        'There was nothing to keep up with, nothing to prove, only the warm stone by the fountain to sit on and the water finding its way down, drop by drop, without hurry.',
      ],
    },
  },
];
