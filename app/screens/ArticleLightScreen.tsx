import { ArticleReaderScreen } from '../components/ArticleReaderScreen';
import {
  ARTICLE_LIGHT_SERIES,
  ARTICLE_LIGHT_TITLE,
  ARTICLE_LIGHT_SUBTITLE,
  ARTICLE_LIGHT_READ_TIME,
  ARTICLE_LIGHT_PAGES,
} from '../content/articleLight';
import { useLanguage } from '../i18n/LanguageContext';

// "Свет и внутренние часы" - second article of "Основы восстановления",
// brief 003. Was a broken route (Care already listed this article, no
// screen existed behind it - docs/state/briefs/003) - see
// ArticleWaterScreen.tsx for why this is a thin wrapper, not its own copy
// of the reader. No real photo yet for this topic (see
// content/articleLight.ts) - `sun` is the fallback cover icon.
export function ArticleLightScreen({ navigation }: any) {
  const { language } = useLanguage();
  return (
    <ArticleReaderScreen
      navigation={navigation}
      content={{
        icon: 'sun',
        series: ARTICLE_LIGHT_SERIES[language],
        title: ARTICLE_LIGHT_TITLE[language],
        subtitle: ARTICLE_LIGHT_SUBTITLE[language],
        readTime: ARTICLE_LIGHT_READ_TIME[language],
        pages: ARTICLE_LIGHT_PAGES[language],
      }}
    />
  );
}
