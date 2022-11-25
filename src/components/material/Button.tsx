import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { getColor, ColorType } from '../../utils/color';
import { styled } from '../../../stitches.config';

type PrimitiveButtonProps = ComponentPropsWithoutRef<typeof StyledButton>;
export interface ButtonProps extends PrimitiveButtonProps {
  color?: ColorType;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  align?: 'left' | 'center';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
}

type ButtonElement = ElementRef<typeof Primitive.button>;

const Button = forwardRef<ButtonElement, ButtonProps>(
  ({ css, color = 'white', ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        {...props}
        css={{
          ...css,
          backgroundColor: getColor(color),
        }}
      />
    );
  }
);

const StyledButton = styled(Primitive.button, {
  appearance: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',

  borderRadius: 8,
  fontSize: '14px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  boxShadow:
    '0px 2px 6px rgba(0, 0, 0, 0.02), inset 0px -1px 0px rgba(0, 0, 0, 0.06), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.08)',

  interactivity: 'medium',
});

export default Button;
