import { styled } from '@stitches/react';
import { useCallback, useState } from 'react';

import useCircularArray from '../../../hooks/useCircularArray';

import { MenuDockProvider } from './context';
export interface MenuDockProps {
  children: React.ReactNode;
  initialIndex: number;
}

// const degrees = [210, 243, 270, 297, 330];
const degrees = [215, 243, 270, 297, 325];
// 배열이 5개인 경우 2개까지 여유좌표가 존재해야 함
// const degreesWithHiddenArea = [150, 170, ...degrees, 10, 30];
// 원래 위치 보존되는거: [297, 330, ...degrees, 210, 243];
// 양 끝 두개의 값은 사라지는 좌표
// const degreesWithHiddenArea = [120, 160, ...degrees, 20, 60];
const degreesWithHiddenArea = [120, 165, ...degrees, 15, 60];
export default function MenuDock({ children, initialIndex }: MenuDockProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [degree, { prev, next }] = useCircularArray(degreesWithHiddenArea);

  const onActiveIndexChange = useCallback(
    (index: number) => {
      const nextActiveIndex = index;
      setActiveIndex(nextActiveIndex);

      const dir = nextActiveIndex - activeIndex > 0 ? 'prev' : 'next';
      if (dir === 'next') {
        next(Math.abs(nextActiveIndex - activeIndex));
      } else {
        prev(Math.abs(nextActiveIndex - activeIndex));
      }
    },
    [activeIndex, next, prev]
  );

  return (
    <MenuDockProvider
      activeIndex={activeIndex}
      degrees={degree}
      onActiveIndexChange={onActiveIndexChange}
    >
      <List>{children}</List>
    </MenuDockProvider>
  );
}

const List = styled('div', {
  position: 'relative',
  display: 'flex',

  // '&::after': {
  //   content: '""',
  //   position: 'absolute',
  //   display: 'block',
  //   height: '100%',
  //   width: '100%',
  //   backgroundColor: 'white',
  //   backdropFilter: 'blur(12px)',
  // },

  // '&::before': {
  //   content: '""',
  //   position: 'absolute',
  //   display: 'block',
  //   height: '100%',
  //   width: '100%',
  //   backgroundColor: 'white',
  //   backdropFilter: 'blur(12px)',
  // },
});
