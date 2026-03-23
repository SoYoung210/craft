import type { Metadata } from 'next';
import ParticleTextClient from './page.client';

export const metadata: Metadata = {
  title: 'Particle Text',
  openGraph: {
    images: ['/thumbnails/particle-text.jpg'],
  },
};

export default function ParticleTextPage() {
  return <ParticleTextClient />;
}
