'use client';

import dynamic from 'next/dynamic';

const ParticlesLoopClient = dynamic(() => import('./page.client'), {
  ssr: false,
});

export default function ParticlesLoopWrapper() {
  return <ParticlesLoopClient />;
}
