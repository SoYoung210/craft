import { composeEventHandlers } from '@radix-ui/primitive';
import {
  useCallback,
  useRef,
  PointerEventHandler,
  HTMLAttributes,
} from 'react';

import { cn } from '../../../utils/cn';

import { listGlowItemSelector, listGlowX, listGlowY } from './constants';
import { ListItem, ListItemContent } from './ListItem';

export function GlowCursorList(props: HTMLAttributes<HTMLUListElement>) {
  const { children, onPointerMove, className, ...restProps } = props;
  const listRef = useRef<HTMLUListElement>(null);
  const updateCursor: PointerEventHandler<HTMLUListElement> = useCallback(
    ({ clientX, clientY }) => {
      const itemList = listRef.current?.querySelectorAll(listGlowItemSelector);
      if (itemList == null) {
        return;
      }

      const items = Array.from(itemList);
      (items as HTMLElement[]).forEach(item => {
        const rect = item.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        item.style.setProperty(listGlowX, `${x}px`);
        item.style.setProperty(listGlowY, `${y}px`);
      });
    },
    []
  );

  return (
    <ul
      ref={listRef}
      onPointerMove={composeEventHandlers(onPointerMove, updateCursor)}
      className={cn(
        'p-0 m-0 list-none w-full grid grid-cols-3 gap-2',
        'hover:[&_[data-craft-list-glow-item]]:after:opacity-100',
        'hover:[&_[data-craft-list-glow-item]]:before:opacity-100',
        className
      )}
      {...restProps}
    >
      {children}
    </ul>
  );
}

GlowCursorList.Item = ListItem;
GlowCursorList.ItemContent = ListItemContent;
