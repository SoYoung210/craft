import { useCallback, useEffect, useRef } from 'react';

export default function useTimeout() {
  const timeoutIds = useRef<Array<number>>([]);

  const clearTimeout = useCallback(() => {
    if (globalThis?.document == null) {
      return;
    }

    if (timeoutIds.current.length > 0) {
      timeoutIds.current.forEach(id => {
        window.clearTimeout(id);
      });
    }
  }, []);

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    if (globalThis?.document == null) {
      return;
    }

    const newId = window.setTimeout(() => {
      callback();
      timeoutIds.current = timeoutIds.current.filter(id => id !== newId);
    }, delay);

    timeoutIds.current.push(newId);
  }, []);

  useEffect(() => {
    return clearTimeout;
  }, [clearTimeout]);

  return {
    setTimeout,
    clearTimeout,
  };
}
