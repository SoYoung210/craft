'use client';

import { distributeToColumns, ITEMS } from '@/app/_data/items';

import { CraftCard } from '../craft-card/CraftCard';

import { InfiniteColumn } from './InfiniteColumn';

const COLUMNS = distributeToColumns(ITEMS, 3);

export function CraftGrid() {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5 blur-[120px]" />

      {/* Mobile: simple scrollable list with all items */}
      <div className="h-full overflow-y-auto scrollbar-none px-4 pb-8 relative z-10 lg:hidden">
        <div className="h-4 shrink-0" />
        <div className="flex flex-col gap-4">
          {ITEMS.map((item, i) => (
            <CraftCard key={i} item={item} priority={i < 3} />
          ))}
        </div>
        <div className="h-8 shrink-0" />
      </div>

      {/* Desktop: infinite scroll columns */}
      <div className="h-full hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 px-6 relative z-10">
        <InfiniteColumn items={COLUMNS[0]} />
        <InfiniteColumn items={COLUMNS[1]} />
        <InfiniteColumn className="hidden xl:block" items={COLUMNS[2]} />
      </div>
    </div>
  );
}
