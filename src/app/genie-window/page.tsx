import type { Metadata } from 'next';
import GenieWindowClient from './page.client';

export const metadata: Metadata = {
  title: 'Genie Window',
  openGraph: {
    images: ['/thumbnails/genie-effect.png'],
  },
};

export default function GenieWindowPage() {
  return <GenieWindowClient />;
}
