import { styled } from '../../stitches.config';
import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockContent } from '../components/content/menu-dock/DockContent';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock, {
  MenuDockList,
} from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';

const Image = ({ index }: { index: number }) => {
  return (
    <img
      src={GRADIENT_IMAGES[index]}
      style={{
        height: '100%',
        aspectRatio: '1 / 1',
        borderRadius: 'inherit',
      }}
    />
  );
};
export default function MenuDockPage() {
  return (
    <PageLayout style={{ minWidth: 760 }}>
      <GradientBackground />
      <PageLayout.Title>Dock</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>-</PageLayout.Summary>
        <PageLayout.DetailsContent>-</PageLayout.DetailsContent>
      </PageLayout.Details>
      <PageContentRoot>
        <MenuDock initialIndex={2}>
          <DockContent
            index={2}
            bottomAddon={
              <DockContent.BottomAddonRoot>
                <DockContent.Title>Royal Heath</DockContent.Title>
                <DockContent.Caption>product.ls.graphics</DockContent.Caption>
              </DockContent.BottomAddonRoot>
            }
          >
            <Image index={2} />
          </DockContent>
          <DockContent
            index={1}
            bottomAddon={
              <DockContent.BottomAddonRoot>
                <DockContent.Title>Beauty Bush</DockContent.Title>
                <DockContent.Caption>product.ls.graphics</DockContent.Caption>
              </DockContent.BottomAddonRoot>
            }
          >
            <Image index={1} />
          </DockContent>
          <DockContent
            index={0}
            bottomAddon={
              <DockContent.BottomAddonRoot>
                <DockContent.Title>Beauty Bush</DockContent.Title>
                <DockContent.Caption>product.ls.graphics</DockContent.Caption>
              </DockContent.BottomAddonRoot>
            }
          >
            <Image index={0} />
          </DockContent>
          <DockContent
            index={3}
            bottomAddon={
              <DockContent.BottomAddonRoot>
                <DockContent.Title>Pale Cornflower Blue</DockContent.Title>
                <DockContent.Caption>product.ls.graphics</DockContent.Caption>
              </DockContent.BottomAddonRoot>
            }
          >
            <Image index={3} />
          </DockContent>
          <DockContent
            index={4}
            bottomAddon={
              <DockContent.BottomAddonRoot>
                <DockContent.Title>Flax</DockContent.Title>
                <DockContent.Caption>product.ls.graphics</DockContent.Caption>
              </DockContent.BottomAddonRoot>
            }
          >
            <Image index={4} />
          </DockContent>

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
      </PageContentRoot>
    </PageLayout>
  );
}

const PageContentRoot = styled('div', {
  position: 'relative',
  height: 406,
  overflow: 'hidden',
  paddingTop: 16,
  display: 'flex',
  justifyContent: 'center',

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    backdropFilter: 'blur(0.8px)',
    width: '180px',
    height: '120px',
    pointerEvents: 'none',
    background:
      'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.76))',
    '-webkit-mask-image':
      'linear-gradient(to top,  rgba(255, 255, 255, 0.76) 20%, transparent)',
  },

  '&::before': {
    left: 0,
    bottom: 0,
  },

  '&::after': {
    right: 0,
    bottom: 0,
  },
});

const GradientBackground = styled('div', {
  width: '72%',
  height: '30%',

  pointerEvents: 'none',
  position: 'fixed',
  left: '50%',
  top: '10%',
  transform: 'translateX(-50%)',
  zIndex: -1,
  opacity: 0.22,
  filter: 'blur(80px) saturate(150%)',
  backgroundImage: `radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 33% 50%, rgb(140, 168, 232) 0px, transparent 50%)`,
});
