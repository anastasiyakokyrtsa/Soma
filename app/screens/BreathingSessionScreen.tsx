import { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { colors, glow } from '../theme';
import { BreathingOrb, ORB_TOP_OFFSET } from '../components/BreathingOrb';
import { BreathingProgress } from '../components/BreathingProgress';
import { BackIcon } from '../components/icons/BackIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { SoundIcon } from '../components/icons/SoundIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { StarsBackground } from '../components/StarsBackground';

const TOTAL_CYCLES = 6;

// 2026-09-05: она хочет спокойную медитативную фоновую мелодию во время
// сессии. Реального аудиофайла в проекте пока нет (см. чат) - `require()` с
// несуществующим путём валит бандл Metro сразу при сборке, поэтому источник
// держим `null`, пока файл не появится. Как включить:
// 1. Положить лицензионный/её собственный зацикливаемый трек (mp3/m4a) в
//    app/assets/audio/breathing-ambient.mp3
// 2. Заменить строку ниже на:
//    const AMBIENT_SOUND = require('../assets/audio/breathing-ambient.mp3');
const AMBIENT_SOUND: number | null = null;

// BookmarkIcon's glyph is taller than wide; SoundIcon renders as a fixed
// square footprint - matching that square to Bookmark's real rendered
// height is what reads as "same size" side by side (2026-09-06: "сделай
// его по высоте таким же как значок Сохранить").
const BOOKMARK_SIZE = 18;
const SOUND_ICON_SIZE = BOOKMARK_SIZE * (47.24 / 36.24);

// WF 26/27 "Breathing session" - the active practice, take 4.
//
// Sound control: the like/heart button was a straight duplicate of the
// bookmark button (both just toggled a persisted flag, no functional
// difference) - 2026-09-05, she caught this and asked to replace it with a
// real mute toggle for the new ambient track. Wired to expo-audio; see
// AMBIENT_SOUND above for why it's a no-op until a real audio file is added.
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
  const [muted, setMuted] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [currentFraction, setCurrentFraction] = useState(0);

  const player = useAudioPlayer(AMBIENT_SOUND);
  useEffect(() => {
    if (!AMBIENT_SOUND) return;
    player.loop = true;
  }, [player]);
  useEffect(() => {
    if (!AMBIENT_SOUND) return;
    if (!paused && !muted) player.play();
    else player.pause();
  }, [paused, muted, player]);

  return (
    // Единый fade-in вход по всему приложению (2026-09-06: "на всех
    // экранах должен быть такой переход для единообразия") - см. HomeScreen.
    <Animated.View style={styles.container} entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}>
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
          <BookmarkIcon size={BOOKMARK_SIZE} color={saved ? colors.bg0 : colors.violet400} />
        </Pressable>
        <Pressable style={styles.fab} onPress={() => setPaused((v) => !v)} hitSlop={8}>
          {paused ? <PlayIcon size={22} color={colors.bg0} /> : <PauseIcon size={22} color={colors.bg0} />}
        </Pressable>
        {/* Та же "заливка в негатив" при переключении, что у Save - её
            явный ask 2026-09-06: "мне нравится [как ведёт себя Save],
            надо также с иконкой Звук сделать". */}
        <Pressable
          style={[styles.outlineButton, muted && styles.outlineButtonActive]}
          onPress={() => setMuted((v) => !v)}
          hitSlop={8}
        >
          {/* Оба SVG-канваса и заполнение глифа внутри проверены математически
              равными (см. чат 2026-09-06) - тёмная заливка на сиреневом фоне
              оптически читается мельче/тоньше, чем сиреневая на тёмном (тот
              же эффект, из-за которого dark-on-light текст в типографике
              делают чуть крупнее для равного визуального веса). Небольшая
              компенсация размера только в замьюченном состоянии. */}
          <SoundIcon size={muted ? SOUND_ICON_SIZE * 1.07 : SOUND_ICON_SIZE} muted={muted} color={muted ? colors.bg0 : colors.violet400} />
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
    </Animated.View>
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
