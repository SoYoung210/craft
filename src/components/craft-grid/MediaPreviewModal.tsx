'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion } from 'motion/react';

import { type CraftItem } from '@/app/_data/items';

import { ModalVideoPlayer } from './ModalVideoPlayer';

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function parseAspectRatio(ratio: string): number {
  const [w, h] = ratio.split('/').map(Number);
  return w && h ? w / h : 16 / 9;
}

interface Props {
  item: CraftItem;
  previewId: string;
  onClose: () => void;
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};
const backdropTransition = { duration: 0.3, ease: [0.23, 1, 0.32, 1] } as const;

export function MediaPreviewModal({ item, previewId, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const mediaSize = useMemo(() => {
    if (typeof window === 'undefined') return { width: 800, height: 500 };
    const maxW = window.innerWidth * 0.85;
    const maxH = window.innerHeight * 0.78;
    const ratio = parseAspectRatio(item.aspectRatio);

    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }
    return { width: Math.round(w), height: Math.round(h) };
  }, [item.aspectRatio]);

  if (!mounted) return null;

  const isVideo = !!item.videoSrc;
  const bgColor = item.backgroundColor ?? '#f5f5f5';

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={backdropTransition}
        onClick={onClose}
      />

      <motion.button
        type="button"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="pointer-events-auto absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25 lg:hidden"
        aria-label="Close"
      >
        <XIcon className="size-4 text-white" />
      </motion.button>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="pointer-events-auto flex flex-col items-center"
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            layoutId={previewId}
            transition={springTransition}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: mediaSize.width,
              height: mediaSize.height,
              backgroundColor: bgColor,
            }}
          >
            {isVideo ? (
              <ModalVideoPlayer
                src={item.videoSrc!}
                objectFit={item.objectFit}
                videoStyle={item.videoStyle}
              />
            ) : (
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="85vw"
                style={{ objectFit: item.objectFit ?? 'cover' }}
              />
            )}
          </motion.div>

          <motion.div
            className="mt-3 flex w-full items-center justify-between px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            <span className="text-sm font-medium tracking-wide text-white/90">
              {item.title}
            </span>
            {item.date && (
              <span className="font-mono text-xs tracking-wider uppercase text-white/50">
                {item.date}
              </span>
            )}
          </motion.div>

          <motion.button
            type="button"
            onClick={onClose}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            className="mt-3 hidden size-11 items-center justify-center bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25 lg:flex"
            style={{ borderRadius: 18 }}
            aria-label="Close"
          >
            <XIcon className="size-4.5 text-white" />
          </motion.button>
        </div>
      </div>
    </div>,
    document.body
  );
}
