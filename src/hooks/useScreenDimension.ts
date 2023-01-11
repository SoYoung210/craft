import { useState, useCallback, useEffect } from 'react';

export interface ScreenDimensions {
  viewportHeight?: number;
  viewportWidth?: number;
  availableHeight?: number;
  availableWidth?: number;
}

export const useGetScreenDimensions = (): ScreenDimensions => {
  const [viewportHeight, setViewportHeight] = useState<number | undefined>(
    typeof window !== 'undefined' ? window.innerHeight : undefined
  );
  const [viewportWidth, setViewportWidth] = useState<number | undefined>(
    typeof window !== 'undefined' ? window.innerWidth : undefined
  );

  const [availableHeight, setAvailableHeight] = useState<number | undefined>(
    typeof window !== 'undefined'
      ? document.documentElement.clientHeight
      : undefined
  );
  const [availableWidth, setAvailableWidth] = useState<number | undefined>(
    typeof window !== 'undefined'
      ? document.documentElement.clientWidth
      : undefined
  );

  const handleMeasureWindowDimensions = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Total width and height of viewport
      const { innerHeight: newViewportHeight, innerWidth: newViewportWidth } =
        window;

      // Viewport - scrollbars if they exist
      const {
        clientHeight: newAvailableHeight,
        clientWidth: newAvailableWidth,
      } = document.documentElement;

      if (newViewportHeight !== viewportHeight) {
        setViewportHeight(newViewportHeight);
      }

      if (newViewportWidth !== viewportWidth) {
        setViewportWidth(newViewportWidth);
      }

      if (newAvailableHeight !== availableHeight) {
        setAvailableHeight(newAvailableHeight);
      }

      if (newAvailableWidth !== availableWidth) {
        setAvailableWidth(newAvailableWidth);
      }
    }
  }, [availableHeight, availableWidth, viewportHeight, viewportWidth]);

  useEffect(() => {
    handleMeasureWindowDimensions();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleMeasureWindowDimensions);

      return () =>
        window.removeEventListener('resize', handleMeasureWindowDimensions);
    }
  }, [handleMeasureWindowDimensions]);

  return { viewportHeight, viewportWidth, availableHeight, availableWidth };
};
