import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import {
  Children,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';

import useListNavigation from '../../../hooks/useListNavigation';
import { styled } from '../../../../stitches.config';
import { createContext } from '../../utility/createContext';
import useId from '../../../hooks/useId';
// import { FocusScope } from 'react-aria';

interface TreeViewContextValue {
  activeItem: Element | undefined;
  expandedState: Map<string, boolean>;
  onExpandedStateChange: (id: string, value: boolean) => void;
}
const [TreeViewProvider, useTreeViewContext] =
  createContext<TreeViewContextValue>('TreeView');

type RootProps = HTMLAttributes<HTMLUListElement>;
const Root = forwardRef<HTMLUListElement, RootProps>((props, ref) => {
  const [expandedState, setExpandedState] = useState<Map<string, boolean>>(
    new Map()
  );

  const listRef = useRef<HTMLUListElement>(null);
  const composedRefs = useComposedRefs(ref, listRef);

  const [activeItem, { handleKeyDown: handleListNavigation }] =
    useListNavigation({
      listRef,
      itemSelector: '[craft-tree-item=""]',
    });

  const onExpandedStateChange = useCallback((id: string, value: boolean) => {
    setExpandedState(prev => new Map([...prev, [id, value]]));
  }, []);

  const handleKeyDown: KeyboardEventHandler = useCallback(
    event => {
      const nextElement = handleListNavigation(event) ?? activeItem;

      console.log('nextElement', nextElement);
      if (nextElement == null) {
        return;
      }
      const nextElementId = nextElement.id;
      const itemHasSubTree = nextElement.getAttribute('aria-expanded') != null;

      if (itemHasSubTree) {
        switch (event.key) {
          case 'ArrowRight': {
            onExpandedStateChange(nextElementId, true);
            break;
          }
          case 'ArrowLeft': {
            onExpandedStateChange(nextElementId, false);
            break;
          }
        }
      }
    },
    [handleListNavigation, onExpandedStateChange, activeItem]
  );

  return (
    <TreeViewProvider
      activeItem={activeItem}
      expandedState={expandedState}
      onExpandedStateChange={onExpandedStateChange}
    >
      <ul
        ref={composedRefs}
        {...props}
        role="tree"
        // eslint-disable-next-line react/no-unknown-property
        craft-tree-root=""
        // TODO: SearchInput이 사용될 경우 옮겨야 함
        aria-activedescendant={activeItem?.id}
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
// TODO: 전체를 클릭했을 때 expand
const Item = forwardRef<HTMLLIElement, ItemProps>((props, ref) => {
  const {
    value,
    open: openFromProps,
    defaultOpen,
    onOpenChange: onOpenChangeFromProps,
    id: idFromProps,
    ...restProps
  } = props;

  const id = useId(idFromProps);
  const { activeItem, expandedState, onExpandedStateChange } =
    useTreeViewContext('Tree.Item');

  const onOpenChange = useCallback(
    (open: boolean) => {
      onOpenChangeFromProps?.(open);
      onExpandedStateChange(id, open);
    },
    [id, onExpandedStateChange, onOpenChangeFromProps]
  );
  const [open = false, setOpen] = useControllableState({
    prop: openFromProps ?? expandedState.get(id),
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const listItemRef = useRef<HTMLLIElement>(null);
  const composedRefs = useComposedRefs(ref, listItemRef);
  const selected = listItemRef.current === activeItem;
  const hasSubTree = getSubTree(props.children) != null;

  return (
    <ItemProvider open={open} onOpenChange={setOpen}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Li
        ref={composedRefs}
        {...restProps}
        id={id}
        tabIndex={0}
        role="treeitem"
        craft-tree-item=""
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
  return Children.toArray(children).find(child => {
    return isValidElement(child) && child.type === SubTree;
  });
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
