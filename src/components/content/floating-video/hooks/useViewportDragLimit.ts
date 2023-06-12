import { useRef } from 'react';

import { useWindowSize } from '../../../../hooks/useWindowSize';

export function useViewportDragLimit<T extends HTMLElement = HTMLDivElement>(
  offset = 20
) {
  const targetRef = useRef<T>(null);
  const { width: windowWidth } = useWindowSize();

  return [
    targetRef,
    {
      left: 0,
      right: windowWidth - offset - (targetRef.current?.offsetWidth ?? 0),
      bottom: 0,
    },
  ] as const;
}
