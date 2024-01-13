import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { styled } from '../../../../stitches.config';
import { usePrevious } from '../../../hooks/usePrevious';
import { clamp } from '../../../utils/math';

import { useMenuDockContext } from './context';
/**
 * translateY activeIndex기준으로 왼 18, 36, 54
 * 스케일은 0.9, 0.8, 0.7
 */

const x반축길이 = 200;
const y반축길이 = 80;
const 중심좌표 = 200;
// const degrees = [270, 300, 330, 0, 30, 60, 90];
// const degrees = [180, 210, 240, 270, 300, 330, 360];
const degrees = [210, 243, 270, 297, 330];
// 배열이 5개인 경우 2개까지 여유좌표가 존재해야 함
const degreesWithHiddenArea = [150, 180, 210, 243, 270, 297, 330, 360, 30];
const middleIndex = Math.floor(degrees.length / 2);
export interface DockItemProps {
  children: ReactNode;
  // TODO: offsetLeft로 계산하면 될듯
  index: number;
}
export function DockItem({ children, index }: DockItemProps) {
  const { activeIndex, setActiveIndex } = useMenuDockContext('DockItem');
  const nextIndex = middleIndex - activeIndex + index;
  const degreeIndex =
    nextIndex > degrees.length - 1
      ? 0
      : nextIndex < 0
      ? degrees.length - 1
      : nextIndex;
  const { x, y } = generateEllipsePoint(degrees[degreeIndex]);

  return (
    <Item
      onClick={() => {
        setActiveIndex(index);
      }}
      initial={{
        x,
        y,
      }}
      animate={{
        x,
        y,
      }}
    >
      {children}
    </Item>
  );
}

function generateEllipsePoint(degree: number, origin = 중심좌표) {
  const radian = (degree * Math.PI) / 180;
  const x = Math.cos(radian) * x반축길이 + origin;
  const y = Math.sin(radian) * y반축길이 + origin;

  return { x, y };
}

const Item = styled(motion.div, {
  position: 'absolute',

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
