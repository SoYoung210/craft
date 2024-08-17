import { useCallback, useState } from 'react';

export function useActiveMode(initialValue: boolean) {
  const [activeMode, setActiveMode] = useState(initialValue);

  const activate = useCallback(() => {
    setActiveMode(true);
  }, [setActiveMode]);

  const deactivate = useCallback(() => {
    setActiveMode(false);
  }, [setActiveMode]);

  return {
    activeMode,
    activate,
    deactivate,
  };
}
