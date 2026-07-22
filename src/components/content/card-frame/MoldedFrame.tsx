import { CSSProperties, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type MoldNotch = {
  type: 'corner';
  corner: 'tl' | 'tr' | 'bl' | 'br';
  size: number | { x: number; y: number };
  radius: number;
};

function notchDims(notch: MoldNotch): { sx: number; sy: number } {
  if (typeof notch.size === 'number') return { sx: notch.size, sy: notch.size };
  return { sx: notch.size.x, sy: notch.size.y };
}

type MoldArgs = {
  width: number;
  height: number;
  radius: number;
  notches: MoldNotch[];
};

export function buildMoldPath({
  width: w,
  height: h,
  radius: R,
  notches,
}: MoldArgs): string {
  const at = (corner: MoldNotch['corner']) =>
    notches.find(n => n.corner === corner);
  const tl = at('tl');
  const tr = at('tr');
  const br = at('br');
  const bl = at('bl');

  const d: string[] = [];

  d.push(`M ${tl ? notchDims(tl).sx + tl.radius : R} 0`);

  if (tr) {
    const { sx, sy } = notchDims(tr);
    const r = tr.radius;
    d.push(`L ${w - sx - r} 0`);
    d.push(`A ${r} ${r} 0 0 1 ${w - sx} ${r}`);
    d.push(`L ${w - sx} ${sy - r}`);
    d.push(`A ${r} ${r} 0 0 0 ${w - sx + r} ${sy}`);
    d.push(`L ${w - r} ${sy}`);
    d.push(`A ${r} ${r} 0 0 1 ${w} ${sy + r}`);
  } else {
    d.push(`L ${w - R} 0`);
    d.push(`A ${R} ${R} 0 0 1 ${w} ${R}`);
  }

  if (br) {
    const { sx, sy } = notchDims(br);
    const r = br.radius;
    d.push(`L ${w} ${h - sy - r}`);
    d.push(`A ${r} ${r} 0 0 1 ${w - r} ${h - sy}`);
    d.push(`L ${w - sx + r} ${h - sy}`);
    d.push(`A ${r} ${r} 0 0 0 ${w - sx} ${h - sy + r}`);
    d.push(`L ${w - sx} ${h - r}`);
    d.push(`A ${r} ${r} 0 0 1 ${w - sx - r} ${h}`);
  } else {
    d.push(`L ${w} ${h - R}`);
    d.push(`A ${R} ${R} 0 0 1 ${w - R} ${h}`);
  }

  if (bl) {
    const { sx, sy } = notchDims(bl);
    const r = bl.radius;
    d.push(`L ${sx + r} ${h}`);
    d.push(`A ${r} ${r} 0 0 1 ${sx} ${h - r}`);
    d.push(`L ${sx} ${h - sy + r}`);
    d.push(`A ${r} ${r} 0 0 0 ${sx - r} ${h - sy}`);
    d.push(`L ${r} ${h - sy}`);
    d.push(`A ${r} ${r} 0 0 1 0 ${h - sy - r}`);
  } else {
    d.push(`L ${R} ${h}`);
    d.push(`A ${R} ${R} 0 0 1 0 ${h - R}`);
  }

  if (tl) {
    const { sx, sy } = notchDims(tl);
    const r = tl.radius;
    d.push(`L 0 ${sy + r}`);
    d.push(`A ${r} ${r} 0 0 1 ${r} ${sy}`);
    d.push(`L ${sx - r} ${sy}`);
    d.push(`A ${r} ${r} 0 0 0 ${sx} ${sy - r}`);
    d.push(`L ${sx} ${r}`);
    d.push(`A ${r} ${r} 0 0 1 ${sx + r} 0`);
  } else {
    d.push(`L 0 ${R}`);
    d.push(`A ${R} ${R} 0 0 1 ${R} 0`);
  }

  d.push('Z');

  return d.join(' ');
}

export function buildMoldMaskSvg(args: MoldArgs): string {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${args.width} ${args.height}' preserveAspectRatio='none'><path d='${buildMoldPath(args)}' fill='white'/></svg>`;
}

export function maskFromSvg(svg: string): CSSProperties {
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  };
}

interface MoldedFrameProps {
  width: number;
  height: number;
  radius?: number;
  notches?: MoldNotch[];
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function MoldedFrame({
  width,
  height,
  radius = 24,
  notches = [],
  className,
  style,
  children,
}: MoldedFrameProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{
        ...style,
        ...maskFromSvg(buildMoldMaskSvg({ width, height, radius, notches })),
      }}
    >
      {children}
    </div>
  );
}
