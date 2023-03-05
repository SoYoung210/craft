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
          <Tree.Item>
            value1
            <Tree.OpenControl>
              {({ open }) => <button>{open ? '⬇️' : '➡️'}</button>}
            </Tree.OpenControl>
            <Tree.SubList>
              <Tree.Item>
                item 1 - 1
                <Tree.OpenControl>
                  {({ open }) => <button>{open ? '⬇️' : '➡️'}</button>}
                </Tree.OpenControl>
                <Tree.SubList id="subsub">
                  <Tree.Item>item 1 - 1 - 1</Tree.Item>
                  <Tree.Item>item 1 - 1 - 2</Tree.Item>
                </Tree.SubList>
              </Tree.Item>
              <Tree.Item>item 1 - 2</Tree.Item>
            </Tree.SubList>
          </Tree.Item>
          <Tree.Item>value2</Tree.Item>
          <Tree.Item>value3</Tree.Item>
          <Tree.Item>value4</Tree.Item>
        </Tree.List>
      </Tree>
    </PageLayout>
  );
}
