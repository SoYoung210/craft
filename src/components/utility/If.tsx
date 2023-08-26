import { ReactNode } from 'react';

interface Props {
  condition: boolean;
  children: ReactNode;
}
export function If(prop: Props) {
  return prop.condition ? <>{prop.children}</> : null;
}
