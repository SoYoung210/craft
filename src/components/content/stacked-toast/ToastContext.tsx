import { Portal } from '@radix-ui/react-portal';
import { ReactNode, useCallback } from 'react';

import { createContext } from '../../utility/createContext';

import { ToastContent, ToastOptions, ToastProps } from './model';
import useToastState from './useToastState';
import { ScaleDownAnimationItem, SlideInAnimationItem } from './ToastContent';

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
}

const [ToastContextProvider, useToastContext] =
  createContext<ToastContextValue>('Toast');

export function ToastProvider({ children, limit }: ToastProviderProps) {
  const { toasts, add, remove, update } = useToastState({ limit });

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
        {/* <AnimatePresence>{items}</AnimatePresence> */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            // FIXME: same as toast defaultWidth(320)
            right: 320,
          }}
        >
          <ol>
            {toasts.map((toast, index) => {
              const isLatestElement = index === toasts.length - 1;
              return isLatestElement ? (
                <SlideInAnimationItem>{toast.content}</SlideInAnimationItem>
              ) : (
                <ScaleDownAnimationItem
                  key={toast.id}
                  total={toasts.length}
                  index={index}
                >
                  {toast.content}
                </ScaleDownAnimationItem>
              );
            })}
          </ol>
        </div>
      </Portal>
      {children}
    </ToastContextProvider>
  );
}
export const useToast = () => useToastContext('Toast');
