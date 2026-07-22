import type { Metadata } from 'next';

import CardFrameClient from './page.client';

export const metadata: Metadata = {
  title: 'Card Frame',
  description: 'Floating molded frames with cursor-driven 3D tilt',
  openGraph: {
    images: ['/thumbnails/card-frame.webp'],
  },
};

export default function CardFramePage() {
  return <CardFrameClient />;
}
