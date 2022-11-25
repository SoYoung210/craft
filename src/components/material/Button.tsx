import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { getColor, ColorType } from '../../utils/color';
import { styled } from '../../../stitches.config';
import { createContext } from '../utility/createContext';
import WhenValidGrandChildren from '../utility/WhenValidGrandChildren';

type PrimitiveButtonProps = ComponentPropsWithoutRef<typeof StyledButton>;
type Size = 'xsmall' | 'small' | 'medium' | 'large';
export interface ButtonProps extends PrimitiveButtonProps {
  color?: ColorType;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  align?: 'left' | 'center';
  size?: Size;
}
interface ButtonContext {
  space: number;
}

const [ButtonProvider, useButtonContext] = createContext<ButtonContext>(
  'Button',
  {
    space: 4,
  }
);

type ButtonElement = ElementRef<typeof Primitive.button>;

const ButtonImpl = forwardRef<ButtonElement, ButtonProps>((props, ref) => {
  const {
    css,
    color = 'white',
    leftSlot,
    rightSlot,
    children,
    size,
    ...buttonProps
  } = props;
  const space = size === 'xsmall' ? 2 : size === 'small' ? 4 : 6;

  return (
    <ButtonProvider space={space}>
      <StyledButton
        ref={ref}
        {...buttonProps}
        css={{
          ...css,
          backgroundColor: getColor(color),
        }}
      >
        <WhenValidGrandChildren>
          <ButtonLeftSlotRoot>{leftSlot}</ButtonLeftSlotRoot>
        </WhenValidGrandChildren>
        {children}
        {rightSlot}
      </StyledButton>
    </ButtonProvider>
  );
});

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

export interface ButtonSlotRootProps
  extends ComponentPropsWithoutRef<typeof PrimitiveDiv> {
  side: 'left' | 'right';
}
const ButtonSlotRoot = ({
  css: cssFromProps,
  side,
  ...props
}: ButtonSlotRootProps) => {
  const { space } = useButtonContext('Button.SlotRoot');

  return (
    <PrimitiveDiv
      {...props}
      css={{ ...cssFromProps, ...getSlotSpaceStyle({ side, space }) }}
    />
  );
};

const PrimitiveDiv = styled(Primitive.div, {
  display: 'flex',
});

const ButtonLeftSlotRoot = (props: Omit<ButtonSlotRootProps, 'side'>) => {
  return <ButtonSlotRoot {...props} side="left" />;
};

const ButtonRightSlotRoot = (props: Omit<ButtonSlotRootProps, 'side'>) => {
  return <ButtonSlotRoot {...props} side="right" />;
};

function getSlotSpaceStyle(params: { space: number; side: 'left' | 'right' }) {
  const { space, side } = params;
  const marginKey = side === 'left' ? 'marginRight' : 'marginLeft';

  return {
    '& > *:first-child': {
      [marginKey]: `${space}px`,
    },
  };
}

const Button = Object.assign({}, ButtonImpl, {
  LeftSlotRoot: ButtonLeftSlotRoot,
  RightSlotRoot: ButtonRightSlotRoot,
});

export default Button;
