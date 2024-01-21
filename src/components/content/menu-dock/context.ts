import { createContext } from '../../utility/createContext';

export type Direction = 'clockwise' | 'counterclockwise';
interface ContextValue {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  direction: Direction;
  onDirectionChange: (direction: Direction) => void;
}

export const [MenuDockProvider, useMenuDockContext] =
  createContext<ContextValue>('MenuDock');
