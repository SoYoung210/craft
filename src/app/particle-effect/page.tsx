import type { Metadata } from 'next';
import ParticleEffectWrapper from './wrapper';

export const metadata: Metadata = {
  title: 'Particle Effect',
  description: 'October 2024',
  openGraph: {
    images: ['/thumbnails/particle-effect.webp'],
  },
};

export default function ParticleEffectPage() {
  return <ParticleEffectWrapper />;
}
