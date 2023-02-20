import { ReactNode } from 'react';

import { createContext } from '../../utility/createContext';

import { ToastContent, ToastOptions, ToastProps } from './model';

export interface ToastContextValue {
  message: (content: ToastContent, options?: ToastOptions) => string;
  error: (content: ToastContent, options?: ToastOptions) => string;
  success: (content: ToastContent, options?: ToastOptions) => string;
  warning: (content: ToastContent, options?: ToastOptions) => string;
  update: (id: string, props: ToastProps) => void;
  remove: (id: string) => void;
  removeAll: VoidFunction;
}

export interface ToastProviderProps {
  limit: number;
  children: ReactNode;
  autoClose?: number;
}

export const [ToastContextProvider, useToastContext] =
  createContext<ToastContextValue>('Toast');
