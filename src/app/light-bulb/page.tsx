import type { Metadata } from 'next';
import LightBulbClient from './page.client';

export const metadata: Metadata = {
  title: 'Light Bulb',
  openGraph: {
    images: ['/thumbnails/light-bulb.jpg'],
  },
};

export default function LightBulbPage() {
  return <LightBulbClient />;
}
