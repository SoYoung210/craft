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

const StyledIconButton = styled(Primitive.button, {
  position: 'absolute',
  top: -8,
  left: -10,

  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  background: '#F5F5F5',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  borderRadius: '100%',
});
