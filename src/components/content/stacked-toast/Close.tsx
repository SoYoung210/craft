import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';

import XIcon from '../../../images/icons/x.svg';
import { styled } from '../../../../stitches.config';

import { useToastContext, useToastItemContext } from './context';

type ToastCloseButtonProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export const Close = forwardRef<HTMLButtonElement, ToastCloseButtonProps>(
  (props, ref) => {
    const { id } = useToastItemContext('Toast.Close');
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

type ToastCloseIconButtonProps = ComponentPropsWithoutRef<
  typeof StyledIconButton
>;
export const CloseIconButton = forwardRef<
  HTMLButtonElement,
  ToastCloseIconButtonProps
>((props, ref) => {
  const { id } = useToastItemContext('Toast.Close');
  const { remove } = useToastContext('Toast.Close');

  return (
    <StyledIconButton
      {...props}
      ref={ref}
      onClick={composeEventHandlers(props.onClick, () => remove(id))}
      aria-label="toast close button"
      asChild
    >
      <Close>
        <XIcon />
      </Close>
    </StyledIconButton>
  );
});

const BaseButton = styled(Primitive.button, {
  width: 22,
  height: 22,
  background: '#F5F5F5',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  borderRadius: 11,
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

export const CloseAllButton = () => {
  return (
    <ExpandAnimationIconButton>
      <StyledXIcon />
      <ButtonText>모두 지우기</ButtonText>
    </ExpandAnimationIconButton>
  );
};

const StyledXIcon = styled(XIcon, {
  transition: 'opacity 0.16s linear, transform 0.3s linear',
  flexShrink: 0,
  transform: 'translateX(4px)',
});
const ButtonText = styled('span', {
  opacity: 0,
  transition: 'opacity 0.24s linear, transform 0.24s linear',
  transitionDelay: '0.12s',
  display: 'block',
  flexShrink: 0,
  width: 71,
  color: '#566372',
  fontSize: 10,
  lineHeight: 1.2,
});

const ExpandAnimationIconButton = styled(StyledIconButton, {
  justifyContent: 'flex-start',
  transition: 'width 0.3s linear',

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
