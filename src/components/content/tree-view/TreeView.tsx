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

type RootProps = HTMLAttributes<HTMLDivElement>;
const Root = forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const [expandedState, setExpandedState] = useState<Map<string, boolean>>(
    new Map()
  );

  const listRef = useRef<HTMLDivElement>(null);
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
      <div
        ref={composedRefs}
        {...props}
        // eslint-disable-next-line react/no-unknown-property
        craft-tree-root=""
        // TODO: SearchInput이 사용될 경우 옮겨야 함
        aria-activedescendant={activeItem?.id}
        tabIndex={0}
        onKeyDown={composeEventHandlers(props.onKeyDown, event => {
          handleKeyDown(event);
        })}
      >
        {props.children}
      </div>
    </TreeViewProvider>
  );
});

const List = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(
  (props, ref) => {
    return <ol role="tree" ref={ref} {...props} />;
  }
);

interface ItemContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
}
const [ItemProvider, useItemContext] = createContext<ItemContextValue>(
  'Tree.Item',
  {
    open: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    level: 0,
  }
);
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

  const { level } = useItemContext('Tree.Item');

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
  const active = listItemRef.current === activeItem;
  const hasSubTree = getSubList(props.children) != null;

  return (
    <ItemProvider level={level + 1} open={open} onOpenChange={setOpen}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Li
        ref={composedRefs}
        {...restProps}
        style={{
          ...restProps.style,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore CSS custom property
          '--craft-tree-item-level': level,
        }}
        id={id}
        tabIndex={0}
        role="treeitem"
        aria-level={level}
        craft-tree-item=""
        data-craft-treeitem-state={active ? true : undefined}
        aria-expanded={!hasSubTree ? undefined : open}
        onClick={composeEventHandlers(restProps.onClick, e => {
          e.stopPropagation();
          hasSubTree && setOpen(!open);
        })}
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
        onClick={composeEventHandlers(props.onClick, e => {
          e.stopPropagation();
          onOpenChange(!open);
        })}
      >
        {children({ open })}
      </Primitive.button>
    );
  }
);

const SubList = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(
  (props, ref) => {
    const { open } = useItemContext('Tree.SubList');
    return open ? <ol ref={ref} {...props} /> : null;
  }
);

function getSubList(children: ReactNode) {
  return Children.toArray(children).find(child => {
    return isValidElement(child) && child.type === SubList;
  });
}

const Li = styled('li', {
  '&[data-craft-treeitem-state="true"]': {
    color: 'red',
  },
});

const Tree = Object.assign(Root, {
  List,
  Item,
  SubList,
  OpenControl,
});

export default Tree;
