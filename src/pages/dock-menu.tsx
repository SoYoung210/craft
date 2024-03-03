import { PageProps, graphql } from 'gatsby';

import { styled } from '../../stitches.config';
import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockContent } from '../components/content/menu-dock/DockContent';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';

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
      <PageLayout.Title>Dock Menu</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>oval path, exit framer-motion</PageLayout.Summary>
        <PageLayout.DetailsContent>
          <PageLayout.SubTitle>Oval Path</PageLayout.SubTitle>
          <ol>
            <li>
              First: Calculate the x, y coordinates based on the elliptic
              equation to find the position variable{' '}
              <a href="https://github.com/SoYoung210/craft/pull/30/commits/858397e95f4a6dd9bb729c96750075bbc3f127cb">
                commit
              </a>
              <br />
              hard to handle circular items
            </li>
            <li>
              Second: create an elliptical svg and use offsetDistance. Determine
              position based on svg path without calculating x,y coordinates
              directly{' '}
              <a href="https://github.com/SoYoung210/craft/pull/30/commits/f77318c9e9c32d36883a7af6863aa42f9303571f">
                commit
              </a>
              <br />
              Currently applied, but tricky to handle sizes
            </li>
          </ol>
          <PageLayout.SubTitle>
            framer motion exit custom variable
          </PageLayout.SubTitle>
          <p>
            state that manages whether the rotation is clockwise or
            counterclockwise(<code>direction</code>), and I was having issues
            with this value looking at the previous value in the exit animation.
            <a href="https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed">
              this example
            </a>
            solves the problem
          </p>
        </PageLayout.DetailsContent>
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

export const MenuDockList = styled('div', {
  position: 'absolute',
  display: 'flex',
  // TODO: DockContent 높이 + 여백값으로 변경
  top: 340,
  left: 0,
});

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

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Dock Menu"
      description="Oval Dock Menu with Content"
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query PageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/dock-item.jpeg" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 900)
      }
    }
  }
`;
