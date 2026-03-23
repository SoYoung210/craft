import type { Metadata } from 'next';
import DynamicCardClient from './page.client';

export const metadata: Metadata = {
  title: 'Dynamic Card',
  description: '3D Transform Gradient Card',
  openGraph: {
    images: ['/thumbnails/dynamic-card.png'],
  },
};

export default function DynamicCardPage() {
  return <DynamicCardClient />;
}
