'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image, { type StaticImageData } from 'next/image';
import { ReactNode } from 'react';

import img1371 from '@/images/view/IMG_1371.webp';
import img4147 from '@/images/view/IMG_4147.webp';
import img4192 from '@/images/view/IMG_4192.webp';
import img8117 from '@/images/view/IMG_8117.webp';
import fxn1 from '@/images/view/fxn1.webp';

import CutoutFrame, { type CutoutFrameArgs } from './CutoutFrame';
import MoldedFrame, { type MoldNotch } from './MoldedFrame';

const FRAME_SIZE = 200;
const NOTCH_SIZE = 62;
const NOTCH_RADIUS = 20;
const RADIUS = 24;

const notch = (corner: MoldNotch['corner']): MoldNotch => ({
  type: 'corner',
  corner,
  size: NOTCH_SIZE,
  radius: NOTCH_RADIUS,
});

interface NotchCell {
  label: string;
  notches: MoldNotch[];
  src: StaticImageData | string;
}

const NOTCH_CELLS: NotchCell[] = [
  { label: 'radius 24', notches: [], src: img4192 },
  { label: 'notch tl', notches: [notch('tl')], src: img4147 },
  { label: 'notch tr', notches: [notch('tr')], src: img1371 },
  { label: 'notch bl', notches: [notch('bl')], src: img8117 },
];

interface CutoutCell {
  label: string;
  cuts: Pick<CutoutFrameArgs, 'keyhole' | 'scoop' | 'bite'>;
  src: StaticImageData | string;
}

const CUTOUT_CELLS: CutoutCell[] = [
  { label: 'keyhole', cuts: { keyhole: 'top' }, src: img1371 },
  { label: 'scoop', cuts: { scoop: 'right' }, src: img4147 },
  { label: 'bite', cuts: { bite: 'tr-bl' }, src: fxn1 },
  {
    label: 'keyhole + scoop',
    cuts: { keyhole: 'top', scoop: 'left' },
    src: '/images/shader-image/test1.jpeg',
  },
];

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

function ShowcaseCell({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.08,
        ease: REVEAL_EASE,
      }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span className="size-1 rounded-full bg-gray-10" />
        <span className="font-mono text-[13px] text-gray-9">{label}</span>
      </div>
      {children}
    </motion.div>
  );
}

function CellImage({ src }: { src: StaticImageData | string }) {
  return (
    <Image
      src={src}
      alt=""
      width={FRAME_SIZE * 2}
      height={FRAME_SIZE * 2}
      className="h-full w-full object-cover"
    />
  );
}

function GroupHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[13px] uppercase tracking-[0.3px] text-gray-6">
      {children}
    </h2>
  );
}

export default function FrameShowcase() {
  return (
    <div className="flex flex-col gap-16">
      <div>
        <GroupHeading>Corner notch</GroupHeading>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {NOTCH_CELLS.map((cell, index) => (
            <ShowcaseCell key={cell.label} label={cell.label} index={index}>
              <MoldedFrame
                width={FRAME_SIZE}
                height={FRAME_SIZE}
                radius={RADIUS}
                notches={cell.notches}
                className="aspect-square w-full bg-black/5"
              >
                <CellImage src={cell.src} />
              </MoldedFrame>
            </ShowcaseCell>
          ))}
        </div>
      </div>
      <div>
        <GroupHeading>Edge cutout</GroupHeading>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {CUTOUT_CELLS.map((cell, index) => (
            <ShowcaseCell key={cell.label} label={cell.label} index={index}>
              <CutoutFrame
                width={FRAME_SIZE}
                height={FRAME_SIZE}
                {...cell.cuts}
                className="aspect-square w-full bg-black/5"
              >
                <CellImage src={cell.src} />
              </CutoutFrame>
            </ShowcaseCell>
          ))}
        </div>
      </div>
    </div>
  );
}
