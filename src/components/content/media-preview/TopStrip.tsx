'use client';

import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { cn } from '../../../utils/cn';

import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const TRANSITION = {
  duration: 0.22,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
  delay: 0.08,
};

export type StripItem = {
  key: string;
  posterUrl?: string;
  isActive: boolean;
  onClick: () => void;
};

const chevronClass =
  'pointer-events-auto flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2e2e2e]/80 text-white transition-transform duration-150 ease-out hover:bg-[#2e2e2e] active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-50';

export default function TopStrip({
  items,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isLoadingMore,
}: {
  items: StripItem[];
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isLoadingMore: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeKey = items.find(i => i.isActive)?.key;

  useEffect(() => {
    if (!activeKey) return;
    const scroller = scrollerRef.current;
    const active = activeBtnRef.current;
    if (!scroller || !active) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const activeCenter = activeRect.left + activeRect.width / 2;
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
    const delta = activeCenter - scrollerCenter;
    if (Math.abs(delta) > 1) {
      scroller.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, [activeKey]);

  if (items.length === 0 && !hasPrev && !hasNext) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={TRANSITION}
      className="pointer-events-none relative z-20 flex w-full items-center justify-center gap-3 pt-6 pr-6 pl-6"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous"
        className={chevronClass}
      >
        <ChevronLeftIcon className="opacity-60 size-4" />
      </button>

      <div
        ref={scrollerRef}
        className="scrollbar-none pointer-events-auto flex max-w-[min(80vw,720px)] flex-row items-center gap-1 overflow-x-auto py-1"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
        }}
      >
        <div className="w-12 shrink-0" aria-hidden />
        {items.map(item => (
          <button
            key={item.key}
            ref={item.isActive ? activeBtnRef : null}
            type="button"
            onClick={item.onClick}
            aria-label="Open image"
            aria-current={item.isActive ? 'true' : undefined}
            className={cn(
              'relative h-12 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-white/5 transition-[width,opacity] duration-300 ease-out',
              item.isActive
                ? 'w-12 opacity-100 ring-2 ring-white'
                : 'w-8 opacity-70 hover:opacity-100'
            )}
          >
            {item.posterUrl ? (
              <div className="absolute top-0 left-1/2 size-12 -translate-x-1/2">
                <img
                  src={item.posterUrl}
                  alt=""
                  loading="lazy"
                  className="size-full select-none object-cover"
                  draggable={false}
                />
              </div>
            ) : null}
          </button>
        ))}
        <div className="w-12 shrink-0" aria-hidden />
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext || isLoadingMore}
        aria-label="Next"
        className={cn(chevronClass, 'relative')}
      >
        {isLoadingMore ? (
          <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <ChevronRightIcon className="opacity-60 size-4" />
        )}
      </button>
    </motion.div>
  );
}
