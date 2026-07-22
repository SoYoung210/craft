'use client';

import {
  motion,
  type MotionValue,
  type TargetAndTransition,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';

import img1371 from '@/images/view/IMG_1371.webp';
import img4147 from '@/images/view/IMG_4147.webp';
import img4192 from '@/images/view/IMG_4192.webp';
import img8117 from '@/images/view/IMG_8117.webp';

import MoldedFrame, { type MoldNotch } from './MoldedFrame';
import GridBackground from './GridBackground';

interface Tile {
  src: StaticImageData;
  label: string;
  size: number;
  position: string;
  center: [number, number];
  notches?: MoldNotch[];
  mobile: { size: number; position: string };
}

const TILES: Tile[] = [
  {
    src: img4192,
    label: 'Griffith Park',
    size: 150,
    position: 'left-[10%] top-[18%]',
    center: [0.16, 0.3],
    mobile: { size: 96, position: 'left-[14%] top-[20%]' },
  },
  {
    src: img4147,
    label: 'Santa Monica',
    size: 320,
    position: 'right-[6%] top-[8%]',
    center: [0.81, 0.26],
    notches: [{ type: 'corner', corner: 'bl', size: 100, radius: 30 }],
    mobile: { size: 148, position: 'right-[8%] top-[6%]' },
  },
  {
    src: img1371,
    label: 'Joshua Tree',
    size: 320,
    position: 'left-[6%] bottom-[8%]',
    center: [0.19, 0.74],
    notches: [
      { type: 'corner', corner: 'tr', size: 100, radius: 30 },
      { type: 'corner', corner: 'bl', size: 100, radius: 30 },
    ],
    mobile: { size: 136, position: 'left-[5%] top-[42%]' },
  },
  {
    src: img8117,
    label: 'Yosemite',
    size: 140,
    position: 'right-[10%] bottom-[18%]',
    center: [0.84, 0.74],
    mobile: { size: 80, position: 'right-[13%] top-[46%]' },
  },
];

const ENTER_X = '42vw';
const ENTER_Y = 100;
const ENTER_ROT = 45;

const ENTER_LEFT = {
  initial: { x: `-${ENTER_X}`, y: ENTER_Y, rotateY: ENTER_ROT },
  animate: { x: 0, y: 0, rotateY: 0 },
};
const ENTER_RIGHT = {
  initial: { x: ENTER_X, y: ENTER_Y, rotateY: -ENTER_ROT },
  animate: { x: 0, y: 0, rotateY: 0 },
};

const BASE_DELAY = 0.1;
const STAGGER = 0.08;
const ENTER_DURATION = 1.6;
const SETTLE_DURATION = 1.2;
const SETTLE_DELAY = 0.28;
const ENTER_BLUR = 6;
const ENTER_EASE = [0.23, 1, 0.32, 1] as const;
const FLIP_Y = 32;
const FLIP_X = 28;
const FLIP_SPRING = { stiffness: 70, damping: 18, mass: 0.6 };

const DEPTH = 12;
const LAYERS = 4;
const EDGE_DARKEN = 0.7;
const BASE_RADIUS = 24;

const FLOAT_Y = 8;
const FLOAT_DURATION = 3.4;

function TileSlab({
  src,
  size,
  radius,
  notches,
  delay,
}: {
  src: StaticImageData;
  size: number;
  radius: number;
  notches?: MoldNotch[];
  delay: number;
}) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
    >
      {Array.from({ length: LAYERS + 1 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ transform: `translateZ(${-(i / LAYERS) * DEPTH}px)` }}
          initial={{
            opacity: 0,
            filter: i === 0 ? `blur(${ENTER_BLUR}px)` : undefined,
          }}
          animate={{
            opacity: 1,
            filter: i === 0 ? 'blur(0px)' : undefined,
          }}
          transition={{
            duration: SETTLE_DURATION,
            delay: delay + SETTLE_DELAY,
            ease: ENTER_EASE,
          }}
        >
          <MoldedFrame
            width={size}
            height={size}
            radius={radius}
            notches={notches}
            className={`absolute inset-0 ${i > 0 ? 'bg-black' : 'bg-black/5'}`}
            style={{ width: size, height: size }}
          >
            <Image
              src={src}
              alt=""
              width={size}
              height={size}
              priority={i === 0}
              loading={i === 0 ? undefined : 'eager'}
              className="h-full w-full object-cover"
              style={i > 0 ? { opacity: EDGE_DARKEN } : undefined}
            />
          </MoldedFrame>
        </motion.div>
      ))}
    </div>
  );
}

function FlipCard({
  src,
  label,
  size,
  radius,
  position,
  notches,
  center,
  index,
  sx,
  sy,
  flat,
  enter,
}: {
  src: StaticImageData;
  label: string;
  size: number;
  radius: number;
  position: string;
  notches?: MoldNotch[];
  center: [number, number];
  index: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  flat: boolean | null;
  enter: { initial: TargetAndTransition; animate: TargetAndTransition };
}) {
  const [cx, cy] = center;
  const rotateY = useTransform(sx, v => (cx - v) * FLIP_Y);
  const rotateX = useTransform(sy, v => (cy - v) * FLIP_X);
  const delay = BASE_DELAY + index * STAGGER;

  return (
    <motion.div
      className={`absolute ${position}`}
      style={{ transformStyle: 'preserve-3d' }}
      initial={enter.initial}
      animate={enter.animate}
      transition={{
        x: { duration: ENTER_DURATION, delay, ease: ENTER_EASE },
        y: {
          duration: SETTLE_DURATION,
          delay: delay + SETTLE_DELAY,
          ease: ENTER_EASE,
        },
        rotateY: {
          duration: SETTLE_DURATION,
          delay: delay + SETTLE_DELAY,
          ease: ENTER_EASE,
        },
      }}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -FLOAT_Y, 0] }}
        transition={{
          duration: FLOAT_DURATION + index * 0.6,
          delay: 0 + ENTER_DURATION,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          style={
            flat
              ? { transformStyle: 'preserve-3d' }
              : { rotateX, rotateY, transformStyle: 'preserve-3d' }
          }
        >
          <motion.div
            className="mb-2 flex items-center gap-1.5"
            initial={{ opacity: 0, filter: `blur(${ENTER_BLUR}px)` }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{
              duration: SETTLE_DURATION,
              delay: delay + SETTLE_DELAY,
              ease: ENTER_EASE,
            }}
          >
            <span className="size-1 rounded-full bg-gray-10" />
            <span className="font-mono text-[13px] text-gray-9">{label}</span>
          </motion.div>
          <TileSlab
            src={src}
            size={size}
            radius={radius}
            notches={notches}
            delay={delay}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CardFrameTiles() {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, FLIP_SPRING);
  const sy = useSpring(my, FLIP_SPRING);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const move = (event: PointerEvent) => {
      mx.set(event.clientX / window.innerWidth);
      my.set(event.clientY / window.innerHeight);
    };

    window.addEventListener('pointermove', move, { passive: true });

    return () => window.removeEventListener('pointermove', move);
  }, [reduce, mx, my]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center lg:py-10"
    >
      <GridBackground />
      <div
        className="relative h-full max-h-[880px] w-full max-w-[1240px]"
        style={{ perspective: '1200px' }}
      >
        {TILES.map((tile, index) => {
          const size = isMobile ? tile.mobile.size : tile.size;
          const position = isMobile ? tile.mobile.position : tile.position;
          const r = size / tile.size;
          const radius = isMobile ? Math.round(BASE_RADIUS * r) : BASE_RADIUS;
          const notches =
            isMobile && tile.notches
              ? tile.notches.map(n => ({
                  ...n,
                  size:
                    typeof n.size === 'number'
                      ? n.size * r
                      : { x: n.size.x * r, y: n.size.y * r },
                  radius: n.radius * r,
                }))
              : tile.notches;
          const enter = position.startsWith('left') ? ENTER_LEFT : ENTER_RIGHT;
          return (
            <FlipCard
              key={tile.position}
              src={tile.src}
              label={tile.label}
              size={size}
              radius={radius}
              position={position}
              notches={notches}
              center={tile.center}
              index={index}
              sx={sx}
              sy={sy}
              flat={reduce || isMobile}
              enter={enter}
            />
          );
        })}
      </div>
    </div>
  );
}
