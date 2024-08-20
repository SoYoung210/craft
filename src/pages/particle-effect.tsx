import { ParticleEffect } from '../components/content/particle-effect/ParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function ParticleEffectPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>
      <ParticleEffect />
    </PageLayout>
  );
}
