import { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily, gradients, glow } from '../theme';
import { ResourceRing } from '../components/ResourceRing';
import { MiniRitualTile } from '../components/MiniRitualTile';
import { NavChip } from '../components/NavChip';
import { ArticleLinkRow } from '../components/ArticleLinkRow';
import { StarsBackground } from '../components/StarsBackground';

const TEA_ILLUSTRATION = require('../assets/illustrations/tea-ritual.png');

// WF "Care" (Figma node 488:438, "How to do better") - 1:1 from get_design_context
// + the kit's already-finished components (Resource Meter, Mini Ritual Tile,
// Navigation Chip, Article Link Row - all reused as-is, not redesigned).
// Originally mis-filed as HomeScreen.tsx (2026-08-17: she'd linked the wrong
// Figma node) - the real Home screen is HomeScreen.tsx, node 579:510.
//
// Side margin is a literal 16px here, not spacing.screenPadding (20) - nearly
// every node on this frame sits at x=16/17 from the frame edge, a real,
// deliberate difference from the onboarding flow's own margin, not an
// oversight (2026-08-17 review).
const SIDE_MARGIN = 16;
// Gap between the 3 Mini Ritual Tiles - her explicit spec, 2026-08-20.
const TILE_GAP = 12;

// Section-to-section gaps read directly off the Figma frame's own y deltas,
// with one adjustment: the raw gap between "Что поможет сейчас" and the chip
// row measured 108px, but that includes clearance for the Bottom Bar's own
// fixed/floating position in the flattened mockup (it's a real position:fixed
// overlay in the app, not scroll-flow content - see BottomBar.tsx) - using the
// screen's own established 60px rhythm there instead of the inflated raw
// number, consistent with condition->ring and ring->whathelpsnow (also 60).
const GAP = {
  conditionToRing: 60,
  ringToWhatHelps: 60,
  whatHelpsToChips: 60,
  chipsToTea: 132,
  teaTitleToImage: 20,
  imageToCaption: 20,
  captionToButton: 32,
  buttonToArticlesHeader: 60,
  articlesHeaderToList: 20,
};

export function CareScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  // Same star background as HomeScreen, same technique/reasoning (2026-08-20:
  // "звёздный фон добавь так же как в Home") - grow-only so it doesn't
  // re-stretch/"move" if this screen's own content height ever changes
  // (see HomeScreen.tsx's own comment on this exact bug for the full story).
  const [contentHeight, setContentHeight] = useState(0);
  // 3 tiles + 2×12px gaps + 2×16px side margins, derived from the real
  // screen width instead of MiniRitualTile's own literal 116 - that only
  // held on the Figma reference width, overflowed on a narrower real
  // device ("Медитация" wrapped, the 3rd tile ran off-screen, 2026-08-20:
  // "они у тебя не помещаются на экране... надо чтобы между ними было по
  // 12 пикселей, и как обычно паддинг слева и справа по 16").
  const tileWidth = (screenWidth - SIDE_MARGIN * 2 - TILE_GAP * 2) / 3;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(_w, h) => setContentHeight((prev) => Math.max(prev, h))}
      >
        <StarsBackground width={screenWidth} height={contentHeight} />

        <View style={styles.content}>
          <View style={styles.condition}>
          {/* Settings matched to HomeScreen's own "Доброе утро" heading
              (GreetingHeading: fontSize 28, fontFamily.bold) - was 36/
              semiBold, her explicit ask 2026-08-20 ("заголовок сделай по
              настройкам такой же как и на главном"). Y-positions/height
              scaled down proportionally (28/36) from the original tuned
              values, this title stays its own fixed 2-line SvgText split
              (not HomeScreen's real-measured-wrap technique) since it's a
              known fixed string, not a variable-length name. */}
          <Svg width="100%" height={56}>
            <Defs>
              <SvgLinearGradient id="conditionGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
                <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
                <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
              </SvgLinearGradient>
            </Defs>
            <SvgText x="0" y="26" fontSize={28} fontFamily={fontFamily.bold} fill="url(#conditionGrad)">
              Твое состояние
            </SvgText>
            <SvgText x="0" y="54" fontSize={28} fontFamily={fontFamily.bold} fill="url(#conditionGrad)">
              сегодня изменчиво
            </SvgText>
          </Svg>
          <Text style={styles.subtitle}>Дай себе мягкое восстановление</Text>
        </View>

        <View style={{ marginTop: GAP.conditionToRing }}>
          <ResourceRing value={42} caption="Низкий ресурс" />
        </View>

        <View style={[styles.whatHelps, { marginTop: GAP.ringToWhatHelps }]}>
          {/* Scoped to just this title, not the shared sectionTitle (which
              "Чай как ритуал"/"О теле и ритмах" still use unchanged) - her
              explicit ask, 2026-08-20: 24px SemiBold, not the shared 26px
              ExtraBold. */}
          <Text style={[styles.sectionTitle, styles.whatHelpsTitle]}>Что поможет сейчас</Text>
          <View style={styles.tilesRow}>
            <MiniRitualTile width={tileWidth} icon="breathingCircle" title="Дыхание" time="3 мин" />
            <MiniRitualTile width={tileWidth} icon="seaWaves" title="Звуки природы" time="10 мин" iconMarginBottom={26} />
            <MiniRitualTile width={tileWidth} icon="lotus" title="Медитация" time="10 мин" />
          </View>
        </View>

        <View style={[styles.chipsRow, { marginTop: GAP.whatHelpsToChips }]}>
          <NavChip icon="breathingCircle" label="Дыхание" />
          <NavChip icon="largeTree" label="Звуки природы" />
          <NavChip icon="meditationFigure" label="Медитации" />
          <NavChip icon="pegasus" label="Сказки" />
          <NavChip icon="cello" label="Успокаивающая музыка" />
        </View>

        <View style={[styles.section, { marginTop: GAP.chipsToTea }]}>
          <Text style={styles.sectionTitle}>Чай как ритуал</Text>
          <Image source={TEA_ILLUSTRATION} style={[styles.teaImage, { marginTop: GAP.teaTitleToImage }]} resizeMode="contain" />
          <Text style={[styles.teaCaption, { marginTop: GAP.imageToCaption }]}>Наполни тело теплом{'\n'}через простой ритуал</Text>
          <Pressable style={[styles.teaButton, { marginTop: GAP.captionToButton }]}>
            <Text style={styles.teaButtonLabel}>Начать чайную церемонию</Text>
          </Pressable>
        </View>

        <View style={[styles.section, { marginTop: GAP.buttonToArticlesHeader }]}>
          <Text style={styles.sectionTitle}>О теле и ритмах</Text>
          <Text style={styles.sectionDesc}>Небольшие статьи о том, что ежедневно влияет на наше состояние</Text>
          <View style={[styles.articlesList, { marginTop: GAP.articlesHeaderToList }]}>
            <ArticleLinkRow icon="water" title="Вода как основа баланса" subtitle="Коротко о том, как тело сигнализирует о жажде" />
            <ArticleLinkRow icon="moonSymbol" title="Свет и внутренние часы" subtitle="Почему освещение влияет на энергию и сон" />
            <ArticleLinkRow icon="battery" title="Паузы и восстановление" subtitle="Как короткий отдых помогает нервной системе" />
            <Pressable>
              <Text style={styles.allArticles}>Все статьи</Text>
            </Pressable>
          </View>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  content: {
    paddingHorizontal: SIDE_MARGIN,
  },
  condition: {
    gap: 12,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    lineHeight: 18 * 1.1,
    color: colors.textPrimary,
  },
  whatHelps: {},
  sectionTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: 26,
    lineHeight: 26 * 1.1,
    color: colors.textPrimary,
  },
  // "Что поможет сейчас" only - 24px SemiBold, not the shared 26px
  // ExtraBold (2026-08-20).
  whatHelpsTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 24 * 1.1,
  },
  sectionDesc: {
    marginTop: 8,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: colors.textPrimary,
  },
  tilesRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
  },
  section: {},
  teaImage: {
    alignSelf: 'center',
    width: 193,
    height: 360,
  },
  teaCaption: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  teaButton: {
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  teaButtonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.bg0,
  },
  articlesList: {
    gap: 12,
  },
  allArticles: {
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#E0DBFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
