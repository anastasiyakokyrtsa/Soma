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

// WF 26/27 "Breathing session" - the active practice, take 3.
//
// Sound control from the wireframe dropped deliberately, not an oversight -
// this app has no audio playback engine at all yet (no expo-av/expo-audio
// dependency, no ambient track asset) - a mute toggle with nothing to mute
// would be a fake control.
//
// This round's changes, all her direct feedback 2026-08-28:
//  - Completion is now cycle-based, not time-based: a full 4-phase box-
//    breath (Вдох/Задержка/Выдох/Задержка) repeats TOTAL_CYCLES=6 times
//    ("я думаю наверное стоит повторить весь процесс 6 раз"), tracked via
//    BreathingOrb's onCycleComplete callback rather than a wall-clock
//    countdown. `durationMs`/route param is gone - BreathingInfoScreen's own
//    duration label was updated to match this new real length (16s/cycle x
//    6 = 96s) instead of the old fixed "3 минуты".
//  - Progress shown via BreathingProgress (see that file for why a dot row,
//    not a ring around the orb).
//  - Controls rebuilt as a symmetric 3-icon row: Bookmark - Play/Pause FAB -
//    Heart (like) - "кнопка лайк у тебя отсутствует, сделай по такому же
//    принципу как и Сохранить". Both side buttons use a new outline style
//    (transparent fill, glowing violet border, icon tinted violet) that
//    fills solid violet (icon flips dark) once toggled on - her explicit
//    spec: "сделать окантовку сиреневую и светящуюся... при нажатии пусть
//    полностью окрашивается в фиолетовый". This is a new button treatment,
//    not literally the kit's own `.btn-icon` (a borderless bare-glyph style
//    with only a translucent press-tint) - built to her precise description
//    instead of forcing the existing kit class to fit; worth folding back
//    into the kit later if she wants to keep it.
//  - Because two real, equal-weight buttons now flank the FAB, the row goes
//    back to a plain centered flex row - no longer needs the absolute-
//    positioning trick the previous single-bookmark-plus-ghost-spacer
//    layout required to fake symmetry.
export function BreathingSessionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const p = route?.params ?? {};
  const title: string = p.title ?? 'Дыхание для возвращения в тело';

  const [paused, setPaused] = useState(true);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  return (
    <View style={styles.container}>
      <StarsBackground width={screenWidth} height={screenHeight} />
      <Pressable style={[styles.backButton, { top: insets.top + 16 }]} onPress={() => navigation.goBack()} hitSlop={8}>
        <BackIcon />
      </Pressable>
      <View style={[styles.progressWrap, { top: insets.top + 16 }]}>
        <BreathingProgress total={TOTAL_CYCLES} completed={completedCycles} />
      </View>

      <View style={[styles.orbWrap, { marginTop: insets.top + ORB_TOP_OFFSET }]}>
        <BreathingOrb
          running={!paused}
          wrapSize={300}
          showInstruction
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
  progressWrap: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    height: 40,
    justifyContent: 'center',
  },
  orbWrap: {
    alignItems: 'center',
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
  // borderless `.btn-icon` (see the top-of-file comment).
  outlineButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.violet400,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 12px rgba(139,124,246,0.5)',
  },
  outlineButtonActive: {
    backgroundColor: colors.violet400,
  },
});
