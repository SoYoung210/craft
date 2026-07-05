'use client';

import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import type { MediaItem } from './data';
import Hero from './Hero';
import { CloseIcon } from './icons';
import TopStrip from './TopStrip';

const BACKDROP_EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

function AmbientBackground({
  src,
  isClosing,
}: {
  src: string;
  isClosing: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-100px] blur-2xl brightness-50 contrast-[0.6] saturate-[1.7]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isClosing || !loaded ? 0 : 1,
          transition: { duration: isClosing ? 0.3 : 0.35, ease: BACKDROP_EASE },
        }}
      >
        <img
          src={src}
          alt=""
          className="size-full select-none object-cover"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </div>
  );
}

export default function MediaPreview({
  items,
  activeIndex,
  openRect,
  getTileRect,
  onNavigate,
  onClosed,
}: {
  items: MediaItem[];
  activeIndex: number;
  openRect: DOMRect;
  getTileRect: (id: string) => DOMRect | null;
  onNavigate: (index: number) => void;
  onClosed: () => void;
}) {
  const item = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const [closeTarget, setCloseTarget] = useState<DOMRect | null>(null);
  const isClosing = closeTarget !== null;

  const requestClose = useCallback(() => {
    if (isClosing) return;
    const target = getTileRect(item.id);
    if (!target) {
      onClosed();
      return;
    }
    setCloseTarget(target);
  }, [isClosing, getTileRect, item.id, onClosed]);

  const navigate = useCallback(
    (index: number) => {
      if (isClosing) return;
      onNavigate(index);
    },
    [isClosing, onNavigate]
  );

  const stripItems = items.map((media, index) => ({
    key: media.id,
    posterUrl: media.url,
    isActive: index === activeIndex,
    onClick: () => navigate(index),
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
      if (event.key === 'ArrowLeft' && hasPrev) navigate(activeIndex - 1);
      if (event.key === 'ArrowRight' && hasNext) navigate(activeIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, hasPrev, hasNext, navigate, requestClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col">
      <motion.div
        className="pointer-events-auto absolute inset-0 bg-[#101010]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          transition: { duration: isClosing ? 0.3 : 0.35, ease: BACKDROP_EASE },
        }}
        onClick={requestClose}
      />

      <AmbientBackground src={item.url} isClosing={isClosing} />

      <motion.button
        type="button"
        onClick={requestClose}
        aria-label="Close"
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-auto absolute top-6 right-6 z-30 flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#2e2e2e]/80 transition-transform duration-150 ease-out hover:bg-[#2e2e2e] active:scale-[0.95]"
      >
        <CloseIcon className="opacity-60 text-white" />
      </motion.button>

      <motion.div
        className="pointer-events-none"
        animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? -8 : 0 }}
        transition={{ duration: 0.12 }}
      >
        <TopStrip
          items={stripItems}
          onPrev={() => navigate(activeIndex - 1)}
          onNext={() => navigate(activeIndex + 1)}
          hasPrev={hasPrev}
          hasNext={hasNext}
          isLoadingMore={false}
        />
      </motion.div>

      <div className="pointer-events-none relative z-10 flex min-h-0 w-full flex-1 items-center justify-center px-3 py-6 min-[1200px]:px-8">
        <div className="pointer-events-auto flex h-full w-full items-center justify-center">
          <Hero
            item={item}
            openRect={openRect}
            closeTarget={closeTarget}
            onCloseComplete={onClosed}
          />
        </div>
      </div>
    </div>
  );
}
