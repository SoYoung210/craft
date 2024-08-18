import { useCallback, useRef } from 'react';

import { CURSOR as ACTIVE_CURSOR } from '../constants';

type Cursor = 'active' | 'hide' | 'auto';
export function useCursor<T extends HTMLElement>() {
  const cursorTargetRef = useRef<T>(null);
  const changeCursor = useCallback((cursor: Cursor) => {
    const targetCursor = CURSOR_RECORD[cursor];
    if (cursorTargetRef.current != null) {
      cursorTargetRef.current.style.cursor = targetCursor;
    }
  }, []);

  return [cursorTargetRef, changeCursor] as const;
}

const CURSOR_RECORD: Record<Cursor, string> = {
  active: ACTIVE_CURSOR,
  hide: 'none',
  auto: 'auto',
};
