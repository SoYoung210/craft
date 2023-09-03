import { createContext } from '../../utility/createContext';

interface ContextValue {
  value: string | undefined;
  onValueChange: (v: string) => void;
  open: boolean;
}

export const [SwitchTabProvider, useSwitchTabContext] =
  createContext<ContextValue>('SwitchTab');
