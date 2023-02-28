import { RefObject, KeyboardEvent, useState } from 'react';

interface Params {
  itemSelector?: string;
  listRef: RefObject<HTMLElement>;
  loop?: boolean;
}
export default function useListNavigation(params: Params) {
  const { itemSelector = '*', listRef, loop } = params;
  const [selectedElement, setSelectedElement] = useState<Element>();

  function getSelectedItem() {
    if (listRef.current == null) {
      return;
    }

    return listRef.current.querySelector(
      `${itemSelector}[aria-selected="true"]`
    );
  }

  function getValidItems() {
    if (listRef.current == null) {
      return;
    }

    return Array.from(
      listRef.current.querySelectorAll(
        `${itemSelector}:not([aria-disabled="true"]):not([disabled="true"]):not([hidden])`
      )
    );
  }

  function updateSelected(orientation: 'end' | 'start') {
    const selected = getSelectedItem();
    const validItems = getValidItems();

    if (validItems == null) {
      return;
    }

    const indexOffset = orientation === 'end' ? 1 : -1;
    const currentIndex = validItems.findIndex(item => item === selected) ?? -1;
    const nextIndex = indexOffset + currentIndex;

    if (loop) {
      nextIndex < 0
        ? validItems.length - 1
        : nextIndex === validItems.length
        ? 0
        : nextIndex;
    }

    const nextSelectedItem = validItems[nextIndex];
    if (nextSelectedItem != null) {
      setSelectedElement(nextSelectedItem);
    }
  }

  // TODO: index받도록 리팩토링
  function selectFirstItem() {
    const item = getValidItems()?.find(item => !item.ariaDisabled);
    // const value = item?.getAttribute(VALUE_ATTR);
    // store.setState('value', value || undefined);
    setSelectedElement(item);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.defaultPrevented) {
      return;
    }

    // TODO: extra key binding
    switch (e.key) {
      case 'ArrowDown': {
        updateSelected('end');
        break;
      }
      case 'ArrowUp': {
        updateSelected('start');
      }
    }
  }

  return [selectedElement, { handleKeyDown, selectFirstItem }] as const;
}
