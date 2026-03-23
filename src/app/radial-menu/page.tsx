import type { Metadata } from 'next';
import RadialMenuClient from './page.client';

export const metadata: Metadata = {
  title: 'Radial Menu',
  description: 'Radial Menu with Content',
  openGraph: {
    images: ['/thumbnails/radial-menu.jpeg'],
  },
};

export default function RadialMenuPage() {
  return <RadialMenuClient />;
}
