import { composeEventHandlers } from '@radix-ui/primitive';
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { styled } from '../../../../stitches.config';

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

const origin = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export function DockItem({
  children,
  index,
  onClick,
  ...restProps
}: DockItemProps) {
  const { onActiveIndexChange, degrees, activeIndex } =
    useMenuDockContext('DockItem');

  const offset = Math.abs(activeIndex - 4);

  const orderedIndex =
    offset === 0
      ? origin
      : activeIndex > 4
      ? //next
        [...origin.slice(offset), ...origin.slice(0, offset)]
      : //prev
        [
          ...origin.slice(origin.length - offset),
          ...origin.slice(0, origin.length - offset),
        ];
  const order = orderedIndex.findIndex(i => i === index);
  const orderAbs = Math.abs(order - 4);
  const { x, y } = generateEllipsePoint(degrees[index]);

  return (
    <Item
      onClick={composeEventHandlers(onClick, () => {
        onActiveIndexChange(index);
      })}
      initial={{
        x,
        y,
      }}
      animate={{
        x,
        y,
        scale: activeIndex === index ? 1.3 : 1 - orderAbs * 0.05,
        opacity: activeIndex === index ? 1 : 1 - orderAbs * 0.18,
      }}
      transition={{
        ease: [0.45, 0, 0.55, 1],
        duration: 0.18,
      }}
      {...restProps}
    >
      {children}
    </Item>
  );
}

function generateEllipsePoint(degree: number, origin = 중심좌표) {
  const radian = (degree * Math.PI) / 180;
  // const x = Math.cos(radian) * x반축길이 + origin;
  const x = Math.cos(radian) * x반축길이 + 290;
  const y = Math.sin(radian) * y반축길이 + origin;

  return { x, y };
}

const Item = styled(motion.button, {
  position: 'absolute',

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
