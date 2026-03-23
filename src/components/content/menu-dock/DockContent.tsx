// like radix-ui Tab.Content

import { AnimatePresence, motion, Variants } from 'motion/react';
import { ComponentPropsWithoutRef, forwardRef, ReactElement } from 'react';

import { cn } from '../../../utils/cn';

import { useMenuDockContext } from './context';

// index -> value is better
export interface DockContentProps {
  children: React.ReactNode;
  index: number;
  bottomAddon?: ReactElement;
  className?: string;
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
    const { children, index, bottomAddon, className, ...restProps } = props;
    const { activeIndex, direction } = useMenuDockContext('DockContent');
    const visible = activeIndex === index;
    const animationDirection = direction === 'clockwise' ? 1 : -1;

    return (
      <AnimatePresence
        initial={false}
        custom={{ direction: animationDirection }}
      >
        {visible ? (
          <motion.div
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
            className={cn(
              'h-[240px] w-[240px] absolute rounded-[32px] flex items-center',
              'shadow-[0_0_8px_rgba(177,177,177,0.25)]',
              'after:content-[""] after:w-full after:h-full after:absolute after:top-0 after:left-0',
              'after:shadow-[inset_0_0_1px_rgba(0,0,0,0.12)] after:rounded-[inherit]',
              className
            )}
            {...restProps}
          >
            {children}
            <div
              className={cn(
                'w-full h-[46%] z-[1] absolute bottom-0 left-0 rounded-[0px_0px_32px_32px]',
                'bg-[linear-gradient(transparent,rgba(255,255,255,0.416)_58%,rgba(255,255,255,0.52)_100%)]'
              )}
            >
              {bottomAddon}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
);

const BottomAddonRoot = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { className?: string }) => (
  <div
    className={cn(
      'flex flex-col justify-end h-full pb-[26px] pl-[26px] text-[rgb(29,29,31)] text-sm',
      className
    )}
    {...props}
  />
);

const Title = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { className?: string }) => (
  <div className={cn('font-semibold', className)} {...props} />
);

const Caption = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { className?: string }) => (
  <div className={cn('mt-1', className)} {...props} />
);

export const DockContent = Object.assign(DockContentImpl, {
  BottomAddonRoot,
  Title,
  Caption,
});
