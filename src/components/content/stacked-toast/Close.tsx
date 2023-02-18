import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';

import XIcon from '../../../images/icons/x.svg';
import { styled } from '../../../../stitches.config';

import { useToastContext } from './context';
interface ToastCloseButtonProps
  extends ComponentPropsWithoutRef<typeof Primitive.button> {
  toastId: string;
}
export const Close = forwardRef<HTMLButtonElement, ToastCloseButtonProps>(
  ({ toastId: id, ...props }, ref) => {
    const { remove } = useToastContext('Toast.Close');

    return (
      <Primitive.button
        {...props}
        ref={ref}
        onClick={composeEventHandlers(props.onClick, () => remove(id))}
      />
    );
  }
);
export const CloseAll = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Primitive.button>
>((props, ref) => {
  const { removeAll } = useToastContext('Toast.CloseAll');

  return (
    <Primitive.button
      {...props}
      ref={ref}
      onClick={composeEventHandlers(props.onClick, removeAll)}
    />
  );
});

interface ToastCloseIconButtonProps
  extends ComponentPropsWithoutRef<typeof StyledIconButton> {
  toastId: string;
}
export const CloseIconButton = forwardRef<
  HTMLButtonElement,
  ToastCloseIconButtonProps
>(({ toastId, ...props }, ref) => {
  return (
    <StyledIconButton
      {...props}
      ref={ref}
      aria-label="toast close button"
      asChild
    >
      <Close toastId={toastId}>
        <XIcon />
      </Close>
    </StyledIconButton>
  );
});

const StyledIconButton = styled(Primitive.button, {
  position: 'absolute',
  top: -8,
  left: -10,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 22,
  height: 22,
  background: '#F5F5F5',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  borderRadius: 11,
});

export const CloseAllButton = (
  props: ComponentPropsWithoutRef<typeof ExpandAnimationIconButton>
) => {
  return (
    <ExpandAnimationIconButton {...props} asChild>
      <CloseAll>
        <StyledXIcon />
        <ButtonText>모두 지우기</ButtonText>
      </CloseAll>
    </ExpandAnimationIconButton>
  );
};

const StyledXIcon = styled(XIcon, {
  transition: 'opacity 0.15s linear, transform 0.25s linear',
  flexShrink: 0,
  transform: 'translateX(4px)',
});
const ButtonText = styled('span', {
  opacity: 0,
  transition: 'opacity 0.29s linear, transform 0.29s linear',
  display: 'block',
  flexShrink: 0,
  width: 71,
  color: '#626A72',
  fontWeight: 600,
  fontSize: 10,
  lineHeight: 1.2,
});

const ExpandAnimationIconButton = styled(StyledIconButton, {
  justifyContent: 'flex-start',
  transition: 'width 0.35s linear',

  overflow: 'hidden',

  '&:hover': {
    width: 71,

    [`${ButtonText}`]: {
      opacity: 1,
      transform: 'translateX(-13px)',
    },
    [`${StyledXIcon}`]: {
      opacity: 0,
      transform: 'translateX(-10px)',
    },
  },
});
