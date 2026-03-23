import type { Metadata } from 'next';
import DockMenuClient from './page.client';

export const metadata: Metadata = {
  title: 'Dock Menu',
  description: 'Oval Dock Menu with Content',
  openGraph: {
    images: ['/thumbnails/dock-item.jpeg'],
  },
};

export default function DockMenuPage() {
  return <DockMenuClient />;
}
