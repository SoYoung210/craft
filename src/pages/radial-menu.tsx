import {
  RadialMenu,
  RadialMenuItem,
} from '../components/content/radial-menu/RadialMenu';
import PageLayout from '../components/layout/page-layout/PageLayout';
import BeautyBush from '../images/menu-dock/beauty-bush.webp';
import BananaMania from '../images/menu-dock/banana-mania.webp';
import Flax from '../images/menu-dock/flax.webp';
import RoyalHeath from '../images/menu-dock/royal-heath.webp';
import PaleCornflowerBlue from '../images/menu-dock/pale-cornflower-blue.webp';
import { Placeholder } from '../components/content/radial-menu/Placeholder';

export const GRADIENT_IMAGES = [
  // 'https://products.ls.graphics/mesh-gradients/images/29.-Pale-Cornflower-Blue_1.jpg', // 0
  // 'https://products.ls.graphics/mesh-gradients/images/05.-Flax.jpg', // 1
  // 'https://products.ls.graphics/mesh-gradients/images/33.-Beauty-Bush.jpg',
  BeautyBush,
  // 'https://products.ls.graphics/mesh-gradients/images/32.-Banana-Mania.jpg',
  BananaMania,
  // 'https://products.ls.graphics/mesh-gradients/images/01.-Royal-Heath.jpg',
  RoyalHeath,
  // 'https://products.ls.graphics/mesh-gradients/images/29.-Pale-Cornflower-Blue_1.jpg',
  PaleCornflowerBlue,
  // 'https://products.ls.graphics/mesh-gradients/images/05.-Flax.jpg',
  Flax,
  // 'https://products.ls.graphics/mesh-gradients/images/33.-Beauty-Bush.jpg', // 7
  // 'https://products.ls.graphics/mesh-gradients/images/32.-Banana-Mania.jpg', // 8
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
  return (
    <PageLayout style={{ minWidth: 760 }}>
      <PageLayout.Title>RadialMenu</PageLayout.Title>
      <RadialMenu>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 1');
          }}
        >
          <Image index={0} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 2');
          }}
        >
          <Image index={1} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 3');
          }}
        >
          <Image index={2} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 4');
          }}
        >
          <Placeholder />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 5');
          }}
        >
          <Placeholder />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 6');
          }}
        >
          <Image index={4} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 7');
          }}
        >
          <Image index={3} />
        </RadialMenuItem>
        <RadialMenuItem
          onSelect={() => {
            console.log('@@@ 1');
          }}
        >
          <Placeholder />
        </RadialMenuItem>
      </RadialMenu>
    </PageLayout>
  );
}
