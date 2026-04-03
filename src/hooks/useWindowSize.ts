import { useCallback, useEffect, useState } from 'react';

import useWindowEvent from './useWindowEvent';

const eventListerOptions = {
  passive: true,
};

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const setSize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
    });
  }, []);

  // Call setSize in useEffect to ensure it runs after component mount
  useEffect(() => {
    setSize();
  }, [setSize]);

  useWindowEvent('resize', setSize, eventListerOptions);
  useWindowEvent('orientationchange', setSize, eventListerOptions);

  return windowSize;
}
