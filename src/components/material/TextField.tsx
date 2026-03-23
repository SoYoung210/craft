import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { cn } from '../../utils/cn';
import { HStack } from './Stack';

interface Props extends ComponentPropsWithoutRef<'input'> {
  leftSlot?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, Props>((props, forwardedRef) => {
  const { leftSlot, className, ...inputProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const composedRef = useComposedRefs(forwardedRef, inputRef);

  const focusToInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const left = useMemo(() => {
    if (leftSlot == null) {
      return;
    }

    const leftElement = Children.only(leftSlot);
    if (!isValidElement(leftElement)) {
      return;
    }

    return cloneElement(leftElement as ReactElement<any>, {
      ...(leftElement as ReactElement<any>).props,
      onClick: composeEventHandlers(
        (leftElement as ReactElement<any>).props.onClick,
        focusToInput
      ),
    });
  }, [focusToInput, leftSlot]);

  return (
    <div
      className={cn(
        'w-full rounded-lg h-10 py-1 px-2.5 font-medium',
        'shadow-[0_0_0_2px_hsl(0_0%_90.9%)]',
        'transition-shadow duration-200',
        'focus-within:shadow-[0_0_0_2px_hsl(0_0%_78.0%)]',
        className
      )}
    >
      <HStack gap={8} style={{ height: '100%', alignItems: 'center' }}>
        {left}
        <input
          ref={composedRef}
          className={cn(
            'bg-transparent outline-none appearance-none min-w-0 border-none',
            'w-full h-full font-normal',
            'placeholder:text-gray-5'
          )}
          {...inputProps}
        />
      </HStack>
    </div>
  );
});

export default TextField;
