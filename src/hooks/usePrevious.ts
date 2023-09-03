import { useRef, useMemo } from 'react';

export function usePrevious<T>(value: T) {
  const ref = useRef({ value, previous: value });

  return useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
