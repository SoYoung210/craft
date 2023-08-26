import { Root, Portal, Content, DialogProps } from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { motion } from 'framer-motion';
import { styled } from '@stitches/react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';

import { If } from '../../utility/If';

import { SwitchTabProvider, useSwitchTabContext } from './context';
export interface SwitchTabProps extends DialogProps {
  open: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function SwitchTab(props: SwitchTabProps) {
  const {
    children,
    value: valueFromProps,
    defaultValue,
    onValueChange,
    ...restProps
  } = props;

  const [value, setValue] = useControllableState({
    prop: valueFromProps,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });

  return (
    <Root {...restProps}>
      <Portal>
        <StyledContent>
          <SwitchTabProvider value={value} onValueChange={setValue}>
            {children}
          </SwitchTabProvider>
        </StyledContent>
      </Portal>
    </Root>
  );
}

export interface ItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
const Item = forwardRef<HTMLButtonElement, ItemProps>((props, ref) => {
  const { children, value, onFocus, ...restProps } = props;
  const { onValueChange, value: valueFromContext } =
    useSwitchTabContext('Item');
  const selected = value === valueFromContext;
  console.log('selected', selected, value);

  return (
    <StyledItem
      ref={ref}
      onClick={() => {
        console.log('clicked');
      }}
      onFocus={composeEventHandlers(onFocus, () => {
        onValueChange(value);
      })}
      {...restProps}
    >
      {children}
      <If condition={selected}>
        <Indicator />
      </If>
    </StyledItem>
  );
});

const Indicator = () => {
  return (
    <StyledIndicator
      layoutId="switch-tab-indicator"
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
    />
  );
};

SwitchTab.Item = Item;

const OUT_OFFSET = 20;
const RADIUS = 28;

const StyledIndicator = styled(motion.div, {
  position: 'absolute',
  top: 0,
  left: 0,
  borderRadius: 18,
  backgroundColor: 'rgba(0, 0, 0, 0.055)',
  width: '100%',
  height: '100%',

  zIndex: -1,
});

const StyledItem = styled(Primitive.button, {
  position: 'relative',

  '&:focus': {
    outline: 'none',
  },

  borderRadius: RADIUS,
  backgroundColor: 'transparent',
  resetButton: 'flex',

  width: 'min(18vw, 400px)',
  aspectRatio: '4 / 3',
});

const StyledContent = styled(Content, {
  padding: 20,
  backgroundColor: 'hsla(0,0%,100%,0.6)',
  borderRadius: RADIUS,
  backdropFilter: 'blur(12px)',
  boxShadow:
    '0 0 0 1px rgba(0,0,59,0.051),0px 8px 40px rgba(0,0,59,0.051),0px 12px 32px -16px rgba(0,0,0,0.055)',

  '&:focus': {
    outline: 'none',
  },
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 878,
  maxWidth: `calc(100vw - ${OUT_OFFSET * 2}px)`,
  overflow: 'hidden',

  display: 'flex',
  gap: '20px',
});
