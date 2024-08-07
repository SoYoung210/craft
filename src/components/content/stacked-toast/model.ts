import type { ReactNode } from 'react';

export type ToastContent = Exclude<ReactNode, null | boolean | undefined>;
export type ToastOptions = Omit<ToastProps, 'content'>;

export interface ToastProps {
  id?: string;
  autoClose?: false | number;
  content: ToastContent;
  leftSlot?: ReactNode;
  type?: 'foreground' | 'background';
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
}
