import { motion } from 'framer-motion';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import type { MotionProps } from 'framer-motion';

import { styled } from '../../../../stitches.config';
import useTimeout from '../../../hooks/useTimeout';
import { RequiredKeys } from '../../../utils/type';

import { ToastProps } from './model';

// FIXME: remove 필요한가?
export interface AnimationItemRef {
  pause: VoidFunction;
  resume: VoidFunction;
}
interface Props extends ComponentPropsWithoutRef<typeof StyledItem> {
  children: ReactNode;
  toast: Omit<RequiredKeys<ToastProps, 'id'>, 'autoClose'>;
  remove(id: string): void;
  order: number;
  total: number;
  animation: 'slideIn' | 'scaleDown';
  autoClose: false | number;
}
const STACKING_OVERLAP = 0.8;
const SPACING = 10;
interface DynamicSlideVariantsValue {
  scale: number;
  y: number;
  opacity: number;
}
const AnimationItem = forwardRef<AnimationItemRef, Props>((props, ref) => {
  const {
    animation,
    children,
    toast,
    autoClose,
    remove,
    total,
    order,
    ...restProps
  } = props;
  const { start, clear, pause, resume } = useTimeout(() => {
    remove(toast.id);
  });
  const [paused, setPaused] = useState(false);

  const handlePause = useCallback(() => {
    pause();
    setPaused(true);
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
    setPaused(false);
  }, [resume]);

  useImperativeHandle(
    ref,
    () => ({
      pause: handlePause,
      resume: handleResume,
    }),
    [handlePause, handleResume]
  );

  useEffect(() => {
    toast.onOpen?.();
  }, [toast]);

  useEffect(() => {
    if (typeof autoClose === 'number') {
      start(autoClose);
      return clear;
    }
  }, [autoClose, clear, start]);

  const scale = 1 - order * 0.05;
  const opacity = 1 - (order / total) * 0.1;
  const y = useMemo(() => {
    if (paused) {
      return `calc(${order * 100}% + ${SPACING * order}px)`;
    }
    return `${order * 100 * (1 - STACKING_OVERLAP)}%`;
  }, [order, paused]);

  const animationVariants = useMemo(() => {
    if (paused) {
      return originGeometryVariants;
    }

    return animation === 'scaleDown' ? scaleDownVariants : slideInVariants;
  }, [animation, paused]);

  return (
    <StyledItem
      {...restProps}
      {...animationVariants}
      custom={{
        scale,
        y,
        opacity,
      }}
    >
      {children}
    </StyledItem>
  );
});

const originGeometryVariants: MotionProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: {
    initial: {},
    animate: (custom: { y: string }) => ({
      ...custom,
      scale: 1,
    }),
  },
  transition: {
    duration: 0.4,
    type: 'ease',
  },
};

const scaleDownVariants: MotionProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: {
    initial: {},
    animate: (custom: DynamicSlideVariantsValue) => custom,
    exit: {
      x: '100%',
    },
  },
  transition: {
    duration: 0.5,
    ease: [0.07, 0.19, 0.27, 1],
  },
};

const slideInVariants: MotionProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: {
    initial: {
      opacity: 0,
      x: '100%',
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      // polishing
      x: '105%',
    },
  },
  transition: {
    duration: 0.3,
    ease: [0.07, 0.19, 0.27, 1],
  },
};

const StyledItem = styled(motion.li, {
  position: 'absolute',
  top: 0,
  backdropFilter: 'blur(0.5rem)',
  background: `hsl(0 0% 100% / 40%)`,
  padding: '0 1rem',
  borderRadius: '0.5rem',
  height: 72,
  minWidth: 320,
});

export default AnimationItem;
