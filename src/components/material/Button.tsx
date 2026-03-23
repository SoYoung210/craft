import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { cva } from 'class-variance-authority';

import { getColor, ColorType } from '../../utils/color';
import { cn } from '../../utils/cn';
import { createContext } from '../utility/createContext';
import WhenValidGrandChildren from '../utility/WhenValidGrandChildren';

const buttonVariants = cva(
  [
    'appearance-none outline-none border-none cursor-pointer',
    'rounded-lg text-sm inline-flex items-center justify-center font-bold',
    'interactivity-medium',
    'min-h-[34px] px-2.5',
  ],
  {
    variants: {
      variant: {
        outline:
          'shadow-[0px_2px_6px_rgba(0,0,0,0.02),inset_0px_-1px_0px_rgba(0,0,0,0.06),inset_0px_0px_0px_1px_rgba(0,0,0,0.08)]',
        ghost: 'shadow-none',
      },
      size: {
        xsmall: '',
        small: '',
        medium: '',
        large: 'px-3.5',
        xlarge: 'px-4',
      },
    },
  }
);

type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

type PrimitiveButtonProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export interface ButtonProps extends PrimitiveButtonProps {
  color?: ColorType;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  align?: 'left' | 'center';
  size?: Size;
  variant?: 'outline' | 'ghost';
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
    className,
    color = 'white',
    leftSlot,
    rightSlot,
    children,
    size,
    type = 'button',
    variant = 'outline',
    style: styleFromProps,
    ...buttonProps
  } = props;
  const space = size === 'xsmall' ? 2 : size === 'small' ? 4 : 6;

  const style: CSSProperties = {
    ...styleFromProps,
    backgroundColor: getColor(color),
  };

  return (
    <ButtonProvider space={space}>
      <Primitive.button
        ref={ref}
        {...buttonProps}
        className={cn(buttonVariants({ variant, size }), className)}
        style={style}
        type={type}
      >
        <WhenValidGrandChildren>
          <ButtonLeftSlotRoot>{leftSlot}</ButtonLeftSlotRoot>
        </WhenValidGrandChildren>
        {children}
        {rightSlot}
      </Primitive.button>
    </ButtonProvider>
  );
});

export interface ButtonSlotRootProps
  extends ComponentPropsWithoutRef<'div'> {
  side: 'left' | 'right';
}
const ButtonSlotRoot = ({
  className,
  side,
  style: styleFromProps,
  ...props
}: ButtonSlotRootProps) => {
  const { space } = useButtonContext('Button.SlotRoot');
  const slotStyle = getSlotSpaceStyle({ side, space });

  return (
    <Primitive.div
      {...props}
      className={cn('flex', className)}
      style={{ ...styleFromProps, ...slotStyle }}
    />
  );
};

const ButtonLeftSlotRoot = (props: Omit<ButtonSlotRootProps, 'side'>) => {
  return <ButtonSlotRoot {...props} side="left" />;
};

const ButtonRightSlotRoot = (props: Omit<ButtonSlotRootProps, 'side'>) => {
  return <ButtonSlotRoot {...props} side="right" />;
};

function getSlotSpaceStyle(params: {
  space: number;
  side: 'left' | 'right';
}): CSSProperties {
  const { space, side } = params;
  // The original used nested CSS selectors for `& > *:first-child`.
  // Since inline styles can't target children, we apply the margin directly
  // as a simple style. The slot root wraps a single element, so this works.
  const marginKey =
    side === 'left' ? 'marginRight' : 'marginLeft';
  return { [marginKey]: `${space}px` };
}

const Button = Object.assign({}, ButtonImpl, {
  LeftSlotRoot: ButtonLeftSlotRoot,
  RightSlotRoot: ButtonRightSlotRoot,
});

export default Button;
