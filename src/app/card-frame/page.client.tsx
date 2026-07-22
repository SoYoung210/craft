'use client';

import { motion } from 'motion/react';

import CardFrameTiles from '@/components/content/card-frame/CardFrameTiles';
import FrameShowcase from '@/components/content/card-frame/FrameShowcase';

const fadeUp = {
  initial: { opacity: 0, y: 16, filter: 'blur(2px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const TEXT_DELAY = 0.55;

export default function CardFrameClient() {
  return (
    <main className="bg-white">
      <section className="relative flex min-h-dvh flex-col overflow-hidden lg:justify-center">
        <CardFrameTiles />
        <div className="relative z-10 mx-auto mt-auto flex max-w-205 flex-col items-center px-5 pb-16 text-center md:px-8 md:pb-20 lg:mt-0 lg:py-0">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.4, delay: TEXT_DELAY, ease: 'easeOut' }}
            className="rounded-full bg-black/5 px-3 py-1 font-mono text-[13px] tracking-[0.3px] uppercase text-gray-9"
          >
            Craft
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{
              duration: 0.5,
              delay: TEXT_DELAY + 0.05,
              ease: 'easeOut',
            }}
            className="mt-4 text-[40px] font-bold tracking-[-0.03em] text-gray-9 sm:text-[56px] lg:text-[64px]"
          >
            Card Frame
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{
              duration: 0.5,
              delay: TEXT_DELAY + 0.2,
              ease: 'easeOut',
            }}
            className="mt-4 max-w-lg text-[16px] leading-relaxed text-gray-6 lg:text-[17px]"
          >
            Molded frames with layered depth, floating and tilting toward your
            cursor.
          </motion.p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-8 md:px-8">
        <FrameShowcase />
      </section>
    </main>
  );
}
