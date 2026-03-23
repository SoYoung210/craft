import type { Metadata } from 'next';
import RandomTextClient from './page.client';

export const metadata: Metadata = {
  title: 'Random Text Animation',
  description: 'scrambled text reveal animation',
  openGraph: {
    images: ['/thumbnails/random-text.png'],
  },
};

export default function RandomTextPage() {
  return <RandomTextClient />;
}
