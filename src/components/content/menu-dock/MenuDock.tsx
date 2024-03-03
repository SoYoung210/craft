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
