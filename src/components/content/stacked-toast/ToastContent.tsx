import { ComponentPropsWithRef, forwardRef, useRef } from 'react';
import { gsap } from 'gsap';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { styled } from '../../../../stitches.config';
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect';

interface ScaleDownAnimationItemProps
  extends ComponentPropsWithRef<typeof StyledItem> {
  total: number;
  index: number;
  direction?: 'top' | 'down';
}
const STACKING_OVERLAP = 0.8;
export const ScaleDownAnimationItem = forwardRef<
  HTMLLIElement,
  ScaleDownAnimationItemProps
>((props, forwardedRef) => {
  const { total, index, direction = 'down', style, ...restProps } = props;
  const itemRef = useRef<HTMLLIElement>(null);
  const composedRef = useComposedRefs(forwardedRef, itemRef);
  const inverseIndex = total - index - 1;
  const scale = 1 - inverseIndex * 0.05;
  const opacity = 1 - (inverseIndex / total) * 0.1;
  const y =
    inverseIndex *
    100 *
    (direction === 'down' ? 1 - STACKING_OVERLAP : STACKING_OVERLAP);
  const bg = `hsl(0 0% ${100 - inverseIndex * 15}% / 40%)`;

  useIsomorphicLayoutEffect(() => {
    if (itemRef.current != null) {
      gsap.to(itemRef.current, {
        scale,
        opacity,
        y,
      });
    }
  }, [bg, opacity, scale, y]);

  return (
    <StyledItem
      ref={composedRef}
      style={{
        ...style,
        background: bg,
      }}
      {...restProps}
    />
  );
});

export const SlideInAnimationItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithRef<typeof StyledItem>
>((props, forwardedRef) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const composedRef = useComposedRefs(forwardedRef, itemRef);

  useIsomorphicLayoutEffect(() => {
    if (itemRef.current != null) {
      gsap.fromTo(
        itemRef.current,
        {
          opacity: 0,
          // FIXME: toast width만큼 변경..
          x: 320,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
        }
      );
    }
  }, []);

  return <StyledItem ref={composedRef} {...props} />;
});

const StyledItem = styled('li', {
  position: 'absolute',
  top: 0,
  backdropFilter: 'blur(0.5rem)',
  background: `hsl(0 0% 100% / 40%)`,
  padding: '0 1rem',
  borderRadius: '0.5rem',
  height: 72,
  minWidth: 320,
});
