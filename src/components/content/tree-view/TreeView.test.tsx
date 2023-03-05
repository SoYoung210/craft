import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import preview from 'jest-preview';

import Tree from './TreeView';

describe('components/Tree', () => {
  describe('markup', () => {
    test('tree role', () => {
      const { queryByRole } = render(
        <Tree>
          <Tree.List aria-label="test tree">
            <Tree.Item>item1</Tree.Item>
            <Tree.Item>item2</Tree.Item>
            <Tree.Item>item3</Tree.Item>
          </Tree.List>
        </Tree>
      );

      const root = queryByRole('tree');

      expect(root).toHaveAccessibleName('test tree');
    });

    test('treeitem role', () => {
      const { queryAllByRole } = render(
        <Tree>
          <Tree.List aria-label="test tree">
            <Tree.Item>item1</Tree.Item>
            <Tree.Item>item2</Tree.Item>
            <Tree.Item>item3</Tree.Item>
          </Tree.List>
        </Tree>
      );

      const items = queryAllByRole('treeitem');

      expect(items).toHaveLength(3);
    });

    it('subtree는 초기에 렌더되지 않는다.', () => {
      const { queryByRole, getByLabelText } = render(
        <Tree aria-label="test tree">
          <Tree.List>
            <Tree.Item id="parent" aria-label="parent">
              Parent
              <Tree.SubList>
                <Tree.Item id="child">Child</Tree.Item>
              </Tree.SubList>
            </Tree.Item>
          </Tree.List>
        </Tree>
      );

      const parentItem = getByLabelText('parent');
      const subtree = queryByRole('group');
      preview.debug();
      expect(parentItem).toHaveAttribute('aria-expanded', 'false');
      expect(subtree).toBeNull();
    });
    it('초기에 subtree가 열려있는 상태로 렌더링 할 수 있다.', () => {
      const { queryByRole, getByLabelText } = render(
        <Tree aria-label="test tree">
          <Tree.List>
            <Tree.Item id="parent" open aria-label="parent">
              Parent
              <Tree.SubList>
                <Tree.Item id="child">Child</Tree.Item>
              </Tree.SubList>
            </Tree.Item>
          </Tree.List>
        </Tree>
      );

      const parentItem = getByLabelText('parent');
      const subtree = queryByRole('group');

      expect(parentItem).toHaveAttribute('aria-expanded', 'true');
      expect(subtree).not.toBeNull();
    });

    it('Item하위에 SubList가 존재할 경우 aria-expanded 속성을 갖는다.', async () => {
      const { getByLabelText, getByText } = render(
        <Tree aria-label="Test tree">
          <Tree.List>
            <Tree.Item id="item-1" aria-label="Item 1">
              Item 1
              <Tree.SubList>
                <Tree.Item id="item-1-a">Item 1.a</Tree.Item>
                <Tree.Item id="item-1-b">Item 1.b</Tree.Item>
                <Tree.Item id="item-1-c">Item 1.c</Tree.Item>
              </Tree.SubList>
            </Tree.Item>
            <Tree.Item id="item-2" aria-label="Item 2">
              Item 2
            </Tree.Item>
          </Tree.List>
        </Tree>
      );

      let treeitem = getByLabelText(/Item 1/);
      expect(treeitem).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(getByText(/Item 1/));
      expect(treeitem).toHaveAttribute('aria-expanded', 'true');

      treeitem = getByLabelText(/Item 2/);
      expect(treeitem).not.toHaveAttribute('aria-expanded');

      await userEvent.click(getByText(/Item 2/));
      expect(treeitem).not.toHaveAttribute('aria-expanded');
    });
  });

  describe('interaction - keyboard', () => {
    test('방향키 탐색', async () => {
      const { queryByRole } = render(
        <Tree>
          <Tree.List>
            <Tree.Item id="item1">item 1</Tree.Item>
            <Tree.Item id="item2">item 2</Tree.Item>
            <Tree.Item id="item3">item 3</Tree.Item>
          </Tree.List>
        </Tree>
      );
      const root = queryByRole('tree');
      const item1 = queryByRole('treeitem', { name: 'item 1' });
      const item2 = queryByRole('treeitem', { name: 'item 2' });
      // focus to root
      fireEvent.focus(root!);

      fireEvent.keyDown(root!, { key: 'ArrowDown' });
      expect(item1).toHaveAttribute('aria-current', 'true');
      expect(item2).not.toHaveAttribute('aria-current');

      fireEvent.keyDown(root!, { key: 'ArrowDown' });
      expect(item2).toHaveAttribute('aria-current', 'true');
      expect(item1).not.toHaveAttribute('aria-current');

      fireEvent.keyDown(root!, { key: 'ArrowUp' });
      expect(item1).toHaveAttribute('aria-current', 'true');
      expect(item2).not.toHaveAttribute('aria-current');
    });

    test('SubList 열기', async () => {
      const { queryByRole } = render(
        <Tree>
          <Tree.List>
            <Tree.Item id="item-1" aria-label="Item 1">
              Item 1
              <Tree.SubList>
                <Tree.Item id="item-1-a">Item 1.a</Tree.Item>
                <Tree.Item id="item-1-b">Item 1.b</Tree.Item>
                <Tree.Item id="item-1-c">Item 1.c</Tree.Item>
              </Tree.SubList>
            </Tree.Item>
            <Tree.Item id="item-2" aria-label="Item 2">
              Item 2
              <Tree.SubList />
            </Tree.Item>
          </Tree.List>
        </Tree>
      );
      const root = queryByRole('tree');
      const treeitem = queryByRole('treeitem', { name: 'Item 1' });
      // focus to root
      fireEvent.focus(root!);

      expect(treeitem).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(root!, { key: 'ArrowDown' });
      // open "Item1"'s sub list
      fireEvent.keyDown(root!, { key: 'ArrowRight' });

      expect(treeitem).toHaveAttribute('aria-expanded', 'true');

      // close "Item1"'s sub list
      fireEvent.keyDown(root!, { key: 'ArrowLeft' });
      expect(treeitem).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // describe('interaction - mouse', () => {});
});
