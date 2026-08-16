import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, Easing } from 'react-native-reanimated';
import { colors, glow, gradients, fontFamily, spacing } from '../../theme';
import { StepProgressRing } from '../../components/icons/StepProgressRing';
import { ProgressRingCheckIcon } from '../../components/icons/ProgressRingCheckIcon';
import { PersonalizationIllustration } from '../../components/PersonalizationIllustration';

// "Настраиваем пространство" - the auto-advancing screen shown right after
// "Применить стиль" on Visual style / Style preview. 1:1 from Figma's 5
// "Personalization" frames (node 402:3007/3220/3455/3697/4000): 2 real 5s
// phases (step 1's circular loading ring, then step 2's), then the screen
// completes.
//
// Everything here is driven by one plain rAF loop (`time`, ms since mount) -
// not Reanimated shared values. See PersonalizationIllustration.tsx for why:
// this exact Expo Go SDK's react-native-skia/reanimated/worklets versions
// don't bridge shared-value mutations into the Skia canvas, only React
// re-renders do, so a shared-value-driven animation just sat frozen until
// the next real re-render. A plain state number that changes every frame
// via requestAnimationFrame sidesteps that entirely - ordinary React
// re-rendering always works. The step badge (StepProgressRing) reads off
// the exact same `time`-derived progress numbers so it can't drift out of
// sync with the illustration's rings.
const STEP_DURATION_MS = 5000;
// The final checkmark draws in over this long rather than popping in
// instantly (2026-08-09 review: "галочка... пусть помедленнее и поплавнее").
const CHECK_DURATION_MS = 900;
// Unthrottled (every rAF frame, ~60fps) - 2026-08-09 review: the earlier
// 20fps throttle ("plenty smooth" in theory) actually read as faint
// stutter on a slow, deliberate glide, where every dropped frame is more
// noticeable than it would be on something fast.
const TICK_MS = 0;

type Phase = 'step1' | 'step2' | 'done';
type StepState = 'pending' | 'active' | 'done';

function useAnimationClock() {
  const [time, setTime] = useState(0);
  const startRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const now = Date.now();
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      if (elapsed - lastRef.current >= TICK_MS) {
        lastRef.current = elapsed;
        setTime(elapsed);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return time;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function PersonalizationScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const time = useAnimationClock();
  const [phase, setPhase] = useState<Phase>('step1');
  const [step2StartTime, setStep2StartTime] = useState<number | null>(null);
  const [doneStartTime, setDoneStartTime] = useState<number | null>(null);

  const progress1 = phase === 'step1' ? clamp01(time / STEP_DURATION_MS) : 1;
  const progress2 =
    phase === 'done' ? 1 : phase === 'step2' && step2StartTime !== null ? clamp01((time - step2StartTime) / STEP_DURATION_MS) : 0;
  const checkProgress =
    phase === 'done' && doneStartTime !== null ? smoothstep(clamp01((time - doneStartTime) / CHECK_DURATION_MS)) : 0;

  useEffect(() => {
    if (phase === 'step1' && progress1 >= 1) {
      setPhase('step2');
      setStep2StartTime(time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress1, phase]);

  useEffect(() => {
    if (phase === 'step2' && progress2 >= 1) {
      setPhase('done');
      setDoneStartTime(time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress2, phase]);

  const step1State: StepState = phase === 'step1' ? 'active' : 'done';
  const step2State: StepState = phase === 'step1' ? 'pending' : phase === 'step2' ? 'active' : 'done';

  const title =
    phase === 'step1'
      ? 'Настраиваем твое пространство'
      : phase === 'step2'
        ? 'Анализируем первые данные'
        : 'Пространство готово!';

  const illustrationWidth = width - spacing.screenPadding * 2;

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(550).easing(Easing.inOut(Easing.cubic))}
    >
      <View style={[styles.top, { paddingTop: insets.top + 40 }]}>
        {phase === 'done' ? (
          <Svg width="100%" height={32}>
            <Defs>
              <SvgLinearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset={gradients.headingText.locations[0]} stopColor={gradients.headingText.colors[0]} />
                <Stop offset={gradients.headingText.locations[1]} stopColor={gradients.headingText.colors[1]} />
                <Stop offset={gradients.headingText.locations[2]} stopColor={gradients.headingText.colors[2]} />
              </SvgLinearGradient>
            </Defs>
            <SvgText
              x="50%"
              y="24"
              fontSize={24}
              fontFamily={fontFamily.semiBold}
              textAnchor="middle"
              fill="url(#titleGrad)"
            >
              {title}
            </SvgText>
          </Svg>
        ) : (
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {title}
          </Text>
        )}

        <View style={[styles.illustration, { width: illustrationWidth, height: (illustrationWidth * 368) / 380 }]}>
          <PersonalizationIllustration
            width={illustrationWidth}
            height={(illustrationWidth * 368) / 380}
            time={time}
            ring1Progress={progress1}
            ring2Progress={progress2}
            checkProgress={checkProgress}
          />
        </View>

        <View style={styles.steps}>
          <StepRow
            number={1}
            title="Настраиваем пространство"
            subtitle="Подбираем визуальный ритм"
            state={step1State}
            progress={progress1}
          />
          <StepRow
            number={2}
            title="Анализируем данные"
            subtitle="Обрабатываем первые данные"
            state={step2State}
            progress={progress2}
          />
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 40 }]}>
        {phase === 'done' ? (
          <Animated.View entering={FadeInDown.duration(400).easing(Easing.inOut(Easing.cubic))}>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => navigation.replace('ProfileStart')}
            >
              <Text style={styles.buttonLabel}>Продолжить</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Text style={styles.caption}>Это займет не более 10 секунд</Text>
        )}
      </View>
    </Animated.View>
  );
}

function StepRow({
  number,
  title,
  subtitle,
  state,
  progress,
}: {
  number: number;
  title: string;
  subtitle: string;
  state: StepState;
  progress: number;
}) {
  const pending = state === 'pending';
  return (
    <View style={[styles.stepRow, pending && styles.stepRowPending, state === 'active' && styles.stepRowActive]}>
      <View style={styles.stepLeft}>
        <View style={[styles.stepBadge, state !== 'pending' && styles.stepBadgeFilled]}>
          <Text style={styles.stepBadgeLabel}>{number}</Text>
        </View>
        <View style={styles.stepText}>
          {/* Fixed size, not adjustsFontSizeToFit — that let each row's
              title shrink independently based on its own text length, so
              the longer "Настраиваем пространство" ended up visibly
              smaller than "Анализируем данные" (2026-08-09 review, twice
              now: an onTextLayout-based measure-and-sync attempt didn't
              actually report the post-shrink size reliably). A single
              literal number removes the guesswork entirely - both rows
              share the same available width, so one safe value fits both. */}
          <Text style={[styles.stepTitle, pending && styles.stepTextPending]} numberOfLines={1}>
            {title}
          </Text>
          <Text
            style={[styles.stepSubtitle, pending && styles.stepTextPending]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.stepRing}>
        {state === 'active' ? <StepProgressRing progress={progress} size={38} /> : null}
        {state === 'done' ? <ProgressRingCheckIcon size={38} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  top: {
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  illustration: {
    alignSelf: 'center',
    marginTop: 20,
  },
  // 40 -> spacing.sp6 (24) (2026-08-09: "уменьшим... сколько у нас обычно
  // расстояние" - sp6/24 is this screen's own next-smaller token, and reads
  // consistent with the 20px gap already used right above between the
  // title and the illustration, instead of doubling it).
  steps: {
    marginTop: spacing.sp6,
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.violet300,
  },
  stepRowActive: {
    backgroundColor: 'rgba(139,124,246,0.23)',
  },
  // Default/upcoming state, per the kit's own .pstep-row.is-inactive /
  // .pstep-title.is-inactive rules ("возьми из кита", 2026-08-09 review) -
  // soft border-soft outline + dimmed tertiary text, not the violet300/white
  // treatment active and done rows use.
  stepRowPending: {
    borderColor: colors.borderSoft,
  },
  // 10 -> 8 (2026-08-09: "текст так лепится... не 10 а 8").
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  stepBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,124,246,0.5)',
    flexShrink: 0,
  },
  stepBadgeFilled: {
    backgroundColor: colors.violet400,
  },
  stepBadgeLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 18,
    color: colors.bg0,
  },
  stepText: {
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
  },
  // Ring/checkmark box - 38x38 to match the number badge exactly (2026-08-09
  // review: "прогресс бар... должен быть такого же размера как кружок с
  // цифрой"), explicitly sized so the SVG participates correctly in the
  // row's flex layout.
  stepRing: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // 18 -> 16, fixed (not auto-fit) - see the comment above where this is
  // used. 16 comfortably fits "Настраиваем пространство" on one line at
  // this row's available width without needing to shrink further.
  stepTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  stepSubtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  stepTextPending: {
    color: colors.textTertiary,
  },
  bottom: {
    marginTop: 'auto',
    paddingHorizontal: spacing.screenPadding,
  },
  caption: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  // Literal Figma spec for this button (60/20/28px padding) - taller and
  // more rounded than the app-wide 54/16 primary-button recipe used
  // elsewhere in onboarding, kept as its own spec rather than forced to match.
  button: {
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 28,
    backgroundColor: colors.violet400,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px ${glow.btnSoft.blur}px ${glow.btnSoft.color}`,
  },
  buttonPressed: {
    backgroundColor: colors.violet300,
    boxShadow: `0px 0px 15px ${colors.violet300}`,
    transform: [{ scale: 0.97 }],
  },
  buttonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.1,
    color: colors.bg0,
  },
});
