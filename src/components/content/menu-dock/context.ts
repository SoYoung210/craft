import { createContext } from '../../utility/createContext';

interface ContextValue {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export const [MenuDockProvider, useMenuDockContext] =
  createContext<ContextValue>('MenuDock');
