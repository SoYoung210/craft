import { useCallback, useMemo, useState } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

import { Position } from '../types';
import { getAngleBetweenPositions } from '../../../../utils/math';

interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

interface Options {
  springMotion?: SpringOptions;
  initial?: boolean;
}
const ringPercent = 87.4;
// enhance: fit to more or less than 8 sections
export function useSelectionAngle(
  initialValue: number,
  config: Options = {
    springMotion: {
      stiffness: 500,
      damping: 30,
      mass: 1,
    },
    initial: false,
  }
) {
  const [selectionAngle, setSelectionAngle] = useState(initialValue);

  const restSelectionBgAngle = useMotionValue('360deg');
  const springSelectionAngle = useSpring(selectionAngle, config.springMotion);

  const updateSelectionAngle = useCallback(
    (currentPosition: Position, prevPosition: Position) => {
      const angle = getAngleBetweenPositions(prevPosition, currentPosition);
      const sectionIndex = (getActiveSection(angle) + 1) % 8;
      const currentAngle = springSelectionAngle.get();
      let nextAngle = (45 * sectionIndex + 270) % 360;

      const delta = nextAngle - currentAngle;
      if (delta > 180) {
        nextAngle -= 360;
      } else if (delta < -180) {
        nextAngle += 360;
      }

      if (currentAngle === initialValue && !config.initial) {
        springSelectionAngle.jump(nextAngle);
      } else {
        springSelectionAngle.set(nextAngle);
      }
      restSelectionBgAngle.set(`${ringPercent}%`);

      setSelectionAngle(nextAngle);

      return sectionIndex;
    },
    [config.initial, initialValue, restSelectionBgAngle, springSelectionAngle]
  );

  return useMemo(() => {
    return {
      restSelectionBgAngle,
      springSelectionAngle,
      updateSelectionAngle,
    };
  }, [restSelectionBgAngle, springSelectionAngle, updateSelectionAngle]);
}

const getActiveSection = (angle: number) => {
  /**
   * NOTE: RadialMenuItem 아이템 시작점과 맞추기 위해 180도 플러스
   */
  let startPositionAdjustedAngle = angle + 180; // 시작점 보정
  if (startPositionAdjustedAngle > 360) {
    startPositionAdjustedAngle -= 360;
  }
  const adjustedAngle = startPositionAdjustedAngle % 360; // Shift by 22.5 degrees to center sections
  return Math.floor(adjustedAngle / 45) % 8; // Divide by 45 degrees per section
};
