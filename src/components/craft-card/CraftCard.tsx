import Image from 'next/image';
import Link from 'next/link';

import { type CraftItem } from '@/app/_data/items';

interface Props {
  item: CraftItem;
  priority?: boolean;
}

function getLuma(hex: string) {
  if (!hex.startsWith('#')) return 255;
  const c = hex.substring(1);
  const rgb = parseInt(
    c.length === 3
      ? c
          .split('')
          .map(x => x + x)
          .join('')
      : c,
    16
  );
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function CraftCard({ item, priority }: Props) {
  const bgColor = item.backgroundColor ?? '#f5f5f5';
  const isDark = getLuma(bgColor) < 128;
  const textColor = isDark ? 'text-white/90' : 'text-black/80';
  const subTextColor = isDark ? 'text-white/50' : 'text-black/40';

  return (
    <Link
      href={item.href}
      className="relative block hover:z-50 transition-all duration-300"
    >
      <div className="group/card relative overflow-hidden rounded-xl border border-black/5 bg-black/2 shadow-sm transition-all duration-300 hover:border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div
          className="relative w-full"
          style={{
            aspectRatio: item.aspectRatio,
            backgroundColor: bgColor,
          }}
        >
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            style={{ objectFit: item.objectFit ?? 'cover' }}
          />

          {/* Progressive Blur Layer */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[60%] z-10">
            <div
              className="absolute inset-0 backdrop-blur-xl"
              style={{
                maskImage:
                  'linear-gradient(to top, black 25%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to top, black 25%, transparent 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${bgColor} 5%, transparent 100%)`,
              }}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-4 pt-12">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium tracking-wide ${textColor}`}
                >
                  {item.title}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-wider uppercase ${subTextColor}`}
                >
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
