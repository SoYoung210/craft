'use client';

import { useState } from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import { RotateCcw } from 'lucide-react';

import { ShineImageShader } from '../../components/content/ripple-shader/shine-image-shader';

const IMAGE_URL = '/thumbnails/ripple_clean.webp';

export default function RippleShaderClient() {
  const [replayKey, setReplayKey] = useState(0);

  const params = useDialKit('Shine Image Shader', {
    duration: [3.5, 0.3, 5.0, 0.1],
    delay: [0, 0, 3.0, 0.1],
    spread: [0.15, 0.01, 0.5, 0.01],
    glowColor: '#ffffff',
    glowIntensity: [1.0, 0, 3.0, 0.1],
    objectFit: { type: 'select', options: ['cover', 'contain'], default: 'cover' },
    objectPosition: { type: 'select', options: ['center', 'top'], default: 'top' },
    borderRadius: [32, 0, 64, 1],
    chromaticAberration: [1.0, 0, 5.0, 0.1],
    iridescence: [1.0, 0, 1.0, 0.05],
    causticIntensity: [0.5, 0, 2.0, 0.05],
  });

  return (
    <>
      <DialRoot />
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
              imageUrl={IMAGE_URL}
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
              autoPlay={replayKey > 0}
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
