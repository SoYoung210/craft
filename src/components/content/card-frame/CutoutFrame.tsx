import { CSSProperties, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { maskFromSvg } from './MoldedFrame';

const N = (v: number) => Number(v).toFixed(2);

export type CutoutFrameArgs = {
  width: number;
  height: number;
  keyhole?: 'top' | 'bottom';
  scoop?: 'left' | 'right';
  bite?: 'tl' | 'br' | 'tl-br' | 'tr-bl';
};

type Bite = { sx: number; sy: number; r: number };

function keyholeDown(d: string[], cx: number, m: Metrics) {
  const { neck, half, depth } = m.key;
  const mouth = depth * 0.42;
  const floor = depth - neck;
  d.push(`L ${N(cx - half)} 0`);
  d.push(`Q ${N(cx - neck)} 0 ${N(cx - neck)} ${N(mouth)}`);
  d.push(`L ${N(cx - neck)} ${N(floor)}`);
  d.push(`A ${N(neck)} ${N(neck)} 0 0 0 ${N(cx + neck)} ${N(floor)}`);
  d.push(`L ${N(cx + neck)} ${N(mouth)}`);
  d.push(`Q ${N(cx + neck)} 0 ${N(cx + half)} 0`);
}

function keyholeUp(d: string[], cx: number, h: number, m: Metrics) {
  const { neck, half, depth } = m.key;
  const mouth = h - depth * 0.42;
  const floor = h - (depth - neck);
  d.push(`L ${N(cx + half)} ${N(h)}`);
  d.push(`Q ${N(cx + neck)} ${N(h)} ${N(cx + neck)} ${N(mouth)}`);
  d.push(`L ${N(cx + neck)} ${N(floor)}`);
  d.push(`A ${N(neck)} ${N(neck)} 0 0 0 ${N(cx - neck)} ${N(floor)}`);
  d.push(`L ${N(cx - neck)} ${N(mouth)}`);
  d.push(`Q ${N(cx - neck)} ${N(h)} ${N(cx - half)} ${N(h)}`);
}

function scoopRight(d: string[], w: number, cy: number, m: Metrics) {
  const { depth, mouthHalf, r } = m.scoop;
  const backHalf = mouthHalf - 2 * r;
  const xBack = w - depth;
  d.push(`L ${N(w)} ${N(cy - mouthHalf)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 1 ${N(w - r)} ${N(cy - mouthHalf + r)}`);
  d.push(`L ${N(xBack + r)} ${N(cy - mouthHalf + r)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 0 ${N(xBack)} ${N(cy - backHalf)}`);
  d.push(`L ${N(xBack)} ${N(cy + backHalf)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 0 ${N(xBack + r)} ${N(cy + mouthHalf - r)}`);
  d.push(`L ${N(w - r)} ${N(cy + mouthHalf - r)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 1 ${N(w)} ${N(cy + mouthHalf)}`);
}

function scoopLeft(d: string[], cy: number, m: Metrics) {
  const { depth, mouthHalf, r } = m.scoop;
  const backHalf = mouthHalf - 2 * r;
  const xBack = depth;
  d.push(`L 0 ${N(cy + mouthHalf)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 1 ${N(r)} ${N(cy + mouthHalf - r)}`);
  d.push(`L ${N(xBack - r)} ${N(cy + mouthHalf - r)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 0 ${N(xBack)} ${N(cy + backHalf)}`);
  d.push(`L ${N(xBack)} ${N(cy - backHalf)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 0 ${N(xBack - r)} ${N(cy - mouthHalf + r)}`);
  d.push(`L ${N(r)} ${N(cy - mouthHalf + r)}`);
  d.push(`A ${N(r)} ${N(r)} 0 0 1 0 ${N(cy - mouthHalf)}`);
}

function biteTopRight(d: string[], w: number, b: Bite) {
  d.push(`L ${N(w - b.sx - b.r)} 0`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(w - b.sx)} ${N(b.r)}`);
  d.push(`L ${N(w - b.sx)} ${N(b.sy - b.r)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 0 ${N(w - b.sx + b.r)} ${N(b.sy)}`);
  d.push(`L ${N(w - b.r)} ${N(b.sy)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(w)} ${N(b.sy + b.r)}`);
}

function biteBottomRight(d: string[], w: number, h: number, b: Bite) {
  d.push(`L ${N(w)} ${N(h - b.sy - b.r)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(w - b.r)} ${N(h - b.sy)}`);
  d.push(`L ${N(w - b.sx + b.r)} ${N(h - b.sy)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 0 ${N(w - b.sx)} ${N(h - b.sy + b.r)}`);
  d.push(`L ${N(w - b.sx)} ${N(h - b.r)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(w - b.sx - b.r)} ${N(h)}`);
}

function biteBottomLeft(d: string[], h: number, b: Bite) {
  d.push(`L ${N(b.sx + b.r)} ${N(h)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(b.sx)} ${N(h - b.r)}`);
  d.push(`L ${N(b.sx)} ${N(h - b.sy + b.r)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 0 ${N(b.sx - b.r)} ${N(h - b.sy)}`);
  d.push(`L ${N(b.r)} ${N(h - b.sy)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 0 ${N(h - b.sy - b.r)}`);
}

function biteTopLeft(d: string[], b: Bite) {
  d.push(`L 0 ${N(b.sy + b.r)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(b.r)} ${N(b.sy)}`);
  d.push(`L ${N(b.sx - b.r)} ${N(b.sy)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 0 ${N(b.sx)} ${N(b.sy - b.r)}`);
  d.push(`L ${N(b.sx)} ${N(b.r)}`);
  d.push(`A ${N(b.r)} ${N(b.r)} 0 0 1 ${N(b.sx + b.r)} 0`);
}

type Metrics = {
  r: number;
  rScoop: number;
  key: { half: number; neck: number; depth: number };
  biteSm: Bite;
  biteLg: Bite;
  scoop: { depth: number; mouthHalf: number; r: number };
};

function metrics(h: number): Metrics {
  const s = h / 240;
  return {
    r: 17 * s,
    rScoop: 13 * s,
    key: { half: 21.25 * s, neck: 7.5 * s, depth: 32 * s },
    biteSm: { sx: 35 * s, sy: 32 * s, r: 16 * s },
    biteLg: { sx: 44 * s, sy: 32 * s, r: 17.5 * s },
    scoop: { depth: 24 * s, mouthHalf: 65.5 * s, r: 9.5 * s },
  };
}

export function buildCutoutFramePath({
  width: w,
  height: h,
  keyhole,
  scoop,
  bite,
}: CutoutFrameArgs): string {
  const m = metrics(h);
  const cy = h / 2;

  const topKeyhole = keyhole === 'top';
  const bottomKeyhole = keyhole === 'bottom';
  const rightScoop = scoop === 'right';
  const leftScoop = scoop === 'left';
  const tlBite = bite === 'tl' || bite === 'tl-br';
  const brBite = bite === 'br' || bite === 'tl-br';
  const mirroredBite = bite === 'tr-bl';

  const rLeft = leftScoop ? m.rScoop : m.r;
  const rRight = rightScoop ? m.rScoop : m.r;

  const d: string[] = [];

  d.push(`M ${N(tlBite ? m.biteSm.sx + m.biteSm.r : rLeft)} 0`);

  if (topKeyhole) keyholeDown(d, w * 0.707, m);

  if (mirroredBite) {
    biteTopRight(d, w, m.biteSm);
  } else {
    d.push(`L ${N(w - rRight)} 0`);
    d.push(`A ${N(rRight)} ${N(rRight)} 0 0 1 ${N(w)} ${N(rRight)}`);
  }

  if (rightScoop) scoopRight(d, w, cy, m);

  if (brBite) {
    biteBottomRight(d, w, h, m.biteLg);
  } else {
    d.push(`L ${N(w)} ${N(h - rRight)}`);
    d.push(`A ${N(rRight)} ${N(rRight)} 0 0 1 ${N(w - rRight)} ${N(h)}`);
  }

  if (bottomKeyhole) keyholeUp(d, w * 0.293, h, m);

  if (mirroredBite) {
    biteBottomLeft(d, h, m.biteLg);
  } else {
    d.push(`L ${N(rLeft)} ${N(h)}`);
    d.push(`A ${N(rLeft)} ${N(rLeft)} 0 0 1 0 ${N(h - rLeft)}`);
  }

  if (leftScoop) scoopLeft(d, cy, m);

  if (tlBite) {
    biteTopLeft(d, m.biteSm);
  } else {
    d.push(`L 0 ${N(rLeft)}`);
    d.push(`A ${N(rLeft)} ${N(rLeft)} 0 0 1 ${N(rLeft)} 0`);
  }

  d.push('Z');

  return d.join(' ');
}

export function buildCutoutFrameMaskSvg(args: CutoutFrameArgs): string {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${args.width} ${args.height}' preserveAspectRatio='none'><path d='${buildCutoutFramePath(args)}' fill='white'/></svg>`;
}

interface CutoutFrameProps extends CutoutFrameArgs {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function CutoutFrame({
  width,
  height,
  keyhole,
  scoop,
  bite,
  className,
  style,
  children,
}: CutoutFrameProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{
        ...style,
        ...maskFromSvg(
          buildCutoutFrameMaskSvg({ width, height, keyhole, scoop, bite })
        ),
      }}
    >
      {children}
    </div>
  );
}
