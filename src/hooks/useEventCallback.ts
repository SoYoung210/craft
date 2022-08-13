import { useRef, useCallback, useEffect } from 'react';

export default function useEventCallback<A extends any[], R = void>(
  callback: (...args: A) => R
) {
  const ref = useRef(callback);
  useEffect(() => {
    ref.current = callback;
  });
  return useCallback((...args: A) => ref.current(...args), []);
}
