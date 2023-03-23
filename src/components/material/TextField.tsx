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

  const left = Children.only(leftSlot);
  const leftSlotWithClickHandler = isValidElement(left)
    ? cloneElement(left, {
        ...left.props,
        onClick: composeEventHandlers(left.props.onClick, focusToInput),
      })
    : null;

  return (
    <Root>
      <HStack gap={8} style={{ height: '100%', alignItems: 'center' }}>
        {leftSlotWithClickHandler}
        <Input ref={composedRef} {...inputProps} />
      </HStack>
    </Root>
  );
});
const Root = styled('div', {
  width: '100%',

  br: 8,
  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.15)',
  height: 40,

  py: 4,
  px: 10,

  '&:focus-within': {
    boxShadow: '0 0 0 2px #000',
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
});

export default TextField;
