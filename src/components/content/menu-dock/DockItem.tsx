import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { styled } from '../../../../stitches.config';
import useCircularArray from '../../../hooks/useCircularArray';
import { usePrevious } from '../../../hooks/usePrevious';

import { useMenuDockContext } from './context';
/**
 * translateY activeIndex기준으로 왼 18, 36, 54
 * 스케일은 0.9, 0.8, 0.7
 */

const x반축길이 = 200;
const y반축길이 = 85;
const 중심좌표 = 200;
// const degrees = [270, 300, 330, 0, 30, 60, 90];
// const degrees = [180, 210, 240, 270, 300, 330, 360];
const degrees = [210, 243, 270, 297, 330];
// 배열이 5개인 경우 2개까지 여유좌표가 존재해야 함
// const degreesWithHiddenArea = [150, 170, ...degrees, 10, 30];
// 원래 위치 보존되는거: [297, 330, ...degrees, 210, 243];
// 양 끝 두개의 값은 사라지는 좌표...
const degreesWithHiddenArea = [120, 160, ...degrees, 20, 60];
export interface DockItemProps {
  children: ReactNode;
  index: number;
  onClick?: () => void;
  degree: number;
}
export function DockItem({ children, index, onClick, degree }: DockItemProps) {
  const { x, y } = generateEllipsePoint(degree);

  return (
    <Item
      onClick={e => {
        // setActiveIndex(index);
        onClick?.(e);
      }}
      initial={{
        x,
        y,
      }}
      animate={{
        x,
        y,
        // scale:
        //   activeIndex === index
        //     ? 1.3
        //     : 1 - Math.abs(activeIndex - index) * 0.03,
        // opacity:
        //   activeIndex === index ? 1 : 1 - Math.abs(activeIndex - index) * 0.18,
      }}
      transition={{
        ease: [0.45, 0, 0.55, 1],
        duration: 0.18,
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
