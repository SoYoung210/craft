'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/utils/cn';

import { AddOccupationInput } from './AddOccupationInput';
import { DEFAULT_TAGS, ROTATIONS, type TagItem } from './constants';

export function SelectableTags() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<string[]>([]);

  const toggle = useCallback((slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const addCustomItem = useCallback(
    (value: string) => {
      const slug = value.toLowerCase().replace(/\s+/g, '-');
      if (selected.has(slug) || DEFAULT_TAGS.some(o => o.slug === slug)) return;
      setCustomItems(prev => [...prev, value]);
      setSelected(prev => new Set(prev).add(slug));
    },
    [selected]
  );

  const removeCustomItem = useCallback((slug: string) => {
    setCustomItems(prev =>
      prev.filter(v => v.toLowerCase().replace(/\s+/g, '-') !== slug)
    );
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
  }, []);

  const allItems: (TagItem & { isCustom: boolean })[] = [
    ...DEFAULT_TAGS.map(o => ({ ...o, isCustom: false })),
    ...customItems.map(v => ({
      slug: v.toLowerCase().replace(/\s+/g, '-'),
      label: v,
      isCustom: true,
    })),
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex max-w-[704px] flex-wrap items-center justify-center gap-2">
        <AnimatePresence mode="popLayout">
          {allItems.map((item, i) => {
            const isSelected = selected.has(item.slug);
            return (
              <motion.button
                key={item.slug}
                type="button"
                layout
                onClick={() =>
                  item.isCustom
                    ? removeCustomItem(item.slug)
                    : toggle(item.slug)
                }
                initial={
                  item.isCustom ? { opacity: 0, filter: 'blur(4px)' } : false
                }
                animate={{
                  rotate: isSelected ? ROTATIONS[i % ROTATIONS.length] : 0,
                  scale: isSelected ? 1.02 : 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  filter: 'blur(4px)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 480,
                  damping: 50,
                  mass: 1,
                }}
                className={cn(
                  'flex h-12 items-center gap-2 rounded-full border text-[17px] font-medium transition-colors',
                  item.isCustom
                    ? 'border-transparent bg-violet-200 px-4 text-gray-8'
                    : isSelected
                      ? 'border-gray-3 bg-violet-200 px-4 text-gray-7'
                      : 'border-gray-3 bg-white px-4 text-gray-7 hover:border-gray-4'
                )}
              >
                {item.label}
                {item.isCustom && (
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-8"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="currentColor"
                      opacity="0.15"
                    />
                    <path
                      d="M15 9L9 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 9L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <AddOccupationInput onAdd={addCustomItem} />
    </div>
  );
}
