import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '../../utils/cn';

export type BoxProps = ComponentPropsWithoutRef<typeof Primitive.div> & {
  className?: string;
};

const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return <Primitive.div ref={ref} className={cn(className)} {...props} />;
  }
);

Box.displayName = 'Box';

export default Box;
