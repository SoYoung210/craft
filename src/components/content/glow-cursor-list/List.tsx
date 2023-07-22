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

// 컨텐츠를 유의미하게,, 인터페이스를 유려하게.. 잡아보면 좋을듯?
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
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  width: '100%',
});

GlowCursorList.Item = ListItem;
GlowCursorList.ItemContent = ListItemContent;
