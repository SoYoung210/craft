import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import {
  Children,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';

import useListNavigation from '../../../hooks/useListNavigation';
import { styled } from '../../../../stitches.config';
import { createContext } from '../../utility/createContext';
// import { FocusScope } from 'react-aria';

interface TreeViewContextValue {
  selectedElement: Element | undefined;
}
const [TreeViewProvider, useTreeViewContext] =
  createContext<TreeViewContextValue>('TreeView');

type RootProps = HTMLAttributes<HTMLUListElement>;
const Root = forwardRef<HTMLUListElement, RootProps>((props, ref) => {
  const listRef = useRef<HTMLUListElement>(null);
  const composedRefs = useComposedRefs(ref, listRef);
  const [selectedElement, { handleKeyDown }] = useListNavigation({
    listRef,
    itemSelector: '[craft-tree-item=""]',
  });

  return (
    <TreeViewProvider selectedElement={selectedElement}>
      <ul
        ref={composedRefs}
        {...props}
        role="tree"
        // eslint-disable-next-line react/no-unknown-property
        craft-tree-root=""
        tabIndex={0}
        onKeyDown={composeEventHandlers(
          props.onKeyDown,
          event => {
            handleKeyDown(event);
          },
          {
            checkForDefaultPrevented: true,
          }
        )}
      >
        <input />
        {props.children}
      </ul>
    </TreeViewProvider>
  );
});

interface ItemContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const [ItemProvider, useItemContext] =
  createContext<ItemContextValue>('Tree.Item');
interface ItemProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// TODO: level?
const Item = forwardRef<HTMLLIElement, ItemProps>((props, ref) => {
  const {
    value,
    open: openFromProps,
    defaultOpen,
    onOpenChange,
    ...restProps
  } = props;

  const { selectedElement } = useTreeViewContext('Tree.Item');
  const [open = false, setOpen] = useControllableState({
    prop: openFromProps,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const listItemRef = useRef<HTMLLIElement>(null);
  const composedRefs = useComposedRefs(ref, listItemRef);
  const selected = listItemRef.current === selectedElement;
  const hasSubTree = getSubTree(props.children) != null;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      // https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
      switch (event.key) {
        case 'ArrowRight':
          // event.preventDefault();
          // event.stopPropagation();
          setOpen(true);
          break;
        case 'ArrowLeft':
          // event.preventDefault();
          // event.stopPropagation();
          setOpen(false);
          break;
      }
    },
    [setOpen]
  );

  return (
    <ItemProvider open={open} onOpenChange={setOpen}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Li
        ref={composedRefs}
        {...restProps}
        tabIndex={0}
        role="treeitem"
        craft-tree-item=""
        onKeyDown={handleKeyDown}
        aria-selected={selected || undefined}
        aria-expanded={!hasSubTree ? undefined : open}
      >
        {props.children}
      </Li>
    </ItemProvider>
  );
});

interface OpenControlProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  children: (params: { open: boolean }) => ReactNode;
}
const OpenControl = forwardRef<HTMLButtonElement, OpenControlProps>(
  (props, ref) => {
    const { onOpenChange, open } = useItemContext('Tree.OpenControl');
    const { children, ...restProps } = props;

    return (
      <Primitive.button
        asChild
        ref={ref}
        {...restProps}
        onClick={composeEventHandlers(props.onClick, () => {
          onOpenChange(!open);
        })}
      >
        {children({ open })}
      </Primitive.button>
    );
  }
);

const SubTree = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(
  (props, ref) => {
    const { open } = useItemContext('Tree.SubTree');
    return open ? <ol ref={ref} {...props} /> : null;
  }
);

function getSubTree(children: ReactNode) {
  return Children.toArray(children).find(
    child => isValidElement(child) && child.type === SubTree
  );
}

const Li = styled('li', {
  '&[aria-selected="true"]': {
    color: 'red',
  },
});
const Tree = Object.assign(Root, {
  Item,
  SubTree,
  OpenControl,
});

export default Tree;
