import {
  Root,
  Portal,
  Content,
  Overlay,
  DialogProps,
} from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { styled } from '@stitches/react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
export interface SwitchTabProps extends DialogProps {
  open: boolean;
}

export function SwitchTab(props: SwitchTabProps) {
  const { children, ...restProps } = props;
  return (
    <Root {...restProps}>
      <Portal>
        <StyledContent>{children}</StyledContent>
      </Portal>
    </Root>
  );
}

const Item = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const { children, ...restProps } = props;
  return (
    <StyledItem
      ref={ref}
      onClick={() => {
        console.log('clicked');
      }}
      {...restProps}
    >
      {children}
    </StyledItem>
  );
});

SwitchTab.Item = Item;

const OUT_OFFSET = 20;
const StyledContent = styled(Content, {
  padding: 20,
  backgroundColor: 'hsla(0,0%,100%,0.6)',
  borderRadius: '28px',
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
  maxWidth: `calc(100vw - ${OUT_OFFSET * 2}px)`,
  overflow: 'hidden',

  display: 'flex',
  gap: '20px',
});

const StyledItem = styled(Primitive.button, {
  '&:focus': {
    color: 'red',
  },

  backgroundColor: 'transparent',
  resetButton: 'flex',

  width: '18vw',
  aspectRatio: '4 / 3',
});
