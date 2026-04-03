import { type RefObject, useCallback, useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useInfiniteScroll(ref: RefObject<HTMLDivElement | null>) {
  const oneSetHeight = useRef(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    oneSetHeight.current = el.scrollHeight / 3;
  }, [ref]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    measure();
    // Start slightly into the scroll view to allow upward scrolling cleanly
    // Wait, if we want them to see the top spacer, we MUST start at 0!
    el.scrollTop = 0;

    const handleScroll = () => {
      const h = oneSetHeight.current;
      if (h === 0) return;

      // If they scroll near the top spacer, we seamlessly jump them forward
      // to the second block, hiding the spacer forever.
      if (el.scrollTop <= 0) {
        el.scrollTop += h;
      } else if (el.scrollTop >= h * 2) {
        el.scrollTop -= h;
      }
    };

    const ro = new ResizeObserver(() => {
      measure();
    });

    el.addEventListener('scroll', handleScroll, { passive: true });
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      ro.disconnect();
    };
  }, [ref, measure]);
}
