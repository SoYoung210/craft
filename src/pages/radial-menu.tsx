import {
  RadialMenu,
  RadialMenuItem,
} from '../components/content/radial-menu/RadialMenu';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function RadialMenuPage() {
  return (
    <PageLayout style={{ minWidth: 760 }}>
      <PageLayout.Title>RadialMenu</PageLayout.Title>
      <RadialMenu>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
        <RadialMenuItem>
          <div />
        </RadialMenuItem>
      </RadialMenu>
    </PageLayout>
  );
}
