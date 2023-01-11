import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef } from 'react';

import { styled } from '../../../stitches.config';

const Box = styled(Primitive.div);

export type BoxProps = ComponentPropsWithoutRef<typeof Box>;
export default Box;
