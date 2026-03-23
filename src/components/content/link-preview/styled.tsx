import * as RadixTooltip from '@radix-ui/react-tooltip';
import { forwardRef, ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../utils/cn';

const Content = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(({ className, ...props }, ref) => {
  return (
    <>
      <style>{`
        @keyframes lp-shiny {
          from {
            mask-position: 100%;
            -webkit-mask-position: 100%;
          }
          to {
            mask-position: 0;
            -webkit-mask-position: 0;
          }
        }
        @keyframes lp-loading-skeleton {
          from {
            background-position: -468px 0;
          }
          to {
            background-position: 468px 0;
          }
        }
      `}</style>
      <RadixTooltip.Content
        ref={ref}
        className={cn(
          'bg-white rounded-xl p-2 shadow-[0px_9px_15px_3px_rgba(0,0,0,0.09)]',
          className
        )}
        {...props}
      />
    </>
  );
});

interface ImageProps extends ComponentPropsWithoutRef<'img'> {}
const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn(
          'rounded-[9px] w-[200px] h-[120px] object-cover object-top',
          className
        )}
        style={{
          maskImage: `linear-gradient(
            60deg,
            black 25%,
            rgba(0, 0, 0, 0.5) 50%,
            black 75%
          )`,
          maskSize: '400%',
          maskPosition: '100%',
          animation: 'lp-shiny 1s ease',
          ...style,
        }}
        {...props}
      />
    );
  }
);

export const LoadingSkeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'relative w-[200px] h-[120px] rounded-xl',
        className
      )}
      style={{
        animation: 'lp-loading-skeleton 1.25s infinite linear forwards',
        background:
          'linear-gradient(to right, #eeeeee 10%, #dddddd 18%, #eeeeee 33%)',
        backgroundSize: '800px 100%',
      }}
      {...props}
    />
  );
};

export const Tooltip = {
  ...RadixTooltip,
  Content,
  Image,
};
