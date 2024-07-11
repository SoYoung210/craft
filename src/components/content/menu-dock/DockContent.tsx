// like radix-ui Tab.Content

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { forwardRef, ReactElement } from 'react';

import { styled } from '../../../../stitches.config';

import { useMenuDockContext } from './context';

// index -> value is better
export interface DockContentProps {
  children: React.ReactNode;
  index: number;
  bottomAddon?: ReactElement;
}
const xAmount = 290;
const yAmount = 40;
const yRotate = 18;
const x = {
  left: -1.08 * xAmount,
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
      y: yAmount * 1.1,
      rotateY: direction < 0 ? rotateY.left : rotateY.right,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 400,
    };
  },
};
export const DockContentImpl = forwardRef<HTMLDivElement, DockContentProps>(
  (props, ref) => {
    const { children, index, bottomAddon, ...restProps } = props;
    const { activeIndex, direction } = useMenuDockContext('DockContent');
    const visible = activeIndex === index;
    const animationDirection = direction === 'clockwise' ? 1 : -1;

    return (
      <AnimatePresence
        initial={false}
        custom={{ direction: animationDirection }}
      >
        {visible ? (
          <MotionRoot
            ref={ref}
            key={index}
            custom={{ direction: animationDirection }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              duration: 0.6,
              bounce: 0.1,
            }}
            {...restProps}
          >
            {children}
            <Fog>{bottomAddon}</Fog>
          </MotionRoot>
        ) : null}
      </AnimatePresence>
    );
  }
);

const BottomAddonRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
  padding: '0 0 26px 26px',
  color: 'rgb(29,29,31)',
  fontSize: '14px',
});

const Title = styled('div', {
  fontWeight: 600,
});

const Caption = styled('div', {
  marginTop: 4,
});

const Fog = styled('div', {
  width: '100%',
  height: '46%',
  zIndex: 1,

  position: 'absolute',
  bottom: 0,
  left: 0,
  borderRadius: '0px 0px 32px 32px',

  background:
    'linear-gradient(transparent, rgba(255, 255, 255, 0.416) 58%, rgb(255, 255, 255, 0.52) 100%)',
});

const MotionRoot = styled(motion.div, {
  height: 240,
  width: 240,
  position: 'absolute',
  borderRadius: 32,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 0 8px rgba(177, 177, 177, 0.25)',

  '&::after': {
    content: '',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    boxShadow: 'inset 0 0 1px rgba(0,0,0,0.12)',
    borderRadius: 'inherit',
  },
});

export const DockContent = Object.assign(DockContentImpl, {
  BottomAddonRoot,
  Title,
  Caption,
});
