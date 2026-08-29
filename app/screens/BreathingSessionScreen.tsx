import { useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, glow } from '../theme';
import { BreathingOrb, ORB_TOP_OFFSET } from '../components/BreathingOrb';
import { BreathingProgress } from '../components/BreathingProgress';
import { BackIcon } from '../components/icons/BackIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { StarsBackground } from '../components/StarsBackground';

const TOTAL_CYCLES = 6;

// WF 26/27 "Breathing session" - the active practice, take 4.
//
// Sound control from the wireframe dropped deliberately, not an oversight -
// this app has no audio playback engine at all yet (no expo-av/expo-audio
// dependency, no ambient track asset) - a mute toggle with nothing to mute
// would be a fake control.
//
// Completion is cycle-based: a full 4-phase box-breath (Вдох/Задержка/
// Выдох/Задержка) repeats TOTAL_CYCLES=6 times ("я думаю наверное стоит
// повторить весь процесс 6 раз"), tracked via BreathingOrb's
// onCycleComplete/onStepChange callbacks rather than a wall-clock
// countdown - BreathingInfoScreen's duration label matches this real
// length (16s/cycle x 6 = 96s).
//
// BreathingProgress sits at the bottom of the screen now, its own flush
// strip below the controls (a `flex:1` spacer pushes it down regardless of
// screen height) - her explicit ask, 2026-08-28: "прогресс бар не лучше ли
// внизу сделать?". Was in the header next to the back button for one round
// first; the back button is back to its own standalone top-left button.
//
// Controls: a symmetric bookmark/FAB/heart row. Both side buttons are
// opaque at rest now (`colors.bg0`, not transparent) - "не надо чтобы
// звезды виднелись сквозь кнопки Сохранить и лайк" - the violet glowing
// border still reads as an outline against that solid dark disc, it just
// doesn't let the starfield show through anymore. Toggled-on state (a
// persistent saved/liked flag, not a transient press ripple) still fills
// fully violet with the icon flipping dark for contrast, matching Play's
// own dark-on-violet triangle.
export function BreathingSessionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const p = route?.params ?? {};
  const title: string = p.title ?? 'Дыхание для возвращения в тело';

  const [paused, setPaused] = useState(true);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [currentFraction, setCurrentFraction] = useState(0);

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>

      <View style={[styles.orbWrap, { marginTop: insets.top + ORB_TOP_OFFSET }]}>
        <BreathingOrb
          running={!paused}
          wrapSize={300}
          showInstruction
          onStepChange={setCurrentFraction}
          onCycleComplete={(n) => {
            setCompletedCycles(n);
            if (n >= TOTAL_CYCLES) {
              navigation.replace('BreathingComplete', { title });
            }
          }}
        />
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.outlineButton, saved && styles.outlineButtonActive]}
          onPress={() => setSaved((v) => !v)}
          hitSlop={8}
        >
          <BookmarkIcon size={18} color={saved ? colors.bg0 : colors.violet400} />
        </Pressable>
        <Pressable style={styles.fab} onPress={() => setPaused((v) => !v)} hitSlop={8}>
          {paused ? <PlayIcon size={22} color={colors.bg0} /> : <PauseIcon size={22} color={colors.bg0} />}
        </Pressable>
        <Pressable
          style={[styles.outlineButton, liked && styles.outlineButtonActive]}
          onPress={() => setLiked((v) => !v)}
          hitSlop={8}
        >
          <HeartIcon size={18} color={liked ? colors.bg0 : colors.violet400} />
        </Pressable>
      </View>

      {/* Moved down here from the header, her explicit ask 2026-08-28:
          "прогресс бар не лучше ли внизу сделать?" - a spacer absorbs
          whatever room is left so this sits flush near the bottom edge
          regardless of screen height, a plain video-player-style strip
          rather than competing with the back button up top. */}
      <View style={{ flex: 1 }} />
      <View style={[styles.progressWrap, { marginBottom: insets.bottom + 24 }]}>
        <BreathingProgress total={TOTAL_CYCLES} completedCycles={completedCycles} currentFraction={currentFraction} />
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
  progressWrap: {
    paddingHorizontal: 16,
  },
  controls: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
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
  // New outline treatment, her explicit spec 2026-08-28 - not the kit's own
  // borderless `.btn-icon` (checked: `style.css` ~L334-344 is a fully
  // transparent/borderless "bare glyph" style with only a translucent
  // press-tint, not what she described here). Opaque `colors.bg0` fill at
  // rest (not transparent) so the starfield doesn't show through the
  // circle - only the border+glow read as violet until toggled on.
  outlineButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.violet400,
    backgroundColor: colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 12px rgba(139,124,246,0.5)',
  },
  outlineButtonActive: {
    backgroundColor: colors.violet400,
  },
});
