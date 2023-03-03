import { RefObject, KeyboardEvent, useState } from 'react';

interface Params {
  itemSelector?: string;
  listRef: RefObject<HTMLElement>;
  loop?: boolean;
}

export default function useListNavigation(params: Params) {
  const { itemSelector = '*', listRef, loop } = params;
  const [selectedElement, setSelectedElement] = useState<Element>();

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
    const validItems = getValidItems();

    if (validItems == null) {
      return;
    }

    const indexOffset = orientation === 'end' ? 1 : -1;
    const currentIndex =
      validItems.findIndex(item => item === selectedElement) ?? -1;
    let nextIndex = indexOffset + currentIndex;

    if (loop) {
      if (nextIndex < 0) {
        nextIndex = validItems.length - 1;
      }

      nextIndex = nextIndex === validItems.length ? 0 : nextIndex;
    }

    const nextSelectedItem = validItems[nextIndex];
    if (nextSelectedItem != null) {
      setSelectedElement(nextSelectedItem);
      return nextSelectedItem;
    }
  }

  function selectItem(fn: (el: Element) => boolean) {
    const nextSelectedItem = getValidItems()?.find(fn);
    if (nextSelectedItem != null) {
      setSelectedElement(nextSelectedItem);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.defaultPrevented) {
      return;
    }

    // TODO: extra key binding
    switch (e.key) {
      case 'ArrowDown': {
        return updateSelected('end');
      }
      case 'ArrowUp': {
        return updateSelected('start');
      }
    }
  }

  return [selectedElement, { handleKeyDown, selectItem }] as const;
}
