import { useCallback, useMemo } from 'react';

import type { RequiredKeys } from '../../../utils/type';
import { useQueue } from '../../../hooks/useQueue';

import { ToastProps } from './model';

export default function useToastState({ limit }: { limit: number }) {
  const {
    state,
    queue,
    update: updateToast,
    clearPendingQueue,
  } = useQueue<RequiredKeys<ToastProps, 'id'>>({
    initialValues: [],
    limit,
  });

  const add = useCallback(
    (toast: ToastProps) => {
      const id = toast.id ?? getToastId();

      updateToast(toasts => {
        const hasSameId = toast.id && toasts.some(n => n.id === toast.id);
        if (hasSameId) {
          console.warn(
            `id가 ${toast.id}인 토스트가 이미 존재하여 새롭게 추가되지 않습니다.`
          );
          return toasts;
        }

        return [...toasts, { ...toast, id }];
      });

      toast.onOpen?.();
      return id;
    },
    [updateToast]
  );

  const update = useCallback(
    (id: string, toast: ToastProps) => {
      updateToast(toasts => {
        const toastId = toast.id ?? getToastId();
        const index = toasts.findIndex(n => n.id === id);

        if (index === -1) {
          return toasts;
        }

        const newToasts = [...toasts];
        newToasts[index] = {
          ...toast,
          id: toastId,
        };

        return newToasts;
      });
    },
    [updateToast]
  );
  const remove = useCallback(
    (id: string) => {
      updateToast(toasts =>
        toasts.filter(notification => {
          if (notification.id === id) {
            notification.onClose?.();
            return false;
          }

          return true;
        })
      );
    },
    [updateToast]
  );

  // TODO: ... hmm..
  const removeAll = useCallback(() => updateToast(() => []), [updateToast]);

  return useMemo(
    () => ({
      toasts: state,
      queue,
      add,
      update,
      remove,
      removeAll,
      clearPendingQueue,
    }),
    [add, clearPendingQueue, queue, remove, removeAll, state, update]
  );
}

let count = 0;
function getToastId() {
  return `uing-toast-${count++}`;
}
