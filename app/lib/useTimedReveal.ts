import { useEffect, useRef, useState } from 'react';

// Shared pacing engine for the two new unvoiced, text-only practice
// screens (MeditationSessionScreen's one-line-at-a-time crossfade,
// StoryReaderScreen's stacking reveal) - brief 003. Since neither screen
// has audio to set its own tempo, each advances its own text on a plain
// JS timer instead, at a pace the caller computes per-sentence (reading
// speed, not a fixed interval) via `delayForIndex`.
//
// Simplification, stated plainly rather than silently: pausing mid-wait
// and resuming restarts that one sentence's own delay from the top,
// rather than resuming the exact remaining ms. For a calm, approximate
// reading pace (not a precise countdown the person is meant to race) this
// reads as "a small extra breath after unpausing", not as a bug - tracking
// exact remaining time would need its own timestamp bookkeeping for a
// difference nobody reading slowly would notice.
export function useTimedReveal(count: number, delayForIndex: (index: number) => number, paused: boolean) {
  // Starts at 1, not 0 - the first sentence is on screen immediately when
  // the session opens, nothing to wait for before showing it.
  const [revealed, setRevealed] = useState(count > 0 ? 1 : 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused || revealed >= count) return;
    const delay = delayForIndex(revealed);
    timeoutRef.current = setTimeout(() => setRevealed((n) => n + 1), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, paused, count]);

  return { revealed, finished: revealed >= count };
}

// Comfortable, unhurried reading pace (not a scientific WPM figure, just
// evened out against a stopwatch against her own existing sentence
// lengths in content/meditations.ts/content/stories.ts) - ~210 ms/word
// plus a flat settle time so even a 2-word sentence doesn't flash by.
export function estimateReadMs(sentence: string, { minMs = 2200, maxMs = 9000, settleMs = 900, msPerWord = 210 } = {}): number {
  const words = sentence.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(maxMs, Math.max(minMs, words * msPerWord + settleMs));
}
