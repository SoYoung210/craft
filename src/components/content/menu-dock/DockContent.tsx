// like radix-ui Tab.Content

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { forwardRef } from 'react';

import { styled } from '../../../../stitches.config';
import { NOISE } from '../switch-tab/constants';
import { linearGradient } from '../../../utils/color';

import { useMenuDockContext } from './context';

// index -> value is better
export interface DockContentProps {
  children: React.ReactNode;
  index: number;
}
const xAmount = 290;
const yAmount = 40;
const yRotate = 18;
const x = {
  left: -1 * xAmount,
  right: xAmount,
};

const rotateY = {
  right: yRotate,
  left: -1 * yRotate,
};
interface AnimateParams {
  direction: number;
}

const variants: Variants = {
  enter: ({ direction }: AnimateParams) => {
    return {
      x: direction > 0 ? x.left : x.right,
      rotateY: direction > 0 ? rotateY.left : rotateY.right,
      y: yAmount,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 400,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    y: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformPerspective: 400,
  },
  exit: ({ direction }: AnimateParams) => {
    return {
      zIndex: 0,
      x: direction > 0 ? x.right : x.left,
      y: yAmount,
      rotateY: direction < 0 ? rotateY.left : rotateY.right,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 400,
    };
  },
};
export const DockContent = forwardRef<HTMLDivElement, DockContentProps>(
  (props, ref) => {
    const { children, index, ...restProps } = props;
    const { activeIndex, direction } = useMenuDockContext('DockContent');
    const visible = activeIndex === index;

    return (
      <AnimatePresence initial={false}>
        {visible ? (
          <MotionRoot
            ref={ref}
            key={index}
            custom={{ direction: direction === 'clockwise' ? 1 : -1 }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              ease: [0.45, 0, 0.55, 1],
              duration: 0.5,
              opacity: { duration: 0.3 },
            }}
            {...restProps}
          >
            {children}
            <Fog />
          </MotionRoot>
        ) : null}
      </AnimatePresence>
    );
  }
);

const Fog = styled('div', {
  width: '100%',
  height: '40%',
  zIndex: 1,

  position: 'absolute',
  bottom: 0,
  left: 0,
  borderRadius: '0px 0px 32px 32px',

  background:
    'linear-gradient(to bottom, transparent, rgba(255,255,255, 0.8) 58%, rgba(255,255,255, 1) 100%)',
  opacity: 0.48,
  backdropFilter: 'blur(16px)',
});

// noise
const MotionRoot = styled(motion.div, {
  height: 240,
  width: 240,
  position: 'absolute',
  borderRadius: 32,
  display: 'flex',
  alignItems: 'center',
  backgroundImage: NOISE,
  backgroundColor: 'rgba(253, 253, 253, 0.75)',
  backdropFilter: 'blur(35px)',
});
