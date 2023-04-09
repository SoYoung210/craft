import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { styled } from '../../../stitches.config';

import { HStack } from './Stack';

interface Props extends ComponentPropsWithoutRef<typeof Input> {
  leftSlot?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, Props>((props, forwardedRef) => {
  const { leftSlot, ...inputProps } = props;
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

    return cloneElement(leftElement, {
      ...leftElement.props,
      onClick: composeEventHandlers(leftElement.props.onClick, focusToInput),
    });
  }, [focusToInput, leftSlot]);

  return (
    <Root>
      <HStack gap={8} style={{ height: '100%', alignItems: 'center' }}>
        {left}
        <Input ref={composedRef} {...inputProps} />
      </HStack>
    </Root>
  );
});
const Root = styled('div', {
  width: '100%',

  br: 8,
  boxShadow: '0 0 0 2px hsl(0 0% 90.9%)',
  height: 40,

  py: 4,
  px: 10,

  fontWeight: 500,
  transition: 'box-shadow 0.2s',

  '&:focus-within': {
    boxShadow: '0 0 0 2px hsl(0 0% 78.0%)',
  },
});

const Input = styled('input', {
  background: 'transparent',
  outline: 'none',
  appearance: 'none',
  minWidth: 0,
  border: 'none',

  width: '100%',
  height: '100%',
  fontWeight: 400,

  '&::placeholder': {
    color: '$gray5',
  },
});

export default TextField;
