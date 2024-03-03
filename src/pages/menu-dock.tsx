import { styled } from '../../stitches.config';
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
      <GradientBackground data-debug="gradient-background" />
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
        <GradientBackground />
        {/* 5개 기준한 값으로 변경 */}

        <MenuDock initialIndex={2}>
          <DockContent index={2}>
            <img
              src={GRADIENT_IMAGES[2]}
              style={{
                height: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 'inherit',
              }}
            />
          </DockContent>
          <DockContent index={1}>
            <img
              src={GRADIENT_IMAGES[1]}
              style={{
                height: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 'inherit',
              }}
            />
          </DockContent>
          <DockContent index={0}>
            <img
              src={GRADIENT_IMAGES[0]}
              style={{
                height: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 'inherit',
              }}
            />
          </DockContent>
          <DockContent index={3}>
            <img
              src={GRADIENT_IMAGES[3]}
              style={{
                height: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 'inherit',
              }}
            />
          </DockContent>
          <DockContent index={4}>
            <img
              src={GRADIENT_IMAGES[4]}
              style={{
                height: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 'inherit',
              }}
            />
          </DockContent>

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

const GradientBackground = styled('div', {
  width: '72%',
  height: '30%',

  pointerEvents: 'none',
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: -1,
  opacity: 0.18,
  backgroundSize: '180%, 200%',
  filter: 'blur(100px) saturate(150%)',
  backgroundImage: `radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 33% 50%, rgb(140, 168, 232) 0px, transparent 50%)`,
});
