'use client';

import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react';

export const EASE_SMOOTH_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const EASE_IN_OUT_STRONG = 'cubic-bezier(0.77, 0, 0.175, 1)';

export function springEasing(
  stiffness: number,
  damping: number,
  mass: number,
  seconds: number,
  stops: number
): string {
  if (
    typeof CSS === 'undefined' ||
    !CSS.supports('animation-timing-function', 'linear(0, 1)')
  ) {
    return EASE_SMOOTH_OUT;
  }
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const damped = omega * Math.sqrt(1 - zeta * zeta);
  const points = Array.from({ length: stops + 1 }, (_, index) => {
    const t = (index / stops) * seconds;
    const decay = Math.exp(-zeta * omega * t);
    const value =
      1 -
      decay *
        (Math.cos(damped * t) +
          ((zeta * omega) / damped) * Math.sin(damped * t));
    return Number(value.toFixed(4));
  });
  points[stops] = 1;
  return `linear(${points.join(', ')})`;
}

export type IntroTrack = {
  ref: RefObject<HTMLElement | null>;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
};

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useIntroTimeline(
  build: () => readonly IntroTrack[],
  onDone: () => void
) {
  const buildRef = useRef(build);
  const doneRef = useRef(onDone);

  useLayoutEffect(() => {
    buildRef.current = build;
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (
      prefersReducedMotion() ||
      typeof Element.prototype.animate !== 'function'
    ) {
      doneRef.current();
      return;
    }

    let active = true;
    const animations = buildRef
      .current()
      .flatMap(({ ref, keyframes, options }) =>
        ref.current
          ? [ref.current.animate(keyframes, { fill: 'both', ...options })]
          : []
      );
    Promise.all(animations.map(animation => animation.finished)).then(
      () => {
        if (active) doneRef.current();
      },
      () => {}
    );

    return () => {
      active = false;
      for (const animation of animations) animation.cancel();
    };
  }, []);
}
