import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useMemo,
  useState,
} from 'react';

import { styled } from '../../../stitches.config';
import { createContext } from '../utility/createContext';
import useId from '../../hooks/useId';

type ContentItemElement = ElementRef<typeof StyledItem>;

interface ContentListContextValue {
  activeItem: ContentItemElement | null;
  onActiveItemChange: (node: ContentItemElement | null) => void;
}

const [ContentListProvider, useContentListContext] =
  createContext<ContentListContextValue>('ContentList');

type ContentListElement = ElementRef<typeof StyledList>;
type ContentListProps = ComponentPropsWithoutRef<typeof StyledList>;
const ContentListImpl = forwardRef<ContentListElement, ContentListProps>(
  (props, ref) => {
    const [activeItem, setActiveItem] = useState<ContentItemElement | null>(
      null
    );

    return (
      <ContentListProvider
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
      >
        <StyledList ref={ref} {...props} />
      </ContentListProvider>
    );
  }
);

type ContentItemProps = ComponentPropsWithoutRef<typeof StyledItem>;
const ContentItemImpl = forwardRef<ContentItemElement, ContentItemProps>(
  (props, forwardedRef) => {
    const id = useId(props.id);

    const [itemElement, setItemElement] = useState<ContentItemElement | null>(
      null
    );
    const composedRefs = useComposedRefs(forwardedRef, el =>
      setItemElement(el)
    );

    const { activeItem, onActiveItemChange } =
      useContentListContext('ContentList.Item');

    const itemActivated = useMemo(() => {
      return activeItem?.id === id;
    }, [activeItem?.id, id]);

    const haveToBlur = useMemo(() => {
      return !itemActivated && activeItem != null;
    }, [activeItem, itemActivated]);

    return (
      <StyledItem
        ref={composedRefs}
        {...props}
        id={id}
        onMouseEnter={composeEventHandlers(props.onMouseEnter, () =>
          onActiveItemChange(itemElement)
        )}
        onMouseLeave={(props.onMouseLeave, () => onActiveItemChange(null))}
        blurred={haveToBlur}
      />
    );
  }
);

const StyledList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  listStyle: 'none',
  paddingInlineStart: 0,
});

const StyledItem = styled('li', {
  transition: 'filter 0.5s ease',

  $$blur: 0,
  $$grayScale: 1,
  filter: 'grayscale($$grayScale) blur($$blur)',
  transform: 'translateZ(0px)',

  '&:hover': {
    $$grayScale: 0,
  },

  variants: {
    blurred: {
      true: {
        $$blur: '2px',
      },
    },
  },
});

const ContentList = Object.assign({}, ContentListImpl, {
  Item: ContentItemImpl,
});

export default ContentList;
