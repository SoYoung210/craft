'use client';

import { GRADIENT_IMAGES } from '../../components/content/menu-dock/constant';
import { DockContent } from '../../components/content/menu-dock/DockContent';
import { DockItem } from '../../components/content/menu-dock/DockItem';
import MenuDock from '../../components/content/menu-dock/MenuDock';
import PageLayout from '../../components/layout/page-layout/PageLayout';

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
export default function DockMenuClient() {
  return (
    <PageLayout style={{ minWidth: 760 }}>
      <div
        className="pointer-events-none fixed left-1/2 top-[10%] -translate-x-1/2 -z-10 w-[72%] h-[30%] opacity-[0.22] blur-[80px] saturate-150"
        style={{
          backgroundImage:
            'radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 33% 50%, rgb(140, 168, 232) 0px, transparent 50%)',
        }}
      />
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
      <div
        className="relative overflow-hidden pt-4 flex justify-center"
        style={{ height: 406 }}
      >
        <style>{`
          .dock-page-content::before,
          .dock-page-content::after {
            content: "";
            position: absolute;
            z-index: 1;
            backdrop-filter: blur(0.8px);
            width: 180px;
            height: 120px;
            pointer-events: none;
            background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.76));
            -webkit-mask-image: linear-gradient(to top, rgba(255, 255, 255, 0.76) 20%, transparent);
          }
          .dock-page-content::before { left: 0; bottom: 0; }
          .dock-page-content::after { right: 0; bottom: 0; }
        `}</style>
        <div className="dock-page-content relative w-full h-full flex justify-center">
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
        </div>
      </div>
    </PageLayout>
  );
}

export function MenuDockList({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="absolute flex" style={{ top: 340, left: 0 }} {...props}>
      {children}
    </div>
  );
}
