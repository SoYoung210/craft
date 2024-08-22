import { ParticleEffect } from '../components/content/particle-effect/ParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function ParticleEffectPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>

      <ParticleEffect>Hello !</ParticleEffect>

      <div style={{ marginTop: 40 }}>
        <ParticleEffect>🎅</ParticleEffect>
      </div>

      {/* FIXME: have to solve img CORS issue (on canvas rendering) */}
      {/* <div style={{ marginTop: 40 }}>
        <ParticleEffect>
          <img
            width={120}
            height={120}
            style={{
              borderRadius: 999,
              width: 120,
              height: 120,
            }}
            crossOrigin="anonymous"
            src="https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1.jpg"
          />
        </ParticleEffect>
      </div> */}
    </PageLayout>
  );
}
