import { Portal } from '@radix-ui/react-portal';
import { ReactNode, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { createContext } from '../../utility/createContext';
import { styled } from '../../../../stitches.config';

import { ToastContent, ToastOptions, ToastProps } from './model';
import useToastState from './useToastState';
import AnimationItem from './AnimationItem';

interface ToastContextValue {
  message: (content: ToastContent, options?: ToastOptions) => string;
  error: (content: ToastContent, options?: ToastOptions) => string;
  success: (content: ToastContent, options?: ToastOptions) => string;
  warning: (content: ToastContent, options?: ToastOptions) => string;
  update: (id: string, props: ToastProps) => void;
  remove: (id: string) => void;
}

interface ToastProviderProps {
  limit: number;
  children: ReactNode;
  autoClose?: number;
}

const [ToastContextProvider, useToastContext] =
  createContext<ToastContextValue>('Toast');

export function ToastProvider({
  children,
  limit,
  autoClose = 3000,
}: ToastProviderProps) {
  const { toasts, add, remove, update } = useToastState({ limit });
  const [containerPause, setContainerPause] = useState(false);

  const message = useCallback(
    (content: ToastContent, options: ToastOptions = {}) => {
      return add({
        content,
        ...options,
      });
    },
    [add]
  );

  const error = useCallback(
    (errorContent: ToastContent, errorToastOptions: ToastOptions = {}) => {
      const { leftSlot = <div>⛔️</div>, ...rest } = errorToastOptions;

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
      const { leftSlot = <div>⚠️</div>, ...rest } = errorToastProps;

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
      const { leftSlot = <div>✅</div>, ...rest } = successToastProps;

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
    setContainerPause(true);
  }, []);
  const handleResume = useCallback(() => {
    setContainerPause(false);
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
        <Ol onMouseOver={handlePause} onMouseOut={handleResume}>
          <AnimatePresence>
            {toasts.map((toast, index) => {
              const isLatestElement = index === toasts.length - 1;
              const total = toasts.length;
              const inverseIndex = total - index - 1;

              return (
                <AnimationItem
                  key={toast.id}
                  toast={toast}
                  animation={isLatestElement ? 'slideIn' : 'scaleDown'}
                  total={toasts.length}
                  order={inverseIndex}
                  remove={remove}
                  autoClose={toast.autoClose ?? autoClose}
                  shouldPause={containerPause}
                >
                  {toast.content}
                  <button onClick={() => remove(toast.id)}>hide</button>
                </AnimationItem>
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
  top: 0,
  // FIXME: same as toast defaultWidth(320)
  right: 320,
});
export const useToast = () => useToastContext('Toast');
