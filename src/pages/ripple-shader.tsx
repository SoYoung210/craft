import { useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import { Leva, useControls } from 'leva';

import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';
import { ShineImageShader } from '../components/content/ripple-shader/shine-image-shader';

export default function RippleShaderPage({
  data,
}: PageProps<Queries.RippleShaderPageQuery>) {
  const imageUrl = data.testImage?.publicURL ?? '';
  const [replayKey, setReplayKey] = useState(0);

  const params = useControls('Shine Image Shader', {
    sharpness: {
      value: 0.7,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      label: 'Sharpness',
    },
    spread: {
      value: 0.15,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      label: 'Spread',
    },
    duration: {
      value: 3.5,
      min: 0.3,
      max: 5.0,
      step: 0.1,
      label: 'Duration (s)',
    },
    delay: {
      value: 0,
      min: 0,
      max: 3.0,
      step: 0.1,
      label: 'Delay (s)',
    },
    glowColor: {
      value: '#ffffff',
      label: 'Glow Color',
    },
    glowIntensity: {
      value: 1.0,
      min: 0,
      max: 3.0,
      step: 0.1,
      label: 'Glow Intensity',
    },
    objectFit: {
      value: 'cover',
      options: ['cover', 'contain'],
      label: 'Object Fit',
    },
    objectPosition: {
      value: 'top',
      options: ['center', 'top'],
      label: 'Object Position',
    },
    borderRadius: {
      value: 32,
      min: 0,
      max: 64,
      step: 1,
      label: 'Border Radius',
    },
  });

  return (
    <>
      <Leva
        titleBar={{ drag: true }}
        collapsed={false}
        theme={{
          sizes: {
            rootWidth: '280px',
            controlWidth: '120px',
          },
          space: {
            sm: '6px',
          },
        }}
      />
      <PageLayout>
        <PageLayout.Title>Ripple Shader</PageLayout.Title>
        <PageLayout.Details>
          <PageLayout.Summary>
            A WebGL image shader with a ripple/shine animation on load.
          </PageLayout.Summary>
        </PageLayout.Details>
        <div
          style={{
            width: '100%',
            height: 600,
            background: '#0a0a0a',
            borderRadius: 16,
            position: 'relative',
          }}
        >
          <ShineImageShader
            key={replayKey}
            imageUrl={imageUrl}
            objectFit={params.objectFit as 'cover' | 'contain'}
            objectPosition={params.objectPosition as 'center' | 'top'}
            backgroundColor="#0a0a0a"
            borderRadius={params.borderRadius}
            sharpness={params.sharpness}
            spread={params.spread}
            duration={params.duration}
            delay={params.delay}
            glowColor={params.glowColor}
            glowIntensity={params.glowIntensity}
          />
          <button
            onClick={() => setReplayKey(k => k + 1)}
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            Replay
          </button>
        </div>
      </PageLayout>
    </>
  );
}

export const Head = () => (
  <SEO
    title="Ripple Shader"
    description="WebGL image shader with ripple/shine animation."
  />
);

export const query = graphql`
  query RippleShaderPage {
    testImage: file(
      absolutePath: { glob: "**/src/images/shader-image/test1.jpeg" }
    ) {
      publicURL
    }
  }
`;
