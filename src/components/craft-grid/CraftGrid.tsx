'use client';

import { distributeToColumns, ITEMS } from '@/app/_data/items';

import { InfiniteColumn } from './InfiniteColumn';

const COLUMNS = distributeToColumns(ITEMS, 3);

export function CraftGrid() {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5 blur-[120px]" />

      <div className="h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-4 lg:gap-6 lg:px-6 relative z-10">
        <InfiniteColumn items={COLUMNS[0]} />
        <InfiniteColumn className="hidden lg:block" items={COLUMNS[1]} />
        <InfiniteColumn className="hidden xl:block" items={COLUMNS[2]} />
      </div>
    </div>
  );
}
