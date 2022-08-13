import { useEffect } from 'react';

import useEventCallback from './useEventCallback';

export function useWindowEvent<T = any>(
  type: string,
  handler: (event: CustomEvent<T>) => void,
  options?: boolean | AddEventListenerOptions
): void;
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void;

export default function useWindowEvent<K extends string>(
  type: K,
  handler: K extends keyof WindowEventMap
    ? (event: WindowEventMap[K]) => void
    : (event: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions
) {
  const listener = useEventCallback(handler) as EventListener;

  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, [listener, options, type]);
}
