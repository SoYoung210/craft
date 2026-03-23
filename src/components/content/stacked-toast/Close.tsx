import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';

import XIcon from '../../../images/icons/x.svg';
import { cn } from '../../../utils/cn';

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

const iconButtonStyles =
  'absolute -top-2 -left-2.5 flex items-center justify-center w-[22px] h-[22px] bg-[#F5F5F5] border border-[rgba(0,0,0,0.06)] rounded-[11px]';

interface ToastCloseIconButtonProps
  extends ComponentPropsWithoutRef<typeof Primitive.button> {
  toastId: string;
  className?: string;
}
export const CloseIconButton = forwardRef<
  HTMLButtonElement,
  ToastCloseIconButtonProps
>(({ toastId, className, ...props }, ref) => {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(iconButtonStyles, className)}
      aria-label="toast close button"
      asChild
    >
      <Close toastId={toastId}>
        <XIcon />
      </Close>
    </Primitive.button>
  );
});

interface CloseAllButtonProps extends ComponentPropsWithoutRef<typeof Primitive.button> {
  className?: string;
}

export const CloseAllButton = (props: CloseAllButtonProps) => {
  const { className, ...restProps } = props;
  return (
    <Primitive.button
      {...restProps}
      className={cn(
        iconButtonStyles,
        'justify-start transition-[width] duration-[0.35s] ease-linear overflow-hidden',
        'group/closeall',
        'hover:w-[71px] focus:w-[71px] focus-visible:w-[71px]',
        className
      )}
      asChild
    >
      <CloseAll>
        <XIcon
          className={cn(
            'transition-[opacity,transform] duration-[0.15s] ease-linear shrink-0 translate-x-1',
            'group-hover/closeall:opacity-0 group-hover/closeall:-translate-x-2.5',
            'group-focus/closeall:opacity-0 group-focus/closeall:-translate-x-2.5',
            'group-focus-visible/closeall:opacity-0 group-focus-visible/closeall:-translate-x-2.5'
          )}
        />
        <span
          className={cn(
            'opacity-0 transition-[opacity,transform] duration-[0.29s] ease-linear block shrink-0 w-[71px]',
            'text-[#626A72] font-semibold text-[10px] leading-[1.2]',
            'group-hover/closeall:opacity-100 group-hover/closeall:-translate-x-[13px]',
            'group-focus/closeall:opacity-100 group-focus/closeall:-translate-x-[13px]',
            'group-focus-visible/closeall:opacity-100 group-focus-visible/closeall:-translate-x-[13px]'
          )}
        >
          모두 지우기
        </span>
      </CloseAll>
    </Primitive.button>
  );
};
