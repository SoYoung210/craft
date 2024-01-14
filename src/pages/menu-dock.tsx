import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function MenuDockPage() {
  // style={{ height: 210, overflow: 'hidden' }}
  return (
    <PageLayout>
      <PageLayout.Title>Dock</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>-</PageLayout.Summary>
        <PageLayout.DetailsContent>-</PageLayout.DetailsContent>
      </PageLayout.Details>
      <div style={{ height: 210, overflow: 'hidden' }}>
        <MenuDock initialIndex={4} />
      </div>
    </PageLayout>
  );
}
