import { styled } from '@stitches/react';
import { useState } from 'react';

import { Direction, MenuDockProvider } from './context';
export interface MenuDockProps {
  children: React.ReactNode;
  initialIndex: number;
}

export default function MenuDock({ children, initialIndex }: MenuDockProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<Direction>('clockwise');

  return (
    <MenuDockProvider
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      direction={direction}
      onDirectionChange={setDirection}
    >
      {children}
    </MenuDockProvider>
  );
}

export const MenuDockList = styled('div', {
  position: 'absolute',
  display: 'flex',
  // TODO: DockContent 높이 + 여백값으로 변경
  top: 340,
  left: 0,
});
