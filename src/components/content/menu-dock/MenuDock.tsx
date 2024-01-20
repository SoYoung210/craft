import { styled } from '@stitches/react';
import { useCallback, useState } from 'react';

import useCircularArray from '../../../hooks/useCircularArray';

import { MenuDockProvider } from './context';
export interface MenuDockProps {
  children: React.ReactNode;
  initialIndex: number;
}

export default function MenuDock({ children, initialIndex }: MenuDockProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <MenuDockProvider
      activeIndex={activeIndex}
      // degrees={degree}
      onActiveIndexChange={setActiveIndex}
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
