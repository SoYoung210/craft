import { styled } from '@stitches/react';
import { useState } from 'react';

import useCircularArray from '../../../hooks/useCircularArray';

import { GRADIENT_IMAGES } from './constant';
import { MenuDockProvider } from './context';
import { DockItem } from './DockItem';

export interface MenuDockProps {
  children: React.ReactNode;
  initialIndex: number;
}

const degrees = [210, 243, 270, 297, 330];
// 배열이 5개인 경우 2개까지 여유좌표가 존재해야 함
// const degreesWithHiddenArea = [150, 170, ...degrees, 10, 30];
// 원래 위치 보존되는거: [297, 330, ...degrees, 210, 243];
// 양 끝 두개의 값은 사라지는 좌표...
const degreesWithHiddenArea = [120, 160, ...degrees, 20, 60];
const middleIndex = Math.floor(degreesWithHiddenArea.length / 2);
export default function MenuDock({ children, initialIndex }: MenuDockProps) {
  const [activeIndex, setActiveIndex] = useState(4);
  const [degree, { prev, next }] = useCircularArray(degreesWithHiddenArea);

  return (
    <MenuDockProvider activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
      <List>
        {GRADIENT_IMAGES.map((src, index) => {
          return (
            <DockItem
              key={index}
              index={index}
              degree={degree[index]}
              onClick={() => {
                const nextActiveIndex = index;
                setActiveIndex(nextActiveIndex);

                const dir = nextActiveIndex - activeIndex > 0 ? 'prev' : 'next';
                if (dir === 'next') {
                  next(Math.abs(nextActiveIndex - activeIndex));
                } else {
                  prev(Math.abs(nextActiveIndex - activeIndex));
                }
              }}
            >
              <div>{index}</div>
              <img
                src={src}
                alt=""
                style={{ width: '50%', height: '50%', borderRadius: 9999 }}
              />
            </DockItem>
          );
        })}
      </List>
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
