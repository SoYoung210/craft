import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

import { cn } from '../../../../utils/cn';

import { PlayControl as PlayControlRaw } from './PlayControl';

interface VideoControllerProps extends ComponentPropsWithoutRef<typeof Primitive.div> {
  children: ReactNode;
  className?: string;
}
const VideoControllerImpl = forwardRef<HTMLDivElement, VideoControllerProps>(
  (props, ref) => {
    const { children, className, ...restProps } = props;

    return (
      <Primitive.div
        ref={ref}
        className={cn(
          'relative group/video',
          'after:content-[""] after:opacity-0 after:transition-opacity after:duration-[0.24s] after:ease-out-cubic',
          'after:absolute after:inset-0 after:w-full after:h-full after:bg-black/18',
          'hover:after:opacity-100',
          '[&>div]:leading-[0]',
          className
        )}
        {...restProps}
      >
        {children}
      </Primitive.div>
    );
  }
);

const BottomControlContainer = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { className?: string }) => (
  <div
    className={cn(
      'absolute bottom-1.5 w-[95%] left-1/2 -translate-x-1/2 z-[2]',
      'opacity-0 transition-opacity duration-[0.24s] ease-out-cubic',
      'group-hover/video:opacity-100',
      className
    )}
    {...props}
  />
);

const PlayControl = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof PlayControlRaw> & { className?: string }
>(({ className, ...props }, ref) => (
  <PlayControlRaw
    ref={ref}
    className={cn(
      'opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]',
      'scale-100 transition-opacity duration-[0.24s] ease-out-cubic',
      'group-hover/video:opacity-100',
      className
    )}
    {...props}
  />
));

export const VideoController = Object.assign({}, VideoControllerImpl, {
  PlayControl,
  BottomControlContainer,
});
