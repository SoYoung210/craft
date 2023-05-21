import { createContext } from '../../utility/createContext';

interface ContextValue {
  interval: number;
  completeIndexList: number[];
  addCompleteIndex: (index: number) => void;
}
export const [RandomTextProvider, useRandomTextContext] =
  createContext<ContextValue>('RadomText');
