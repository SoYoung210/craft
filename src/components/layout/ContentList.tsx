import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
  useState,
} from 'react';

import { cn } from '@/utils/cn';
import { createContext } from '../utility/createContext';
import useId from '../../hooks/useId';

type ContentItemElement = HTMLLIElement;

interface ContentListContextValue {
  activeItem: ContentItemElement | null;
  onActiveItemChange: (node: ContentItemElement | null) => void;
}

const [ContentListProvider, useContentListContext] =
  createContext<ContentListContextValue>('ContentList');

type ContentListElement = HTMLUListElement;
type ContentListProps = ComponentPropsWithoutRef<'ul'>;
const ContentListImpl = forwardRef<ContentListElement, ContentListProps>(
  ({ className, ...props }, ref) => {
    const [activeItem, setActiveItem] = useState<ContentItemElement | null>(
      null
    );

    return (
      <ContentListProvider
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
      >
        <ul
          ref={ref}
          className={cn(
            'flex flex-col gap-5 list-none ps-0',
            className
          )}
          {...props}
        />
      </ContentListProvider>
    );
  }
);

interface ContentItemProps extends ComponentPropsWithoutRef<'li'> {
  active?: boolean;
}
const ContentItemImpl = forwardRef<ContentItemElement, ContentItemProps>(
  ({ active, className, style, ...props }, forwardedRef) => {
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

    const isActivate = itemActivated || (active && activeItem == null);

    const blurValue = haveToBlur ? '2px' : '0';
    const grayScaleValue = isActivate ? '0' : '1';

    return (
      <li
        ref={composedRefs}
        className={cn(
          'transition-[filter] duration-500 ease-linear translate-z-0',
          className
        )}
        style={{
          ...style,
          filter: `grayscale(${grayScaleValue}) blur(${blurValue})`,
        }}
        {...props}
        id={id}
        onMouseEnter={composeEventHandlers(props.onMouseEnter, () =>
          onActiveItemChange(itemElement)
        )}
        onMouseLeave={composeEventHandlers(props.onMouseLeave, () =>
          onActiveItemChange(null)
        )}
      />
    );
  }
);

const ContentList = Object.assign({}, ContentListImpl, {
  Item: ContentItemImpl,
});

export default ContentList;
