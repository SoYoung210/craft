import { composeEventHandlers } from '@radix-ui/primitive';
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode, useMemo } from 'react';

import { styled } from '../../../../stitches.config';
import { usePrevious } from '../../../hooks/usePrevious';

import { useMenuDockContext } from './context';
/**
 * translateY activeIndex기준으로 왼 18, 36, 54
 * 스케일은 0.9, 0.8, 0.7
 */

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
const pathLength = [55, 65, 75, 85, 95];
const midIndex = Math.floor(pathLength.length / 2);
// 개수는 5개 기준으로 작성
export function DockItem({
  children,
  index,
  onClick,
  ...restProps
}: DockItemProps) {
  const { onActiveIndexChange, activeIndex } = useMenuDockContext('DockItem');
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
  const prevOrder = usePrevious(order);

  const nextPathLengthValueCandidate = pathLength[order];
  const prevPathLengthValue = usePrevious(nextPathLengthValueCandidate);

  const direction = prevOrder < order ? 'next' : 'prev';

  const nextPathLengthValue2 = useMemo(() => {
    if (direction === 'next') {
      return nextPathLengthValueCandidate > prevPathLengthValue
        ? nextPathLengthValueCandidate - 100
        : nextPathLengthValueCandidate;
    }

    return nextPathLengthValueCandidate;
  }, [direction, nextPathLengthValueCandidate, prevPathLengthValue]);

  return (
    <Item
      onClick={composeEventHandlers(onClick, () => {
        onActiveIndexChange(index);
      })}
      animate={{
        offsetDistance: `${nextPathLengthValue2}%`,
        // scale: activeIndex === index ? 1.3 : 1 - Math.abs(nextOffset) * 0.05,
        opacity: activeIndex === index ? 1 : 1 - Math.abs(offset) * 0.18,
        transitionEnd: {
          offsetDistance:
            nextPathLengthValue2 < 0
              ? `${nextPathLengthValue2 + 100}%`
              : `${nextPathLengthValue2}%`,
        },
      }}
      transition={{
        ease: [0.45, 0, 0.55, 1],
        // duration: 0.18
        duration: 0.5,
      }}
      {...restProps}
    >
      {children}
    </Item>
  );
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
    'path("M551.5 118.5C551.5 150.933 525.306 180.428 482.653 201.845C440.028 223.248 381.109 236.5 316 236.5C250.891 236.5 191.972 223.248 149.347 201.845C106.693 180.428 80.5 150.933 80.5 118.5C80.5 86.0674 106.693 56.5719 149.347 35.1547C191.972 13.7522 250.891 0.5 316 0.5C381.109 0.5 440.028 13.7522 482.653 35.1547C525.306 56.5719 551.5 86.0674 551.5 118.5Z")',
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
