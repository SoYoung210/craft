import { useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import { Leva, useControls } from 'leva';
import { RotateCcw } from 'lucide-react';

import { globalStyles } from '../styles/global';
import SEO from '../components/layout/SEO';
import { ShineImageShader } from '../components/content/ripple-shader/shine-image-shader';

export default function RippleShaderPage({
  data,
}: PageProps<Queries.RippleShaderPageQuery>) {
  globalStyles();
  const imageUrl = data.testImage?.publicURL ?? '';
  const [replayKey, setReplayKey] = useState(0);

  const params = useControls('Shine Image Shader', {
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
    spread: {
      value: 0.15,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      label: 'Spread',
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
    chromaticAberration: {
      value: 1.0,
      min: 0,
      max: 5.0,
      step: 0.1,
      label: 'Chromatic Aberration',
    },
    iridescence: {
      value: 1.0,
      min: 0,
      max: 1.0,
      step: 0.05,
      label: 'Iridescence',
    },
    causticIntensity: {
      value: 0.5,
      min: 0,
      max: 2.0,
      step: 0.05,
      label: 'Caustic Intensity',
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
      <div
        style={{
          minHeight: '100vh',
          background: '#0c0c0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 900 }}>
          <div
            style={{
              width: '100%',
              height: 600,
              background: '#0a0a0a',
              borderRadius: 24,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ShineImageShader
              key={replayKey}
              imageUrl={imageUrl}
              spread={params.spread}
              objectFit={params.objectFit as 'cover' | 'contain'}
              objectPosition={params.objectPosition as 'center' | 'top'}
              backgroundColor="#0a0a0a"
              borderRadius={params.borderRadius}
              duration={params.duration}
              delay={params.delay}
              glowColor={params.glowColor}
              glowIntensity={params.glowIntensity}
              chromaticAberration={params.chromaticAberration}
              iridescence={params.iridescence}
              causticIntensity={params.causticIntensity}
            />
            <button
              onClick={() => setReplayKey(k => k + 1)}
              title="Replay"
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: 'none',
                borderRadius: 7,
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              <RotateCcw size={12} />
            </button>
          </div>
          <p
            style={{
              marginTop: 12,
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.02em',
            }}
          >
            Photo by{' '}
            <a
              href="https://www.sebliu.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
            >
              Seb
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Ripple Shader"
      description="WebGL image shader with ripple/shine animation."
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query RippleShaderPage {
    testImage: file(
      absolutePath: { glob: "**/src/images/shader-image/test2.webp" }
    ) {
      publicURL
    }
  }
`;
