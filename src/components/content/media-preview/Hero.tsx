'use client';

import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { SPRING } from './constants';
import type { MediaItem } from './data';

const SWAP_TRANSITION = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

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
  openRect,
  closeTarget,
  onCloseComplete,
}: {
  item: MediaItem;
  openRect: DOMRect;
  closeTarget: DOMRect | null;
  onCloseComplete: () => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const hasOpenedRef = useRef(false);
  const isClosingRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || hasOpenedRef.current) return;
    hasOpenedRef.current = true;
    const delta = measureDelta(box, openRect, { x: 0, y: 0, scale: 1 });
    x.set(delta.x);
    y.set(delta.y);
    scale.set(delta.scale);
    animate(x, 0, SPRING);
    animate(y, 0, SPRING);
    animate(scale, 1, SPRING);
  }, [openRect, x, y, scale]);

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
    animate(scale, delta.scale, { ...SPRING, onComplete: onCloseComplete });
  }, [closeTarget, onCloseComplete, x, y, scale]);

  return (
    <div className="flex h-full w-full min-w-0 items-center justify-center">
      <div
        className="relative flex h-full min-w-0 flex-1 items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div
          className="relative flex flex-col"
          style={{ width: `min(100cqw, calc(100cqh * ${item.ratio}))` }}
        >
          <motion.div
            ref={boxRef}
            style={{ aspectRatio: item.ratio, x, y, scale }}
            className="relative flex w-full overflow-hidden rounded-xl min-[1200px]:rounded-[24px]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={SWAP_TRANSITION}
                className="absolute inset-0 flex"
              >
                <img
                  src={item.url}
                  alt=""
                  className="size-full select-none object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
