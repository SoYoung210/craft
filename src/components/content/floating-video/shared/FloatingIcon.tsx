import { Primitive } from '@radix-ui/react-primitive';

import { styled } from '../../../../../stitches.config';

export const FloatingIconRoot = styled(Primitive.div, {
  width: 40,
  height: 40,
  borderRadius: 8,
  // backgroundColor: '$white024',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&:hover': {
    backgroundColor: '$white024',
  },
});
