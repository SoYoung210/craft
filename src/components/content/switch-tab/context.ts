import { createContext } from '../../utility/createContext';

interface ContextValue {
  value: string | undefined;
  onValueChange: (v: string) => void;
}

export const [SwitchTabProvider, useSwitchTabContext] =
  createContext<ContextValue>('SwitchTab');
