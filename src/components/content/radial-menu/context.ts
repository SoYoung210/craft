import { createContext } from '../../utility/createContext';

interface RadialMenuItemContext {
  index: number;
  selectedIndex: number;
}

export const [RadialMenuItemProvider, useRadialMenuItemContext] =
  createContext<RadialMenuItemContext>('RadialMenuItem', {
    index: -1,
    selectedIndex: -1,
  });
