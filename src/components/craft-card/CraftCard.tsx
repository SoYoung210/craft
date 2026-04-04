import Image from 'next/image';
import Link from 'next/link';

import { type CraftItem } from '@/app/_data/items';

import { CraftVideoPlayer } from './CraftVideoPlayer';

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
    </svg>
  );
}

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

  const wrapperClassName = 'scroll-blur-item relative block hover:z-50';

  const isVideo = !!item.videoSrc;

  const card = (
    <div className="group/card relative overflow-hidden rounded-xl border border-black/5 bg-black/2 shadow-sm transition-all duration-300 hover:border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: item.aspectRatio,
          backgroundColor: bgColor,
        }}
      >
        {isVideo ? (
          <CraftVideoPlayer
            src={item.videoSrc!}
            objectFit={item.objectFit}
            videoStyle={item.videoStyle}
          />
        ) : (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            style={{ objectFit: item.objectFit ?? 'cover' }}
          />
        )}

        {!isVideo && (
          <>
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
                    className={`flex items-center gap-1 text-xs font-medium tracking-wide ${textColor}`}
                  >
                    {item.title}
                    {item.external && <ArrowUpRightIcon className="size-3" />}
                  </span>
                  <span
                    className={`font-mono text-[10px] tracking-wider uppercase ${subTextColor}`}
                  >
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isVideo && (
        <div className="flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1 text-xs font-medium tracking-wide text-black/80">
            {item.title}
            {item.external && <ArrowUpRightIcon className="size-3" />}
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-black/40">
            {item.date}
          </span>
        </div>
      )}
    </div>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClassName}
      >
        {card}
      </a>
    );
  }

  return (
    <Link href={item.href} className={wrapperClassName}>
      {card}
    </Link>
  );
}
