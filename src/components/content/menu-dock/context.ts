import { createContext } from '../../utility/createContext';

interface ContextValue {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  degrees: number[];
}

export const [MenuDockProvider, useMenuDockContext] =
  createContext<ContextValue>('MenuDock');
