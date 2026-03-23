import type { Metadata } from 'next';
import ParticlesLoopWrapper from './wrapper';

export const metadata: Metadata = {
  title: 'Particles Loop',
  description: 'December 2025',
  openGraph: {
    images: ['/thumbnails/particles-loop.webp'],
  },
};

export default function ParticlesLoopPage() {
  return <ParticlesLoopWrapper />;
}
