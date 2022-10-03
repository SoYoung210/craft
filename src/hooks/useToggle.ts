import { useState, SetStateAction, useRef, useCallback } from 'react';

export function useToggle<T>(initialValue: T, options: [T, T]) {
  const [state, setState] = useState(initialValue);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const toggle = useCallback((value?: SetStateAction<T>) => {
    console.log('value', value);
    if (typeof value !== 'undefined') {
      setState(value);
    } else {
      setState(current => {
        if (current === optionsRef.current[0]) {
          return optionsRef.current[1];
        }

        return optionsRef.current[0];
      });
    }
  }, []);

  return [state, toggle] as const;
}

export function useBooleanToggle(initialValue = false) {
  return useToggle(initialValue, [true, false]);
}
