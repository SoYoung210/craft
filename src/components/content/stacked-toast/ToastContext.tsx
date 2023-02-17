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
  right: 0,
  // FIXME: same as toast defaultWidth(320) + offset 40
  width: 360,
  // top minus
  /**
   * 아이템 사이 간격에 커서가 있을때 의도치 않게 resume이 불리는 것을 방지한다.
   * item요소에서 dom을 하나 더 두고 paddingTop을 처리하는 방법은 애니메이션과 layout shift측면에서 좋지 않음.
   * 이 컴포넌트는 토스트의 래퍼이니 화면에 채워줘서 이벤트 영역을 적절히 판단한다.
   * 더 나은 방법으로는 현재 토스트 아이템의 개수를 세서 height를 동적으로 늘려주는 방법.
   */
  height: 'calc(100vh - 20px)',
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
