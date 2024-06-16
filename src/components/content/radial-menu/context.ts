import { MotionValue } from 'framer-motion';

import { createContext } from '../../utility/createContext';

interface RadialMenuItemContext {
  index: number;
}

export const [RadialMenuItemProvider, useRadialMenuItemContext] =
  createContext<RadialMenuItemContext>('RadialMenuItem', {
    index: -1,
  });

interface RadialMenuContext {
  selectionAngleMotionValue: MotionValue<number>;
  restSelectionBgAngle: MotionValue<string>;
}

export const [RadialMenuProvider, useRadialMenuContext] =
  createContext<RadialMenuContext>('RadialMenu');
