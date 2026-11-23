import { ArticleReaderScreen } from '../components/ArticleReaderScreen';
import {
  ARTICLE_PAUSES_SERIES,
  ARTICLE_PAUSES_TITLE,
  ARTICLE_PAUSES_SUBTITLE,
  ARTICLE_PAUSES_READ_TIME,
  ARTICLE_PAUSES_PAGES,
} from '../content/articlePauses';
import { useLanguage } from '../i18n/LanguageContext';

// "Паузы и восстановление" - third article of "Основы восстановления",
// brief 003. See ArticleWaterScreen.tsx/ArticleLightScreen.tsx for the
// shared-reader rationale. No real photo yet (see content/articlePauses.ts)
// - `clock` is the fallback cover icon.
export function ArticlePausesScreen({ navigation }: any) {
  const { language } = useLanguage();
  return (
    <ArticleReaderScreen
      navigation={navigation}
      content={{
        icon: 'clock',
        series: ARTICLE_PAUSES_SERIES[language],
        title: ARTICLE_PAUSES_TITLE[language],
        subtitle: ARTICLE_PAUSES_SUBTITLE[language],
        readTime: ARTICLE_PAUSES_READ_TIME[language],
        pages: ARTICLE_PAUSES_PAGES[language],
      }}
    />
  );
}
