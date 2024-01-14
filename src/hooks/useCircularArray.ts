import { useCallback, useState } from 'react';

export default function useCircularArray<T>(initialArray: T[]) {
  const [arr, setArr] = useState(initialArray);

  const next = useCallback((step = 1) => {
    setArr(prevList => {
      return [...prevList.slice(step), ...prevList.slice(0, step)];
    });
  }, []);

  const prev = useCallback((step = 1) => {
    setArr(prevList => {
      return [
        ...prevList.slice(prevList.length - step),
        ...prevList.slice(0, prevList.length - step),
      ];
    });
  }, []);

  return [arr, { next, prev }] as const;
}
