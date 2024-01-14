import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function MenuDockPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Dock</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>-</PageLayout.Summary>
        <PageLayout.DetailsContent>-</PageLayout.DetailsContent>
      </PageLayout.Details>
      <div style={{ height: 210, overflow: 'hidden' }}>
        <MenuDock initialIndex={4}>
          {GRADIENT_IMAGES.map((src, index) => {
            return (
              <DockItem key={index} index={index}>
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '50%',
                    height: '50%',
                    borderRadius: 9999,
                    userSelect: 'none',
                  }}
                />
              </DockItem>
            );
          })}
        </MenuDock>
      </div>
    </PageLayout>
  );
}
