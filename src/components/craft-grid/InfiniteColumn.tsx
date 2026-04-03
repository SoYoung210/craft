'use client';

import { useRef } from 'react';

import { type CraftItem } from '@/app/_data/items';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { CraftCard } from '../craft-card/CraftCard';

interface Props {
  items: CraftItem[];
  className?: string;
}

export function InfiniteColumn({ items, className }: Props) {
  const columnRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(columnRef);

  return (
    <div
      ref={columnRef}
      className={`h-full overflow-y-auto scrollbar-none relative -mx-4 px-4 lg:-mx-6 lg:px-6${className ? ` ${className}` : ''}`}
    >
      <div className="h-4 lg:h-8 shrink-0 pointer-events-none" />
      {[0, 1, 2].map(setIndex => (
        <div
          key={setIndex}
          className="flex flex-col gap-4 pb-4 lg:gap-6 lg:pb-6"
        >
          {items.map((item, i) => (
            <CraftCard
              key={`${setIndex}-${i}`}
              item={item}
              priority={i === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
