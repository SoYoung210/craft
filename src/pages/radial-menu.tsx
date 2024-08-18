import { useEffect, useState } from 'react';

import {
  RadialMenu,
  RadialMenuItem,
} from '../components/content/radial-menu/RadialMenu';
import PageLayout from '../components/layout/page-layout/PageLayout';
import BeautyBush from '../images/menu-dock/beauty-bush.webp';
import Prim from '../images/menu-dock/prim.webp';
import Flax from '../images/menu-dock/flax.webp';
import RoyalHeath from '../images/menu-dock/royal-heath.webp';
import PaleCornflowerBlue from '../images/menu-dock/pale-cornflower-blue.webp';
import { Placeholder } from '../components/content/radial-menu/Placeholder';
import { styled } from '../../stitches.config';

export const GRADIENT_IMAGES = [
  BeautyBush,
  Prim,
  RoyalHeath,
  PaleCornflowerBlue,
  Flax,
];

const Image = ({ index }: { index: number }) => {
  return (
    <img
      src={GRADIENT_IMAGES[index]}
      style={{
        height: 28,
        aspectRatio: '1 / 1',
        borderRadius: 999,
      }}
    />
  );
};
export default function RadialMenuPage() {
  const [initialPos, setInitialPos] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const handleResize = () => {
      setInitialPos({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  const key =
    initialPos != null ? `${initialPos.x}-${initialPos.y}` : undefined;

  return (
    <PageLayout style={{ minWidth: 760 }}>
      <PageLayout.Title style={{ zIndex: 1 }}>Radial Menu</PageLayout.Title>
      <Description style={{ zIndex: 1 }}>
        Initially, the menu is closed when clicking outside. Press 'A', then
        move the mouse elsewhere
      </Description>
      <RadialMenu key={key} initialPosition={initialPos}>
        <RadialMenuItem
          onSelect={() => {
            console.log('[onSelect] Beauty Bush');
          }}
          label="Beauty Bush"
        >
          <Image index={0} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('[onSelect] Prim');
          }}
          label="Prim"
        >
          <Image index={1} />
        </RadialMenuItem>
        <RadialMenuItem>
          <Placeholder />
        </RadialMenuItem>
        <RadialMenuItem>
          <Placeholder />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('[onSelect] Royal Heath');
          }}
          label="Royal Heath"
        >
          <Image index={2} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('[onSelect] Flax');
          }}
          label="Flax"
        >
          <Image index={4} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('[onSelect] Pale Cornflower Blue');
          }}
          label="Pale Cornflower Blue"
        >
          <Image index={3} />
        </RadialMenuItem>
        <RadialMenuItem>
          <Placeholder />
        </RadialMenuItem>
      </RadialMenu>
    </PageLayout>
  );
}

const Description = styled('p', {
  color: '$gray6',
  marginTop: -22,
});
