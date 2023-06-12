import { useCallback, useState } from 'react';

type ReturnBooleanTypeFn = () => boolean;
export function useBooleanState(defaultValue: boolean | ReturnBooleanTypeFn) {
  const [value, setValue] = useState(defaultValue);

  const onSetValueToTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onSetValueToFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, onSetValueToTrue, onSetValueToFalse] as const;
}
