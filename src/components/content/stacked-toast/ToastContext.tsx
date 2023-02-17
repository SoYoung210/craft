import { Portal } from '@radix-ui/react-portal';
import { ReactNode, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Primitive } from '@radix-ui/react-primitive';

import { styled } from '../../../../stitches.config';
import InfoIcon from '../../../images/icons/info.svg';
import WarningIcon from '../../../images/icons/alert-triangle.svg';
import ErrorIcon from '../../../images/icons/alert-octagon.svg';
import SuccessIcon from '../../../images/icons/check.svg';
import { HStack, VStack } from '../../material/Stack';

import { ToastContent, ToastOptions } from './model';
import useToastState from './useToastState';
import AnimationItem, { AnimationItemRef } from './AnimationItem';
import {
  ToastContextProvider,
  ToastItemContextProvider,
  useToastContext,
} from './context';
import { Close, CloseIconButton } from './Close';

interface ToastProviderProps {
  limit: number;
  children: ReactNode;
  autoClose?: number;
}

export function ToastProvider({
  children,
  limit,
  autoClose = 3000,
}: ToastProviderProps) {
  const { toasts, add, remove, update } = useToastState({ limit });
  const itemRefs = useRef<AnimationItemRef[]>([]);

  const message = useCallback(
    (content: ToastContent, options: ToastOptions = {}) => {
      const {
        leftSlot = (
          <IconFrame>
            <IconBgFrame type="info">
              <InfoIcon />
            </IconBgFrame>
          </IconFrame>
        ),
        ...rest
      } = options;

      return add({
        content,
        leftSlot,
        ...options,
        ...rest,
      });
    },
    [add]
  );

  const error = useCallback(
    (errorContent: ToastContent, errorToastOptions: ToastOptions = {}) => {
      const {
        leftSlot = (
          <IconFrame>
            <IconBgFrame type="error">
              <ErrorIcon />
            </IconBgFrame>
          </IconFrame>
        ),
        ...rest
      } = errorToastOptions;

      return add({
        leftSlot,
        role: 'alert',
        content: errorContent,
        ...rest,
      });
    },
    [add]
  );

  const warning = useCallback(
    (warningContent: ToastContent, errorToastProps: ToastOptions = {}) => {
      const {
        leftSlot = (
          <IconFrame>
            <IconBgFrame type="warning">
              <WarningIcon />
            </IconBgFrame>
          </IconFrame>
        ),
        ...rest
      } = errorToastProps;

      return add({
        leftSlot,
        role: 'alert',
        content: warningContent,
        ...rest,
      });
    },
    [add]
  );

  const success = useCallback(
    (successContent: ToastContent, successToastProps: ToastOptions = {}) => {
      const {
        leftSlot = (
          <IconFrame>
            <IconBgFrame type="success">
              <SuccessIcon />
            </IconBgFrame>
          </IconFrame>
        ),
        ...rest
      } = successToastProps;

      return add({
        leftSlot,
        role: 'status',
        content: successContent,
        ...rest,
      });
    },
    [add]
  );

  const handlePause = useCallback(() => {
    itemRefs.current.forEach(item => {
      item.pause();
    });
  }, []);
  const handleResume = useCallback(() => {
    itemRefs.current.forEach(item => {
      item.resume();
    });
  }, []);

  return (
    <ToastContextProvider
      message={message}
      error={error}
      warning={warning}
      success={success}
      remove={remove}
      update={update}
    >
      <Portal>
        <Ol onMouseEnter={handlePause} onMouseLeave={handleResume}>
          <AnimatePresence>
            {toasts.map((toast, index) => {
              const isLatestElement = index === toasts.length - 1;
              const total = toasts.length;
              const inverseIndex = total - index - 1;
              const removeToastItem = () => remove(toast.id);

              return (
                <ToastItemContextProvider id={toast.id} key={toast.id}>
                  <ToastContentItem
                    onOpen={toast.onOpen}
                    animation={isLatestElement ? 'slideIn' : 'scaleDown'}
                    total={toasts.length}
                    order={inverseIndex}
                    remove={removeToastItem}
                    autoClose={toast.autoClose ?? autoClose}
                    ref={el => el != null && (itemRefs.current[index] = el)}
                  >
                    <HStack gap="13px" alignItems="center">
                      {toast.leftSlot}
                      <VStack gap="3px">{toast.content}</VStack>
                    </HStack>
                    {/** 전체삭제랑 개별삭제 따로 두어야 할듯? */}
                    <StyledCloseIconButton />
                  </ToastContentItem>
                </ToastItemContextProvider>
              );
            })}
          </AnimatePresence>
        </Ol>
      </Portal>
      {children}
    </ToastContextProvider>
  );
}
const Ol = styled('ol', {
  position: 'fixed',
  top: 20,
  // FIXME: same as toast defaultWidth(320) + offset 40
  right: 360,
});
const IconFrame = styled('div', {
  width: 36,
  height: 36,
  borderRadius: 8,
  backgroundColor: '$white',

  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const IconBgFrame = styled('div', {
  width: 32,
  height: 32,
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    type: {
      info: {
        backgroundColor: '#60A5FA',
      },
      success: {
        backgroundColor: '#10B981',
      },
      warning: {
        backgroundColor: '#F59E0B',
      },
      error: {
        backgroundColor: '#F87171',
      },
    },
  },
});

const ToastTitle = styled(Primitive.div, {
  fontWeight: 700,
  fontSize: 13,
  lineHeight: '17px',
  letterSpacing: '-0.2px',
  color: '#232526',
});

const ToastDescription = styled(Primitive.div, {
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '16px',
  letterSpacing: '-0.1px',
  color: '#232526',
});

const StyledCloseIconButton = styled(CloseIconButton, {
  opacity: 0,
  transition: 'opacity 0.18s ease',
});
const ToastContentItem = styled(AnimationItem, {
  '&:hover': {
    [`& ${StyledCloseIconButton}`]: {
      opacity: 1,
    },
  },
});

export const useToast = () => useToastContext('Toast');

const Toast = {
  Provider: ToastProvider,
  Title: ToastTitle,
  Description: ToastDescription,
  Close,
};

export default Toast;
