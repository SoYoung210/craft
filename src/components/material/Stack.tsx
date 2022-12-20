import { ComponentPropsWithRef, forwardRef } from 'react';

import { styled } from '../../../stitches.config';
import useMergeCss from '../../hooks/useMergeCss';
import { PrimitiveValue } from '../../utils/type';

import Flex from './Flex';

export interface StackProps
  extends Omit<ComponentPropsWithRef<typeof StackStyleDiv>, 'direction'> {
  gap: PrimitiveValue;
  selector?: string;
}
const defaultSelector = '*:not([style*="display: none"]):not([hidden])';

export const HStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    gap,
    selector = defaultSelector,
    css: cssFromProps,
    ...hStackProps
  } = props;
  const css = useMergeCss(
    {
      [`& > ${selector} + ${selector}`]: {
        marginLeft: gap,
      },
    },
    cssFromProps
  );

  return <StackStyleDiv ref={ref} css={css} direction="row" {...hStackProps} />;
});

export const VStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    gap,
    selector = defaultSelector,
    css: cssFromProps,
    ...hStackProps
  } = props;
  const css = useMergeCss(
    {
      [`& > ${selector} + ${selector}`]: {
        marginTop: gap,
      },
    },
    cssFromProps
  );

  return (
    <StackStyleDiv ref={ref} css={css} direction="column" {...hStackProps} />
  );
});

const StackStyleDiv = styled(Flex);
