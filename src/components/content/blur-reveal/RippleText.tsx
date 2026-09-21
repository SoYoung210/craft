'use client';

import { type Ref, useImperativeHandle, useRef } from 'react';

import { cn } from '@/utils/cn';

import { prefersReducedMotion } from './useIntroTimeline';

export type RippleHandle = { play: () => void };

const DURATION = 520;
const STAGGER = 40;
const SINE = 'cubic-bezier(0.37, 0, 0.63, 1)';
const WAVE: Keyframe[] = [
  {
    offset: 0,
    transform: 'translateY(0) rotate(0deg) scale(1)',
    easing: SINE,
  },
  {
    offset: 0.24,
    transform: 'translateY(0.12em) rotate(5deg) scale(0.98)',
    easing: SINE,
  },
  {
    offset: 0.42,
    transform: 'translateY(-0.12em) rotate(-7deg) scale(1.08)',
    easing: SINE,
  },
  {
    offset: 0.56,
    transform: 'translateY(-0.36em) rotate(0deg) scale(1.16)',
    easing: SINE,
  },
  {
    offset: 0.72,
    transform: 'translateY(-0.08em) rotate(6deg) scale(1.04)',
    easing: SINE,
  },
  {
    offset: 0.86,
    transform: 'translateY(0.03em) rotate(1deg) scale(1)',
    easing: SINE,
  },
  { offset: 1, transform: 'translateY(0) rotate(0deg) scale(1)' },
];

function split(text: string): string[] {
  return text.split(/(?:)/u);
}

export default function RippleText({
  text,
  ref,
  className,
}: {
  text: string;
  ref?: Ref<RippleHandle>;
  className?: string;
}) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const playing = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      play() {
        if (playing.current || prefersReducedMotion()) return;
        const targets = split(text).flatMap((char, index) => {
          const element = letters.current[index];
          return element && char !== ' ' ? [{ element, index }] : [];
        });
        const first = targets[0];
        if (!first || typeof first.element.animate !== 'function') return;
        playing.current = true;
        const animations = targets.map(({ element, index }) =>
          element.animate(WAVE, {
            duration: DURATION,
            delay: STAGGER * index,
          })
        );
        Promise.allSettled(
          animations.map(animation => animation.finished)
        ).then(() => {
          playing.current = false;
        });
      },
    }),
    [text]
  );

  return (
    <span className={cn('inline-block whitespace-pre', className)}>
      <span aria-hidden className="inline-block">
        {split(text).map((char, index) => (
          <span
            key={index}
            ref={element => {
              letters.current[index] = element;
            }}
            className="inline-block [transform-origin:50%_80%]"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
