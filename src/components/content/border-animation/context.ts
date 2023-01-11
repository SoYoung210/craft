import { createContext } from '../../utility/createContext';

interface BorderAnimationContextValue {
  maskElement: HTMLDivElement | null;
}
export const [BorderAnimationProvider, useBorderAnimationContext] =
  createContext<BorderAnimationContextValue>('BorderAnimation');
