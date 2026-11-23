import { ArticleReaderScreen } from '../components/ArticleReaderScreen';
import {
  ARTICLE_WATER_SERIES,
  ARTICLE_WATER_TITLE,
  ARTICLE_WATER_SUBTITLE,
  ARTICLE_WATER_READ_TIME,
  ARTICLE_WATER_PAGES,
} from '../content/articleWater';
import { useLanguage } from '../i18n/LanguageContext';

const WATER_IMAGE = require('../assets/articles/water.jpg');

// "Вода как основа баланса" - first article of the "Основы восстановления"
// series (WF, her full text, 2026-09-16; format/pagination decided the same
// day - see decisions.md). This screen used to carry the whole swipe-reader
// implementation itself; as of 2026-11-23 (brief 003) that body moved to
// components/ArticleReaderScreen.tsx, generic over its content, so the two
// newly-added articles ("Свет и внутренние часы", "Паузы и восстановление")
// don't need their own 500-line copies. This file is now just that reader
// fed Water's own content + its real photo - nothing about Water's own
// rendered output changed in the extraction.
export function ArticleWaterScreen({ navigation }: any) {
  const { language } = useLanguage();
  return (
    <ArticleReaderScreen
      navigation={navigation}
      content={{
        image: WATER_IMAGE,
        series: ARTICLE_WATER_SERIES[language],
        title: ARTICLE_WATER_TITLE[language],
        subtitle: ARTICLE_WATER_SUBTITLE[language],
        readTime: ARTICLE_WATER_READ_TIME[language],
        pages: ARTICLE_WATER_PAGES[language],
      }}
    />
  );
}
