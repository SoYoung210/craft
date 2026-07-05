'use client';

import { useRef, useState, useSyncExternalStore } from 'react';

import { distributeToColumns } from '../../../app/_data/items';

import { MEDIA_ITEMS } from './data';
import MediaPreview from './MediaPreview';

const QUERIES = ['(min-width: 1440px)', '(min-width: 1024px)'];

function subscribe(onStoreChange: () => void) {
  const unsubscribes = QUERIES.map(query => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onStoreChange);
    return () => mql.removeEventListener('change', onStoreChange);
  });
  return () => unsubscribes.forEach(unsubscribe => unsubscribe());
}

function getSnapshot() {
  if (window.matchMedia(QUERIES[0]).matches) return 4;
  if (window.matchMedia(QUERIES[1]).matches) return 3;
  return 2;
}

function getServerSnapshot() {
  return 4;
}

function useMasonryColumnCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function MasonryGallery() {
  const columnCount = useMasonryColumnCount();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const openRectRef = useRef<DOMRect | null>(null);
  const tileMapRef = useRef(new Map<string, HTMLElement>());
  const columns = distributeToColumns(MEDIA_ITEMS, columnCount);
  const activeId = activeIndex !== null ? MEDIA_ITEMS[activeIndex].id : null;

  const getTileRect = (id: string) =>
    tileMapRef.current.get(id)?.getBoundingClientRect() ?? null;

  return (
    <>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
            {column.map(item => (
              <button
                key={item.id}
                type="button"
                aria-label="Open image"
                onClick={() => {
                  openRectRef.current = getTileRect(item.id);
                  setActiveIndex(MEDIA_ITEMS.indexOf(item));
                }}
                style={{
                  visibility: activeId === item.id ? 'hidden' : undefined,
                }}
                className="group w-full cursor-pointer"
              >
                <div
                  ref={el => {
                    if (el) {
                      tileMapRef.current.set(item.id, el);
                    } else {
                      tileMapRef.current.delete(item.id);
                    }
                  }}
                  className="relative w-full overflow-hidden rounded-xl bg-white/5"
                  style={{ aspectRatio: item.ratio }}
                >
                  <img
                    src={item.url}
                    alt=""
                    loading="lazy"
                    className="size-full select-none object-cover transition-opacity duration-200 group-hover:opacity-80"
                    draggable={false}
                  />
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      {activeIndex !== null && openRectRef.current ? (
        <MediaPreview
          items={MEDIA_ITEMS}
          activeIndex={activeIndex}
          openRect={openRectRef.current}
          getTileRect={getTileRect}
          onNavigate={setActiveIndex}
          onClosed={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}
