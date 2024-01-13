import { styled } from '@stitches/react';
import { useState } from 'react';

import { MenuDockProvider } from './context';

export interface MenuDockProps {
  children: React.ReactNode;
  initialIndex: number;
}
export default function MenuDock({ children, initialIndex }: MenuDockProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <MenuDockProvider activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
      <List>{children}</List>
    </MenuDockProvider>
  );
}

const List = styled('div', {
  position: 'relative',

  display: 'flex',
  gap: 12,
});
