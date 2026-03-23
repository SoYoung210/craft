import { ComponentPropsWithoutRef, CSSProperties, useState } from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { cn } from '../../../utils/cn';
import { CSSUnit } from '../../../utils/type';

import { BorderAnimationProvider } from './context';

interface Props extends ComponentPropsWithoutRef<typeof Primitive.div> {
  width: number | `${number}${CSSUnit}`;
  radius?: number | `${number}${CSSUnit}` | 'inherit';
  className?: string;
}
export default function BorderMask(props: Props) {
  const [maskElement, setMaskElement] = useState<HTMLDivElement | null>(null);
  const { width, radius = 'inherit', children, className, style, ...boxProps } = props;
  const widthWithUnit = typeof width === 'number' ? `${width}px` : width;
  // +1px: material/Button's inset boxShadow
  const inset = `calc(-1 * ${widthWithUnit})`;

  return (
    <BorderAnimationProvider maskElement={maskElement}>
      <Primitive.div
        ref={setMaskElement}
        {...boxProps}
        className={cn(
          'absolute border border-transparent',
          className
        )}
        style={{
          ...style,
          inset,
          borderRadius: radius,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        } as CSSProperties}
      >
        <Primitive.div
          className="absolute"
          style={{ inset } as CSSProperties}
        >
          {children}
        </Primitive.div>
      </Primitive.div>
    </BorderAnimationProvider>
  );
}
