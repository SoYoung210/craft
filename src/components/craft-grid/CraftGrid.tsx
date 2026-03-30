'use client';

import { useEffect, useMemo, useState } from 'react';

import { distributeToColumns, ITEMS } from '@/app/_data/items';
import { useWindowSize } from '@/hooks/useWindowSize';

import { InfiniteColumn } from './InfiniteColumn';

const GRID_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

function useColumnCount() {
  const { width } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return 3;
  // Calculate relative to the remaining space minus the 320px sidebar
  if (width >= 1280) return 3;
  if (width >= 1024) return 2;
  return 1;
}

export function CraftGrid() {
  const columnCount = useColumnCount();
  const columns = useMemo(
    () => distributeToColumns(ITEMS, columnCount),
    [columnCount]
  );

  return (
    <div className="relative h-full w-full">
      {/* Subtle Background Lighting Map */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5 blur-[120px]" />

      {/* Grid Container */}
      <div
        className={`h-full grid ${GRID_CLASSES[columnCount]} gap-8 px-8 relative z-10`}
      >
        {columns.map((columnItems, i) => (
          <InfiniteColumn key={`${columnCount}-${i}`} items={columnItems} />
        ))}
      </div>
    </div>
  );
}
