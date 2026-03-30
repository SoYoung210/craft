'use client';

import { useRef } from 'react';

import { type CraftItem } from '@/app/_data/items';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { CraftCard } from '../craft-card/CraftCard';

interface Props {
  items: CraftItem[];
}

export function InfiniteColumn({ items }: Props) {
  const columnRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(columnRef);

  return (
    <div
      ref={columnRef}
      className="h-full overflow-y-auto scrollbar-none relative -mx-8 px-8"
    >
      <div className="h-8 shrink-0 pointer-events-none" />
      {[0, 1, 2].map(setIndex => (
        <div key={setIndex} className="flex flex-col gap-8 pb-8">
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
