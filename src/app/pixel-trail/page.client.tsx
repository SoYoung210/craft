'use client';

import { OnboardingShaderBackground } from '../../components/content/pixel-trail/onboarding-shader-background';

const IMAGE_URL = '/images/shader-image/test2.webp';

export default function PixelTrailClient() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <OnboardingShaderBackground imageUrl={IMAGE_URL} />
    </div>
  );
}
