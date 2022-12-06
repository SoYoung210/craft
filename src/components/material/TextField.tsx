import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { styled } from '../../../stitches.config';

type Props = ComponentPropsWithoutRef<typeof Input>;

const TextField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <Root>
      <Input ref={ref} {...props} />
    </Root>
  );
});
const Root = styled('div', {
  width: '100%',

  br: 8,
  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.15)',
  height: 40,

  py: 4,
  px: 10,

  '&:focus-within': {
    boxShadow: '0 0 0 2px #000',
  },
});

const Input = styled('input', {
  background: 'transparent',
  outline: 'none',
  appearance: 'none',
  minWidth: 0,
  border: 'none',

  width: '100%',
  height: '100%',
});

export default TextField;
