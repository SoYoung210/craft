import { RefObject, useCallback, useEffect, useState } from 'react';

import { useGetScreenDimensions } from './useScreenDimension';

const DEFAULT_RADIANS = Math.PI;

// 두 좌표 사이 절대각
function getAngleRadians(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const distY = y2 - y1;
  const distX = x2 - x1;
  const result = Math.atan2(distY, distX);

  return result - Math.PI / 2;
}
// https://github.com/nwthomas/website/blob/ff4bb3389c/client/hooks/useGetMouseRadian.ts
export function useGetMouseRadian(ref: RefObject<HTMLElement>): number {
  const { viewportWidth } = useGetScreenDimensions();
  const [mouseCoordinates, setMouseCoordinates] = useState<{
    x?: number;
    y?: number;
  }>({});

  const getMouseCoordinates = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      setMouseCoordinates({ x: clientX, y: clientY });
    },
    []
  );

  useEffect(() => {
    document.addEventListener('mousemove', getMouseCoordinates);

    return () => {
      document.removeEventListener('mousemove', getMouseCoordinates);
    };
  }, [getMouseCoordinates]);

  if (
    !ref.current ||
    !viewportWidth ||
    // TODO: change to breakpoints.desktop
    viewportWidth <= 1000
  ) {
    return DEFAULT_RADIANS + DEFAULT_RADIANS / 5;
  }

  const { x: mouseX, y: mouseY } = mouseCoordinates;
  const { bottom, left, right, top } = ref.current.getBoundingClientRect();
  const elementMiddleX = (right - left) / 2 + left;
  const elementMiddleY = (bottom - top) / 2 + top;

  if (mouseX && mouseY) {
    return getAngleRadians(elementMiddleX, elementMiddleY, mouseX, mouseY);
  }

  return DEFAULT_RADIANS;
}
