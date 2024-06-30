import { createContext } from '../../utility/createContext';

interface RadialMenuItemContext {
  index: number;
  selectedIndex: number;
  active: boolean;
}

export const [RadialMenuItemProvider, useRadialMenuItemContext] =
  createContext<RadialMenuItemContext>('RadialMenuItem', {
    index: -1,
    selectedIndex: -1,
    active: true,
  });
