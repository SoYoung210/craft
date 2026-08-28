'use client';

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { SPRING } from './constants';
import type { MediaItem } from './data';

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const TILE_RADIUS = 12;

function measureDelta(
  box: HTMLElement,
  target: DOMRect,
  current: { x: number; y: number; scale: number }
) {
  const rect = box.getBoundingClientRect();
  const layoutWidth = rect.width / current.scale;
  const layoutCenterX = rect.left + rect.width / 2 - current.x;
  const layoutCenterY = rect.top + rect.height / 2 - current.y;
  return {
    x: target.left + target.width / 2 - layoutCenterX,
    y: target.top + target.height / 2 - layoutCenterY,
    scale: target.width / layoutWidth,
  };
}

export default function Hero({
  item,
  direction,
  openRect,
  closeTarget,
  onCloseComplete,
}: {
  item: MediaItem;
  direction: number;
  openRect: DOMRect;
  closeTarget: DOMRect | null;
  onCloseComplete: () => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const attachBox = useCallback((element: HTMLDivElement | null) => {
    if (element) boxRef.current = element;
  }, []);
  const hasOpenedRef = useRef(false);
  const isClosingRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const radius = useMotionValue<number | string>('');
  const reduceMotion = useReducedMotion() ?? false;

  const mediaSwapVariants = {
    enter: (d: number) =>
      reduceMotion ? { opacity: 0 } : { x: d * 40, scale: 0.97, opacity: 0 },
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (d: number) =>
      reduceMotion
        ? { opacity: 0, transition: { duration: 0.3, ease: EASE_EXPO } }
        : {
            x: d * -40,
            scale: 0.98,
            opacity: 0,
            transition: { duration: 0.3, ease: EASE_EXPO },
          },
  };

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || hasOpenedRef.current) return;
    hasOpenedRef.current = true;
    const heroRadius =
      parseFloat(getComputedStyle(box).borderRadius) || TILE_RADIUS;
    const delta = measureDelta(box, openRect, { x: 0, y: 0, scale: 1 });
    x.set(delta.x);
    y.set(delta.y);
    scale.set(delta.scale);
    radius.set(TILE_RADIUS / delta.scale);
    animate(x, 0, SPRING);
    animate(y, 0, SPRING);
    animate(scale, 1, SPRING);
    animate(radius, heroRadius, SPRING);
  }, [openRect, x, y, scale, radius]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !closeTarget || isClosingRef.current) return;
    isClosingRef.current = true;
    const delta = measureDelta(box, closeTarget, {
      x: x.get(),
      y: y.get(),
      scale: scale.get(),
    });
    animate(x, delta.x, SPRING);
    animate(y, delta.y, SPRING);
    animate(radius, TILE_RADIUS / delta.scale, SPRING);
    animate(scale, delta.scale, { ...SPRING, onComplete: onCloseComplete });
  }, [closeTarget, onCloseComplete, x, y, scale, radius]);

  return (
    <div className="flex h-full w-full min-w-0 items-center justify-center">
      <div
        className="relative flex h-full min-w-0 flex-1 items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={mediaSwapVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: EASE_EXPO }}
            className="flex size-full items-center justify-center"
          >
            <motion.div
              ref={attachBox}
              style={{
                aspectRatio: item.ratio,
                width: `min(100cqw, calc(100cqh * ${item.ratio}))`,
                x,
                y,
                scale,
              }}
              className="relative overflow-hidden rounded-xl min-[1200px]:rounded-[24px]"
            >
              <img
                src={item.url}
                alt=""
                decoding="async"
                className="size-full select-none object-cover"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
