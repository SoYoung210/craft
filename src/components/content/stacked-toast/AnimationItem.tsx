import { motion } from 'motion/react';
import {
  ComponentPropsWithoutRef,
  CSSProperties,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import type { MotionProps, TargetAndTransition } from 'motion/react';

import { cn } from '../../../utils/cn';
import useTimeout from '../../../hooks/useTimeout';

export interface AnimationItemRef {
  pause: VoidFunction;
  resume: VoidFunction;
}
interface Props extends ComponentPropsWithoutRef<typeof motion.li> {
  children: ReactNode;
  onOpen?: VoidFunction;
  remove: VoidFunction;
  order: number;
  total: number;
  animation: 'slideIn' | 'scaleDown';
  autoClose: false | number;
  className?: string;
}
const STACKING_OVERLAP = 0.85;
export const SPACING = 10;
const SWIPE_THRESHOLD = 50;
const EXIT_OFFSET = '110%';
// TODO: toast높이를 컨텐츠에 따라 다르게 설정한다면 변경되어야 함
export const TOAST_HEIGHT = 82;

interface DynamicSlideVariantsValue {
  scale: number;
  y: number;
  opacity: number;
  visibility: CSSProperties['visibility'];
}
const AnimationItem = forwardRef<AnimationItemRef, Props>((props, ref) => {
  const {
    animation,
    children,
    onOpen,
    autoClose,
    remove,
    total,
    order,
    className,
    ...restProps
  } = props;
  const { start, clear, pause, resume } = useTimeout(() => {
    remove();
  });
  const [paused, setPaused] = useState(false);

  const handlePause = useCallback(() => {
    pause();
    setPaused(true);
  }, [pause]);

  const handleResume = useCallback(() => {
    if (typeof autoClose === 'number') {
      resume();
    }
    setPaused(false);
  }, [autoClose, resume]);

  useImperativeHandle(
    ref,
    () => ({
      pause: handlePause,
      resume: handleResume,
    }),
    [handlePause, handleResume]
  );

  useEffect(() => {
    onOpen?.();
  }, [onOpen]);

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
  const visibility = order > 2 ? 'hidden' : 'visible';

  const animationVariants = useMemo(() => {
    if (paused) {
      return originGeometryVariants;
    }

    return animation === 'scaleDown' ? scaleDownVariants : slideInVariants;
  }, [animation, paused]);

  return (
    <motion.li
      {...restProps}
      {...animationVariants}
      className={cn(
        'list-none absolute top-0 backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'bg-[rgba(245,245,245,0.7)] border border-[rgba(0,0,0,0.06)]',
        'px-4 drop-shadow-[0px_2px_10px_rgba(0,0,0,0.1)]',
        'rounded-xl min-w-[320px]',
        className
      )}
      style={{
        minHeight: TOAST_HEIGHT,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 12,
        paddingRight: 10,
      }}
      drag="x"
      whileDrag={{ cursor: 'grabbing' }}
      dragSnapToOrigin={true}
      dragConstraints={{ left: 0, right: 300 }}
      dragElastic={{ right: 1 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) {
          remove();
        }
      }}
      custom={{
        scale,
        y,
        opacity,
        visibility,
      }}
    >
      {children}
    </motion.li>
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
      visibility: 'visible',
    }),
    exit: {
      x: EXIT_OFFSET,
      opacity: 0,
    },
  },
  transition: {
    duration: 0.35,
    type: 'tween',
  },
};

const scaleDownVariants: MotionProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: {
    initial: {},
    animate: (custom: DynamicSlideVariantsValue) => custom as TargetAndTransition,
    exit: {
      x: EXIT_OFFSET,
      opacity: 0,
    },
  },
  transition: {
    duration: 0.45,
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
      x: EXIT_OFFSET,
      opacity: 0,
    },
  },
  transition: {
    duration: 0.25,
    ease: [0.07, 0.19, 0.27, 1],
  },
};

export default AnimationItem;
