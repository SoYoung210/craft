import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, CSSProperties, forwardRef } from 'react';

import { cn } from '../../utils/cn';

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export interface FlexProps extends PrimitiveDivProps {
  direction?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
}

const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const {
    className,
    style: styleFromProps,
    direction,
    alignItems,
    justifyContent,
    ...restProps
  } = props;

  const style: CSSProperties = {
    ...styleFromProps,
    flexDirection: direction,
    alignItems,
    justifyContent,
  };

  return (
    <Primitive.div
      ref={ref}
      className={cn('flex', className)}
      style={style}
      {...restProps}
    />
  );
});

export default Flex;
