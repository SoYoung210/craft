/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';

import useListNavigation from './useListNavigation';

const ITEMS = ['one', 'two', 'three'];
function BasicExample(props: { loop?: boolean; itemSelector?: string }) {
  const listRef = useRef<HTMLUListElement>(null);

  const [selectedElement, { handleKeyDown }] = useListNavigation({
    listRef,
    ...props,
  });

  return (
    <ul
      ref={listRef}
      tabIndex={0}
      aria-activedescendant={selectedElement?.id}
      onKeyDown={handleKeyDown}
    >
      <li id={ITEMS[0]}>{ITEMS[0]}</li>
      <li id={ITEMS[1]}>{ITEMS[1]}</li>
      <li id={ITEMS[2]}>{ITEMS[2]}</li>
    </ul>
  );
}

function InputExample(props: { loop?: boolean; itemSelector?: string }) {
  const listRef = useRef<HTMLUListElement>(null);

  const [selectedElement, { handleKeyDown }] = useListNavigation({
    listRef,
    ...props,
  });

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <input />
      <ul ref={listRef} aria-activedescendant={selectedElement?.id}>
        <li id={ITEMS[0]}>{ITEMS[0]}</li>
        <li id={ITEMS[1]}>{ITEMS[1]}</li>
        <li id={ITEMS[2]}>{ITEMS[2]}</li>
      </ul>
    </div>
  );
}

function InvalidItemExample() {
  const listRef = useRef<HTMLUListElement>(null);

  const [selectedElement, { handleKeyDown }] = useListNavigation({
    listRef,
  });

  return (
    <ul
      ref={listRef}
      tabIndex={0}
      aria-activedescendant={selectedElement?.id}
      onKeyDown={handleKeyDown}
    >
      <li id={ITEMS[0]} aria-disabled={true}>
        {ITEMS[0]}
      </li>
      <li id={ITEMS[1]} hidden>
        {ITEMS[1]}
      </li>
      <li id={ITEMS[2]}>{ITEMS[2]}</li>
    </ul>
  );
}

const ACTIVE_DESCENDANT_SELECTOR = 'aria-activedescendant';
describe('hooks/useListNavigation — list only', () => {
  test('ArrowDown 키입력이 있을 때 탐색 가능한 첫 번째 다음요소 반환', async () => {
    const { container } = render(<BasicExample />);
    const listElement = container.querySelector('ul');

    fireEvent.focus(listElement!);
    fireEvent.keyDown(listElement!, { key: 'ArrowDown' });

    expect(listElement).toHaveAttribute(ACTIVE_DESCENDANT_SELECTOR, ITEMS[0]);
  });

  test('ArrowUp 키입력이 있을 때 탐색 가능한 첫 번째 이전요소 반환', () => {
    const { container } = render(<BasicExample />);
    const listElement = container.querySelector('ul');

    fireEvent.focus(listElement!);
    // ⬇️ ⬇️ ⬆️ === first item
    fireEvent.keyDown(listElement!, { key: 'ArrowDown' });
    fireEvent.keyDown(listElement!, { key: 'ArrowDown' });
    fireEvent.keyDown(listElement!, { key: 'ArrowUp' });

    expect(listElement).toHaveAttribute(ACTIVE_DESCENDANT_SELECTOR, ITEMS[0]);
  });

  test('키보드 탐색 시 유효하지 않은 아이템은 건너뛴다.', () => {
    const { container } = render(<InvalidItemExample />);
    const listElement = container.querySelector('ul');

    fireEvent.focus(listElement!);
    // ⬇️
    fireEvent.keyDown(listElement!, { key: 'ArrowDown' });

    expect(listElement).toHaveAttribute(ACTIVE_DESCENDANT_SELECTOR, ITEMS[2]);
  });

  test('전체 순회 옵션이 참일 경우 첫번째 아이템에서 이전 아이템 탐색 시 마지막 아이템 반환', () => {
    const { container } = render(<BasicExample loop={true} />);
    const listElement = container.querySelector('ul');

    fireEvent.focus(listElement!);
    // 0. noting
    // 1. ⬇️ : first item selected
    fireEvent.keyDown(listElement!, { key: 'ArrowDown' });
    // 2. ⬆️ : last item selected
    fireEvent.keyDown(listElement!, { key: 'ArrowUp' });

    expect(listElement).toHaveAttribute(
      ACTIVE_DESCENDANT_SELECTOR,
      ITEMS[ITEMS.length - 1]
    );
  });
});

describe('hooks/useListNavigation — has other interactive element', () => {
  test('<input />에 포커스된 상태에서도 키보드 탐색이 가능하다.', () => {
    const { container } = render(<InputExample />);
    const inputElement = container.querySelector('input');
    const listElement = container.querySelector('ul');

    fireEvent.focus(inputElement!);
    // 1. ⬇️ : first item selected
    fireEvent.keyDown(inputElement!, { key: 'ArrowDown' });

    expect(listElement).toHaveAttribute(ACTIVE_DESCENDANT_SELECTOR, ITEMS[0]);
  });
});
