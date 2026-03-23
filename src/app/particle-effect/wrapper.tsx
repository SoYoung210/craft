'use client';

import dynamic from 'next/dynamic';

const ParticleEffectClient = dynamic(() => import('./page.client'), {
  ssr: false,
});

export default function ParticleEffectWrapper() {
  return <ParticleEffectClient />;
}
