import { CSSProperties, forwardRef } from 'react';

import { cn } from '../../utils/cn';
import { PrimitiveValue } from '../../utils/type';

import Flex, { FlexProps } from './Flex';

export interface StackProps extends Omit<FlexProps, 'direction'> {
  gap: PrimitiveValue;
  selector?: string;
}
const defaultSelector = '*:not([style*="display: none"]):not([hidden])';

export const HStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    gap,
    selector = defaultSelector,
    className,
    style: styleFromProps,
    ...hStackProps
  } = props;

  // Use CSS custom property for gap-based margin on adjacent children
  const style: CSSProperties = {
    ...styleFromProps,
    // @ts-expect-error CSS custom property
    '--stack-gap': typeof gap === 'number' ? `${gap}px` : gap,
  };

  return (
    <Flex
      ref={ref}
      className={cn('hstack', className)}
      style={style}
      direction="row"
      {...hStackProps}
    />
  );
});

export const VStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    gap,
    selector = defaultSelector,
    className,
    style: styleFromProps,
    ...vStackProps
  } = props;

  const style: CSSProperties = {
    ...styleFromProps,
    // @ts-expect-error CSS custom property
    '--stack-gap': typeof gap === 'number' ? `${gap}px` : gap,
  };

  return (
    <Flex
      ref={ref}
      className={cn('vstack', className)}
      style={style}
      direction="column"
      {...vStackProps}
    />
  );
});
