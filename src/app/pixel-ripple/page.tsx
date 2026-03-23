import type { Metadata } from 'next';
import PixelRippleClient from './page.client';

export const metadata: Metadata = {
  title: 'Pixel Ripple',
  description: 'Nov 2025',
  openGraph: {
    images: ['/thumbnails/pixel-ripple.webp'],
  },
};

export default function PixelRipplePage() {
  return <PixelRippleClient />;
}
