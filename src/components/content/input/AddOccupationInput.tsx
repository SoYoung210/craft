'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/utils/cn';

import { PlusIcon } from './PlusIcon';
import { MORPH_TRANSITION } from './constants';

interface Props {
  onAdd: (value: string) => void;
}

export function AddOccupationInput({ onAdd }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const expand = () => {
    setHasInteracted(true);
    setIsExpanded(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => inputRef.current?.focus());
    });
  };

  const collapse = () => {
    setIsExpanded(false);
    setValue('');
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
    collapse();
  };

  return (
    <AnimatePresence mode="popLayout">
      {isExpanded ? (
        <motion.div
          key="expanded"
          layoutId="add-occupation"
          style={{ borderRadius: 9999 }}
          transition={MORPH_TRANSITION}
          className="flex h-12 w-[300px] items-center gap-2 border border-gray-3 bg-white pl-2 pr-1"
        >
          <motion.div
            layoutId="add-occupation-icon"
            initial={{ rotate: 0, backgroundColor: 'rgba(59,130,246,0.08)' }}
            animate={{ rotate: 45, backgroundColor: '#fafafa' }}
            transition={MORPH_TRANSITION}
            onClick={collapse}
            role="button"
            tabIndex={0}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-full p-2"
          >
            <PlusIcon size={20} color="currentColor" className="text-gray-6" />
          </motion.div>

          <div className="relative flex min-w-0 flex-1 items-center">
            <motion.span
              layoutId="add-occupation-text"
              transition={MORPH_TRANSITION}
              aria-hidden
              className="pointer-events-none absolute whitespace-nowrap text-[17px] font-medium text-gray-8/25"
              style={{ opacity: value ? 0 : 1 }}
            >
              Add Item
            </motion.span>
            <input
              ref={inputRef}
              type="text"
              value={value}
              maxLength={20}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') collapse();
              }}
              className="w-full bg-transparent text-[17px] font-medium text-gray-8 focus:outline-none"
            />
          </div>

          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={submit}
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              'bg-blue-500'
            )}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              className="rotate-180 text-white"
            >
              <path
                d="M12 19V5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12L12 19L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          key="collapsed"
          type="button"
          layoutId="add-occupation"
          style={{ borderRadius: 9999 }}
          transition={MORPH_TRANSITION}
          onClick={expand}
          className="flex h-12 cursor-pointer items-center gap-2 border border-transparent bg-[rgba(59,130,246,0.1)] pl-1 pr-6"
        >
          <motion.div
            layoutId="add-occupation-icon"
            initial={
              hasInteracted ? { rotate: 45, backgroundColor: '#fafafa' } : false
            }
            animate={{ rotate: 0, backgroundColor: 'rgba(59,130,246,0.08)' }}
            transition={MORPH_TRANSITION}
            className="flex shrink-0 items-center justify-center rounded-full p-2"
          >
            <PlusIcon
              size={20}
              color="currentColor"
              className="text-blue-500"
            />
          </motion.div>
          <motion.span
            layoutId="add-occupation-text"
            transition={MORPH_TRANSITION}
            className="whitespace-nowrap text-[17px] font-medium text-blue-500"
          >
            Add Item
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
