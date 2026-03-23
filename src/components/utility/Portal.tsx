import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react';
import * as RadixPortal from '@radix-ui/react-portal';
import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { createContext } from './createContext';

interface ContextValue {
  containerElement: HTMLDivElement | undefined;
  onContainerElementChange: (element: HTMLDivElement) => void;
}

const [PortalProvider, usePortalContext] =
  createContext<ContextValue>('Portal');

interface PortalProps
  extends ComponentPropsWithoutRef<typeof RadixPortal.Root> {
  children: ReactNode;
}

function Portal({ children }: { children: ReactNode }) {
  const [containerElement, setContainerElement] = useState<
    HTMLDivElement | undefined
  >(undefined);

  return (
    <PortalProvider
      containerElement={containerElement}
      onContainerElementChange={setContainerElement}
    >
      {children}
    </PortalProvider>
  );
}

function Root(props: PortalProps) {
  const { children, ...rootProps } = props;
  const { containerElement } = usePortalContext('Portal.Container');

  return (
    <RadixPortal.Root {...rootProps} container={containerElement}>
      {children}
    </RadixPortal.Root>
  );
}

export type PortalContainerElement = ElementRef<typeof Primitive.div>;
export type PortalContainerProps = ComponentPropsWithoutRef<
  typeof Primitive.div
>;

const PortalContainer = forwardRef<
  PortalContainerElement,
  PortalContainerProps
>((props, ref) => {
  const { onContainerElementChange } = usePortalContext('Portal.Container');
  const composedRef = useComposedRefs(ref, onContainerElementChange);

  return (
    <Primitive.div
      {...props}
      ref={composedRef}
      style={{ position: 'relative', ...props.style }}
    />
  );
});

Portal.Root = Root;
Portal.Container = PortalContainer;

export default Portal;
