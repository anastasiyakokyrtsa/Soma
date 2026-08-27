import { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, glow } from '../theme';
import { BreathingOrb, ORB_TOP_OFFSET } from '../components/BreathingOrb';
import { BackIcon } from '../components/icons/BackIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { StarsBackground } from '../components/StarsBackground';

// WF 26/27 "Breathing session" - the active practice. Total session length
// comes from BreathingInfoScreen's params (default 3 min if opened
// directly, e.g. from DevMenu); the orb's own 12-second box-breathing cycle
// just keeps looping underneath regardless of how many full cycles that
// duration actually contains - real box breathing doesn't need to end on a
// clean cycle boundary to feel complete.
//
// Sound control from the wireframe dropped deliberately, not an oversight -
// this app has no audio playback engine at all yet (no expo-av/expo-audio
// dependency, no ambient track asset) - a mute toggle with nothing to mute
// would be a fake control. Bookmark (reusing QuoteCard's own "Сохранить"
// icon/interaction language, not a new heart/favorite concept) + pause/play
// is the honest control set for what this screen actually does today.
//
// Take 2, her direct feedback: (1) starts paused now (kit's own reference
// behavior - "Готов?"/"Нажми play" until pressed, matches "вначале должно
// быть состояние Плей, а при нажатии должна начаться анимация"); (2) orb
// pinned to the same ORB_TOP_OFFSET every breathing screen shares, not
// centered in leftover flex space (see BreathingOrb.tsx); (3) the whole
// layout rebuilt as one tight top-down composition (orb -> instruction ->
// controls, fixed gaps) instead of the orb floating up top with controls
// stranded at the very bottom via a `flex:1` spacer - "все элементы как-то
// расхлябано разбросаны"; (4) the controls row itself rebuilt around
// absolute-centering the FAB rather than a 3-slot flex row with an
// invisible spacer trying to fake symmetry - "панель... не полная, и все
// кривое искаженное".
export function BreathingSessionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const p = route?.params ?? {};
  const title: string = p.title ?? 'Дыхание для возвращения в тело';
  const durationMs: number = p.durationMs ?? 3 * 60 * 1000;

  const [paused, setPaused] = useState(true);
  const [saved, setSaved] = useState(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      elapsedRef.current += 1000;
      if (elapsedRef.current >= durationMs) {
        navigation.replace('BreathingComplete', { title });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, durationMs, navigation, title]);

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={[styles.orbWrap, { marginTop: insets.top + ORB_TOP_OFFSET }]}>
        <BreathingOrb running={!paused} wrapSize={300} showInstruction />
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.fab} onPress={() => setPaused((v) => !v)} hitSlop={8}>
          {paused ? <PlayIcon size={22} color={colors.bg0} /> : <PauseIcon size={22} color={colors.bg0} />}
        </Pressable>
        {/* Absolutely positioned relative to the FAB's own center, not a
            3rd flex slot balanced against an invisible spacer - guarantees
            the FAB stays exactly centered regardless of the bookmark. */}
        <Pressable style={styles.bookmarkButton} onPress={() => setSaved((v) => !v)} hitSlop={8}>
          <BookmarkIcon size={20} color={saved ? colors.violet400 : colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrap: {
    alignItems: 'center',
  },
  controls: {
    marginTop: 56,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btn.blur}px ${glow.btn.color}`,
  },
  // left:'50%' anchors this box's own LEFT edge to screen-center; marginLeft
  // then pulls that edge back by (half the FAB's width + the gap between
  // them + this box's own full width) so the box's right edge lands exactly
  // `gap` px left of the FAB's left edge, centered on the FAB vertically.
  bookmarkButton: {
    position: 'absolute',
    left: '50%',
    top: 10,
    width: 44,
    height: 44,
    marginLeft: -(32 + 28 + 44),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
