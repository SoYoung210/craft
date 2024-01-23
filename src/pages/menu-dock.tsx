import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockContent } from '../components/content/menu-dock/DockContent';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock, {
  MenuDockList,
} from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function MenuDockPage() {
  return (
    <PageLayout style={{ minWidth: 760 }}>
      <PageLayout.Title>Dock</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>-</PageLayout.Summary>
        <PageLayout.DetailsContent>-</PageLayout.DetailsContent>
      </PageLayout.Details>
      <div
        style={{
          position: 'relative',
          // height: 480,
          height: 406,
          overflow: 'hidden',
          paddingTop: 16,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* 5개 기준한 값으로 변경 */}

        <MenuDock initialIndex={2}>
          <DockContent index={0}>0</DockContent>
          <DockContent index={1}>1</DockContent>
          <DockContent index={2}>2</DockContent>
          <DockContent index={3}>3</DockContent>
          <DockContent index={4}>4</DockContent>
          {/**
           * TODO:
           * 2. top: 320을 DockContent height + 여백으로 변경해야함.
           * 3. DockContent영역 분리해서 렌더링.. (위에 있다고는 가정하고, 너비는 조절가능하면 좋을듯)
           */}
          <MenuDockList>
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
          </MenuDockList>
        </MenuDock>
      </div>
    </PageLayout>
  );
}
