import { composeEventHandlers } from '@radix-ui/primitive';
import {
  useCallback,
  useRef,
  PointerEventHandler,
  HTMLAttributes,
} from 'react';

import { styled } from '../../../../stitches.config';

import { listGlowItemSelector, listGlowX, listGlowY } from './constants';
import { ListItem, ListItemContent } from './ListItem';

export function GlowCursorList(props: HTMLAttributes<HTMLUListElement>) {
  const { children, onPointerMove, ...restProps } = props;
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
    <Ul
      ref={listRef}
      onPointerMove={composeEventHandlers(onPointerMove, updateCursor)}
      {...restProps}
    >
      {children}
    </Ul>
  );
}

const Ul = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',
  width: '100%',

  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 8,

  '&:hover': {
    [`${listGlowItemSelector}`]: {
      '&::after, &::before': {
        opacity: 1,
      },
    },
  },
});

GlowCursorList.Item = ListItem;
GlowCursorList.ItemContent = ListItemContent;
