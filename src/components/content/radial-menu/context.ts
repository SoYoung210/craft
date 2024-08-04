import { createCollection } from '@radix-ui/react-collection';

import { createContext } from '../../utility/createContext';

interface RadialMenuItemContext {
  index: number;
}

export const INITIAL_SELECTED_INDEX = -1;
export const [RadialMenuItemProvider, useRadialMenuItemContext] =
  createContext<RadialMenuItemContext>('RadialMenuItem', {
    index: -1,
  });

interface RadialMenuContext {
  labelTrackElement: HTMLDivElement | null;
  selectedIndex: number;
  selectedLabel: string | null;
  active: boolean;
}

export const [RadialMenuProvider, useRadialMenuContext] =
  createContext<RadialMenuContext>('RadialMenu', {
    labelTrackElement: null,
    selectedIndex: INITIAL_SELECTED_INDEX,
    selectedLabel: null,
    active: true,
  });

interface CollectionItemData {
  label: string | null;
}

export const [Collection, useCollection] = createCollection<
  HTMLDivElement,
  CollectionItemData
>('Collection');
