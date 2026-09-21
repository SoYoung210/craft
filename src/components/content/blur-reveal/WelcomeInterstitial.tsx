'use client';

import {
  type FocusEvent,
  Fragment,
  type PointerEvent,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { X } from 'lucide-react';
import { Archivo } from 'next/font/google';

import { cn } from '@/utils/cn';

import { DEFAULT_DOME_WIPE, domeWipe } from './domeWipe';
import RippleText, { type RippleHandle } from './RippleText';
import {
  EASE_IN_OUT_STRONG,
  EASE_SMOOTH_OUT,
  type IntroTrack,
  prefersReducedMotion,
  springEasing,
  useIntroTimeline,
} from './useIntroTimeline';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'] });

const RISE: Keyframe[] = [
  { opacity: 0, transform: 'translateY(16px)' },
  { opacity: 1, transform: 'translateY(0)' },
];
const SOFT_RISE: Keyframe[] = [
  { opacity: 0, transform: 'translateY(12px)' },
  { opacity: 1, transform: 'translateY(0)' },
];
const BODY_FOCUS: Keyframe[] = [
  { filter: 'blur(4px)' },
  { filter: 'blur(0px)' },
];
const BUTTON_FADE: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const BUTTON_FOCUS: Keyframe[] = [
  { filter: 'blur(3px)' },
  { filter: 'blur(0px)' },
];
const BUTTON_SPRING: Keyframe[] = [
  { transform: 'translateY(12px) scale(0.96)' },
  { transform: 'translateY(0) scale(1)' },
];
const CLOSE_IN: Keyframe[] = [
  { opacity: 0, transform: 'scale(0.96)' },
  { opacity: 1, transform: 'scale(1)' },
];

const FRAME = 16;
const FRAME_RADIUS = 8;
const PANEL_INSET: Keyframe[] = [
  { clipPath: 'inset(0px round 0px)' },
  { clipPath: `inset(${FRAME}px round ${FRAME_RADIUS}px)` },
];
const COVER_FADE: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
const GLASS_ON: Keyframe[] = [
  { visibility: 'hidden' },
  { visibility: 'visible' },
];
const FRAME_INSET: Keyframe[] = [
  { borderWidth: '0px', borderRadius: '0px' },
  { borderWidth: `${FRAME}px`, borderRadius: `${FRAME + FRAME_RADIUS}px` },
];

const HEADLINE_DELAY = 450;
const GREETING_IN: KeyframeAnimationOptions = {
  delay: HEADLINE_DELAY,
  duration: 600,
};

const LINES = ['Welcome', 'to the', 'new space'] as const;
const LINE_RISE: Keyframe[] = [{ translate: '0 120%' }, { translate: '0 0' }];
const LINE_STAGGER = 140;

const SETTLE_BEAT = 170;
const SETTLE_DURATION = 700;
const CLOSE_OFFSET = 200;
const CLOSE_DURATION = 250;
const BODY_OFFSET = 250;
const ACTION_OFFSET = 330;
const ACTION_STAGGER = 60;
const ENTER_DURATION = 500;
const BUTTON_FADE_DURATION = 400;
const BUTTON_SPRING_DURATION = 600;
const COVER_OFFSET = 350;
const COVER_DURATION = 1000;
const COVER_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

type Spring = readonly [
  stiffness: number,
  damping: number,
  mass: number,
  seconds: number,
  stops: number,
];

const HEADLINE_SPRING: Spring = [90, 18.7, 1.5, 1.12, 45];
const HEADLINE_DURATION = 1120;
const HEADLINE_LAND = 560;
const BUTTON_SPRING_CURVE: Spring = [158, 17.6, 1, 0.6, 40];

const PRESSABLE =
  'outline-offset-2 transition-[color,background-color,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-[#22222280] active:scale-[0.97]';
const PILL =
  'inline-flex h-14 w-64 items-center justify-center whitespace-nowrap rounded-full px-10 text-[16px] font-medium leading-[1.35] tracking-[0.02em]';
const SOFT_FILL =
  'bg-[#0d0d0d]/5 text-[#2e2e2e] hover:bg-[#0d0d0d]/10 focus-visible:bg-[#0d0d0d]/10';

function rise(
  ref: RefObject<HTMLElement | null>,
  options: KeyframeAnimationOptions
): IntroTrack {
  return {
    ref,
    keyframes: RISE,
    options: { ...options, easing: EASE_SMOOTH_OUT },
  };
}

function centerY(element: HTMLElement | null): number | null {
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return null;
  }
  const rect = element.getBoundingClientRect();
  return rect.top + rect.height / 2;
}

function rippleTriggers(handle: RefObject<RippleHandle | null>) {
  return {
    onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'mouse') handle.current?.play();
    },
    onFocus: (event: FocusEvent<HTMLButtonElement>) => {
      if (event.currentTarget.matches(':focus-visible')) {
        handle.current?.play();
      }
    },
  };
}

export default function WelcomeInterstitial({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const glass = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLDivElement>(null);
  const headingGroup = useRef<HTMLDivElement>(null);
  const greeting = useRef<HTMLParagraphElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const body = useRef<HTMLParagraphElement>(null);
  const tourButton = useRef<HTMLDivElement>(null);
  const exploreButton = useRef<HTMLDivElement>(null);
  const tourRipple = useRef<RippleHandle>(null);
  const exploreRipple = useRef<RippleHandle>(null);
  const [settled, setSettled] = useState(false);
  const escapeRef = useRef<() => void>(() => {});

  function leave(after: () => void) {
    if (leaving.current) return;
    const host = root.current;
    const layers = {
      stage: stage.current,
      pane: pane.current,
      content: content.current,
    };
    if (
      !host ||
      !layers.stage ||
      !layers.pane ||
      !layers.content ||
      prefersReducedMotion() ||
      typeof host.animate !== 'function'
    ) {
      after();
      return;
    }
    leaving.current = true;
    void domeWipe(
      {
        host,
        stage: layers.stage,
        pane: layers.pane,
        content: layers.content,
        backdrop: glass.current,
        ghosts: settled,
        fill: 'bg-[#fdf7ef]',
      },
      DEFAULT_DOME_WIPE
    ).then(after);
  }

  useLayoutEffect(() => {
    escapeRef.current = () => leave(onDismiss);
  });

  useEffect(() => {
    root.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escapeRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useIntroTimeline(
    () => {
      const easing = springEasing(...HEADLINE_SPRING);
      const buttonSpring = springEasing(...BUTTON_SPRING_CURVE);
      const settleDelay =
        HEADLINE_DELAY +
        LINE_STAGGER * (LINES.length - 1) +
        HEADLINE_LAND +
        SETTLE_BEAT;
      const settle: KeyframeAnimationOptions = {
        delay: settleDelay,
        duration: SETTLE_DURATION,
        easing: EASE_IN_OUT_STRONG,
      };
      const viewportCenter = centerY(root.current);
      const groupCenter = centerY(headingGroup.current);
      const delta =
        viewportCenter === null || groupCenter === null
          ? 0
          : Math.round(viewportCenter - groupCenter);
      return [
        rise(greeting, GREETING_IN),
        ...LINES.map((_, index) => ({
          ref: { current: lines.current[index] ?? null },
          keyframes: LINE_RISE,
          options: {
            delay: HEADLINE_DELAY + LINE_STAGGER * index,
            duration: HEADLINE_DURATION,
            easing,
          },
        })),
        { ref: glass, keyframes: PANEL_INSET, options: settle },
        {
          ref: glass,
          keyframes: GLASS_ON,
          options: { delay: settleDelay + COVER_OFFSET, duration: 1 },
        },
        { ref: panel, keyframes: PANEL_INSET, options: settle },
        {
          ref: panel,
          keyframes: COVER_FADE,
          options: {
            delay: settleDelay + COVER_OFFSET,
            duration: COVER_DURATION,
            easing: COVER_EASING,
          },
        },
        { ref: frame, keyframes: FRAME_INSET, options: settle },
        {
          ref: headingGroup,
          keyframes: [
            { transform: `translateY(${delta}px)` },
            { transform: 'translateY(0px)' },
          ],
          options: settle,
        },
        {
          ref: close,
          keyframes: CLOSE_IN,
          options: {
            delay: settleDelay + CLOSE_OFFSET,
            duration: CLOSE_DURATION,
            easing: EASE_SMOOTH_OUT,
          },
        },
        {
          ref: body,
          keyframes: SOFT_RISE,
          options: {
            delay: settleDelay + BODY_OFFSET,
            duration: ENTER_DURATION,
            easing: EASE_SMOOTH_OUT,
          },
        },
        {
          ref: body,
          keyframes: BODY_FOCUS,
          options: {
            delay: settleDelay + BODY_OFFSET,
            duration: ENTER_DURATION,
            easing: EASE_SMOOTH_OUT,
            fill: 'backwards' as const,
          },
        },
        ...[tourButton, exploreButton].flatMap((ref, index) => {
          const delay = settleDelay + ACTION_OFFSET + ACTION_STAGGER * index;
          return [
            {
              ref,
              keyframes: BUTTON_FADE,
              options: {
                delay,
                duration: BUTTON_FADE_DURATION,
                easing: EASE_SMOOTH_OUT,
              },
            },
            {
              ref,
              keyframes: BUTTON_FOCUS,
              options: {
                delay,
                duration: BUTTON_FADE_DURATION,
                easing: EASE_SMOOTH_OUT,
                fill: 'backwards' as const,
              },
            },
            {
              ref,
              keyframes: BUTTON_SPRING,
              options: {
                delay,
                duration: BUTTON_SPRING_DURATION,
                easing: buttonSpring,
              },
            },
          ];
        }),
      ];
    },
    () => setSettled(true)
  );

  const staged = settled ? undefined : 'opacity-0';
  const masked = settled ? undefined : 'translate-y-[120%]';
  const inset = settled
    ? '[clip-path:inset(16px_round_8px)]'
    : '[clip-path:inset(0)]';

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to the new space"
      tabIndex={-1}
      data-reveal={settled ? 'settled' : 'staged'}
      className="fixed inset-0 z-50 overflow-hidden outline-hidden"
    >
      <div ref={stage} className="absolute inset-0">
        <div
          ref={glass}
          aria-hidden
          className={cn(
            'absolute inset-0 bg-linear-to-b from-[#fdf7ef]/50 to-[#cfc3ff] backdrop-blur-[48px]',
            inset,
            settled ? undefined : 'invisible'
          )}
        />
        <div ref={pane} className="absolute inset-0">
          <div ref={content} className="absolute inset-0">
            <div
              ref={panel}
              data-wipe-cover
              className={cn(
                'absolute inset-0 bg-[#fdf7ef] bg-linear-to-b from-[#cfc3ff]/10 to-[#cfc3ff]',
                inset,
                settled ? 'opacity-0' : undefined
              )}
            />
            <div data-wipe-scroll className="absolute inset-0 overflow-y-auto">
              <div className="flex min-h-full flex-col items-center justify-center gap-12 px-6 py-24 text-center sm:gap-20">
                <div className="flex flex-col items-center gap-8">
                  <div
                    ref={headingGroup}
                    className="flex flex-col items-center gap-4"
                  >
                    <p
                      ref={greeting}
                      className={cn(
                        'text-[20px] font-medium leading-[1.25] tracking-[0.02em] text-[#111111]',
                        staged
                      )}
                    >
                      Hello there
                    </p>
                    <h1
                      className={cn(
                        archivo.className,
                        'flex flex-col items-center text-[clamp(32px,10vw,48px)] sm:text-[clamp(48px,7.5vw,144px)] font-medium uppercase leading-none tracking-[0.03em] text-[#111111] font-stretch-expanded'
                      )}
                    >
                      {LINES.map((line, index) => (
                        <Fragment key={line}>
                          {index > 0 && ' '}
                          <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em]">
                            <span
                              ref={element => {
                                lines.current[index] = element;
                              }}
                              className={cn('block', masked)}
                            >
                              {line}
                            </span>
                          </span>
                        </Fragment>
                      ))}
                    </h1>
                  </div>
                  <p
                    ref={body}
                    className={cn(
                      'text-balance text-[24px] font-normal leading-[1.25] tracking-[0.02em] text-[#2e2e2e]',
                      staged
                    )}
                  >
                    <span className="block">
                      We’ve moved some things around, and added a whole host of
                      new features.
                    </span>{' '}
                    <span className="block">
                      Everything you made is still right where you left it.
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-[18px]">
                  <div ref={tourButton} className={staged}>
                    <button
                      type="button"
                      className={cn(PRESSABLE, PILL, SOFT_FILL)}
                      onClick={() => leave(onDismiss)}
                      {...rippleTriggers(tourRipple)}
                    >
                      <span>
                        Take the <RippleText ref={tourRipple} text="Tour" />
                      </span>
                    </button>
                  </div>
                  <div ref={exploreButton} className={staged}>
                    <button
                      type="button"
                      className={cn(PRESSABLE, PILL, 'bg-[#222222] text-white')}
                      onClick={() => leave(onDismiss)}
                      {...rippleTriggers(exploreRipple)}
                    >
                      <span>
                        Start{' '}
                        <RippleText ref={exploreRipple} text="Exploring" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={frame}
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 border-[#fdf7ef] outline-[24px] outline-[#fdf7ef]',
                settled ? 'rounded-3xl border-[16px]' : 'border-0'
              )}
            />
            <div
              ref={close}
              className={cn('absolute top-[30px] right-8', staged)}
            >
              <button
                type="button"
                aria-label="Close"
                className={cn(
                  PRESSABLE,
                  SOFT_FILL,
                  'grid size-10 place-items-center rounded-full'
                )}
                onClick={() => leave(onDismiss)}
              >
                <X aria-hidden className="size-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
