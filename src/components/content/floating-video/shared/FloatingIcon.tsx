import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '../../../../utils/cn';

export const FloatingIconRoot = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof Primitive.div> & { className?: string }
>(({ className, style, ...props }, ref) => (
  <Primitive.div
    ref={ref}
    className={cn(
      'w-10 h-10 rounded-lg flex items-center justify-center',
      'hover:bg-white-024',
      className
    )}
    style={style}
    {...props}
  />
));
