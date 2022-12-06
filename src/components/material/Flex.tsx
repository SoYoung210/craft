import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { styled, StitchesCssType } from '../../../stitches.config';
import useMergeCss from '../../hooks/useMergeCss';

type FlexStyledDivProps = ComponentPropsWithoutRef<typeof FlexStyleDiv>;
export interface FlexProps extends FlexStyledDivProps {
  direction?: StitchesCssType['flexDirection'];
  alignItems?: StitchesCssType['alignItems'];
  justifyContent?: StitchesCssType['justifyContent'];
}

const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const {
    css: cssFromProps,
    direction,
    alignItems,
    justifyContent,
    ...restProps
  } = props;

  const css = useMergeCss(
    {
      flexDirection: direction,
      alignItems,
      justifyContent,
    },
    cssFromProps
  );
  return <FlexStyleDiv ref={ref} css={css} {...restProps} />;
});

const FlexStyleDiv = styled(Primitive.div, {
  display: 'flex',
});

export default Flex;
