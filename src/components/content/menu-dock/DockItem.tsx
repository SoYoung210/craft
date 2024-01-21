import { composeEventHandlers } from '@radix-ui/primitive';
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode, useMemo } from 'react';

import { styled } from '../../../../stitches.config';
import { usePrevious } from '../../../hooks/usePrevious';

import { useMenuDockContext } from './context';

const x반축길이 = 220;
const y반축길이 = 85;
const 중심좌표 = 200;
export interface DockItemProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart'
  > {
  children: ReactNode;
  index: number;
}

const origin = [0, 1, 2, 3, 4];
// const pathLength = [55, 65, 75, 85, 95];
// const pathLength = [51, 62, 74, 86, 97];
const pathLength = [7, 17, 27, 37, 47];
const midIndex = Math.floor(pathLength.length / 2);
// 개수는 5개 기준으로 작성
export function DockItem({
  children,
  index,
  onClick,
  ...restProps
}: DockItemProps) {
  const { onActiveIndexChange, activeIndex, direction, onDirectionChange } =
    useMenuDockContext('DockItem');
  const offset = Math.abs(activeIndex - midIndex);

  const orderedIndex =
    offset === 0
      ? origin
      : activeIndex > 2
      ? //next
        [...origin.slice(offset), ...origin.slice(0, offset)]
      : //prev
        [
          ...origin.slice(origin.length - offset),
          ...origin.slice(0, origin.length - offset),
        ];

  const order = orderedIndex.findIndex(i => i === index);

  const nextPathLengthValueCandidate = pathLength[order];
  const prevPathLengthValue = usePrevious(pathLength[order]);

  const nextPathLengthValue2 = useMemo(() => {
    if (direction === 'counterclockwise') {
      return nextPathLengthValueCandidate > prevPathLengthValue
        ? nextPathLengthValueCandidate - 100
        : nextPathLengthValueCandidate;
    }

    return nextPathLengthValueCandidate < prevPathLengthValue
      ? 100 + nextPathLengthValueCandidate
      : nextPathLengthValueCandidate;
  }, [direction, nextPathLengthValueCandidate, prevPathLengthValue]);

  return (
    <Item
      onClick={composeEventHandlers(onClick, () => {
        const direction = order < 2 ? 'clockwise' : 'counterclockwise';
        onActiveIndexChange(index);
        onDirectionChange(direction);
      })}
      initial={false}
      animate={{
        offsetDistance: `${nextPathLengthValue2}%`,
        scale: order === 2 ? 1.3 : 1 - Math.abs(order - 2) * 0.05,
        opacity: activeIndex === index ? 1 : 1 - Math.abs(offset) * 0.18,
        transitionEnd: {
          offsetDistance: `${absInRange(nextPathLengthValue2, 0, 100)}%`,
        },
      }}
      transition={{
        ease: [0.45, 0, 0.55, 1],
        duration: 5,
        // duration: 0.5,
      }}
      {...restProps}
    >
      {children}
    </Item>
  );
}

function absInRange(value: number, min: number, max: number) {
  return (Math.abs(value) % (max - min)) + min;
}

function generateOvalPoint(degree: number, origin = 중심좌표) {
  const radian = (degree * Math.PI) / 180;
  // const x = Math.cos(radian) * x반축길이 + origin;
  const x = Math.cos(radian) * x반축길이 + 290;
  const y = Math.sin(radian) * y반축길이 + origin;

  return { x, y };
}

const Item = styled(motion.button, {
  position: 'absolute',
  top: 0,
  left: 0,
  offsetPath:
    'path("M80.5 93.0032V68.2395C102.179 50.8165 127.503 33.912 163.6 21.3472C199.805 8.74474 246.872 0.5 312 0.5C442.114 0.5 510.116 28.4174 551.5 68.2127V95.9968L80.5 93.0032Z")',
  background: 'transparent',
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.9)',
  height: 48,
  width: 48,
  filter: 'saturate(0.9) brightness(0.9)',
  transition: 'transform 0.25s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
