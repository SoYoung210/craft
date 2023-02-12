import type { AriaRole, ReactNode } from 'react';

export type ToastContent = Exclude<ReactNode, null | boolean | undefined>;
export type ToastOptions = Omit<ToastProps, 'content'>;

export interface ToastProps {
  id?: string;
  preserve?: boolean;
  content: ToastContent;
  leftSlot?: ReactNode;
  role?: AriaRole;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
}
