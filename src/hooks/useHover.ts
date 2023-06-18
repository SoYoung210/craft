import { useState, useEffect, useRef, useCallback } from 'react';

export function useHover<T extends HTMLElement = HTMLDivElement>() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    const element = ref.current;
    if (element != null) {
      element.addEventListener('pointerenter', onMouseEnter);
      element.addEventListener('pointerleave', onMouseLeave);

      return () => {
        element.removeEventListener('pointerenter', onMouseEnter);
        element.removeEventListener('pointerleave', onMouseLeave);
      };
    }
  }, [onMouseEnter, onMouseLeave]);

  return [ref, hovered] as const;
}
