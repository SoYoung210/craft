import Tree from '../components/content/tree-view/TreeView';
import PageLayout from '../components/layout/PageLayout';

export default function TreeView() {
  return (
    <PageLayout>
      <PageLayout.Title>Tree View</PageLayout.Title>
      <PageLayout.Details>muscle</PageLayout.Details>
      <Tree>
        <input />
        <Tree.List>
          <Tree.Item value="value1">
            value1
            <Tree.OpenControl>
              {({ open }) => <button>{open ? '⬇️' : '➡️'}</button>}
            </Tree.OpenControl>
            <Tree.SubList>
              <Tree.Item value="item1-1">item 1 - 1</Tree.Item>
              <Tree.Item value="item1-2">item 1 - 2</Tree.Item>
            </Tree.SubList>
          </Tree.Item>
          <Tree.Item value="value2">value2</Tree.Item>
          <Tree.Item value="value3">value3</Tree.Item>
          <Tree.Item value="value4">value4</Tree.Item>
        </Tree.List>
      </Tree>
    </PageLayout>
  );
}
