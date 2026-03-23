import { Portal } from '@radix-ui/react-portal';
import { ComponentPropsWithoutRef, ReactNode, useCallback, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Primitive } from '@radix-ui/react-primitive';

import { cn } from '../../../utils/cn';
import { HStack, VStack } from '../../material/Stack';
import { InfoIcon } from '../../material/icon/Info';
import { AlertTriangleIcon } from '../../material/icon/AlertTriangle';
import { AlertOctagonIcon } from '../../material/icon/AlertOctagon';
import { CheckIcon } from '../../material/icon/Check';

import { ToastContent, ToastOptions } from './model';
import useToastState from './useToastState';
import AnimationItem, {
  AnimationItemRef,
  SPACING,
  TOAST_HEIGHT,
} from './AnimationItem';
import { ToastContextProvider, useToastContext } from './context';
import { Close, CloseAllButton, CloseIconButton } from './Close';

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
  const { toasts, add, remove, update, removeAll } = useToastState({ limit });
  const itemRefs = useRef<AnimationItemRef[]>([]);

  const message = useCallback(
    (content: ToastContent, options: ToastOptions = {}) => {
      const {
        leftSlot = (
          <div className="w-9 h-9 rounded-lg bg-white shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#60A5FA]">
              <InfoIcon color="white" size={22} />
            </div>
          </div>
        ),
        type = 'background',
        ...rest
      } = options;

      return add({
        content,
        leftSlot,
        type,
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
          <div className="w-9 h-9 rounded-lg bg-white shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F87171]">
              <AlertOctagonIcon color="white" size={22} />
            </div>
          </div>
        ),
        type = 'foreground',
        ...rest
      } = errorToastOptions;

      return add({
        leftSlot,
        content: errorContent,
        type,
        ...rest,
      });
    },
    [add]
  );

  const warning = useCallback(
    (warningContent: ToastContent, errorToastProps: ToastOptions = {}) => {
      const {
        leftSlot = (
          <div className="w-9 h-9 rounded-lg bg-white shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F59E0B]">
              <AlertTriangleIcon color="white" size={22} />
            </div>
          </div>
        ),
        type = 'foreground',
        ...rest
      } = errorToastProps;

      return add({
        leftSlot,
        type,
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
          <div className="w-9 h-9 rounded-lg bg-white shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#10B981]">
              <CheckIcon color="white" size={22} />
            </div>
          </div>
        ),
        type = 'background',
        ...rest
      } = successToastProps;

      return add({
        leftSlot,
        type,
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

  const hasMultipleToasts = toasts.length > 1;

  return (
    <ToastContextProvider
      message={message}
      error={error}
      warning={warning}
      success={success}
      remove={remove}
      removeAll={removeAll}
      update={update}
    >
      <Portal>
        <ol
          className="fixed top-5 right-5 w-[340px]"
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
          style={{
            height:
              TOAST_HEIGHT * toasts.length +
              SPACING * Math.max(toasts.length - 1, 0),
          }}
        >
          <AnimatePresence>
            {toasts.map((toast, index) => {
              const isLatestElement = index === toasts.length - 1;
              const total = toasts.length;
              const inverseIndex = total - index - 1;
              const removeToastItem = () => remove(toast.id);

              return (
                <AnimationItem
                  role="status"
                  aria-live={
                    toast.type === 'foreground' ? 'assertive' : 'polite'
                  }
                  key={toast.id}
                  tabIndex={0}
                  onOpen={toast.onOpen}
                  animation={isLatestElement ? 'slideIn' : 'scaleDown'}
                  total={toasts.length}
                  order={inverseIndex}
                  remove={removeToastItem}
                  autoClose={toast.autoClose ?? autoClose}
                  ref={el => { if (el != null) itemRefs.current[index] = el; }}
                  className="group/toast"
                >
                  <HStack gap="13px" alignItems="center">
                    {toast.leftSlot}
                    <VStack gap="3px">{toast.content}</VStack>
                  </HStack>
                  {hasMultipleToasts && isLatestElement ? (
                    <CloseAllButton className="opacity-0 transition-opacity duration-[0.18s] ease-in-out group-hover/toast:opacity-100" />
                  ) : (
                    <CloseIconButton
                      toastId={toast.id}
                      className="opacity-0 transition-opacity duration-[0.18s] ease-in-out group-hover/toast:opacity-100"
                    />
                  )}
                </AnimationItem>
              );
            })}
          </AnimatePresence>
        </ol>
      </Portal>
      {children}
    </ToastContextProvider>
  );
}

const ToastTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Primitive.div> & { className?: string }) => (
  <Primitive.div
    className={cn(
      'font-bold text-[13px] leading-[17px] tracking-[-0.2px] text-[#232526]',
      className
    )}
    {...props}
  />
);

const ToastDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Primitive.div> & { className?: string }) => (
  <Primitive.div
    className={cn(
      'font-normal text-[13px] leading-4 tracking-[-0.1px] text-[#232526]',
      className
    )}
    {...props}
  />
);

export const useToast = () => useToastContext('Toast');

const Toast = {
  Provider: ToastProvider,
  Title: ToastTitle,
  Description: ToastDescription,
  Close,
};

export default Toast;
