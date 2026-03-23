'use client';

import { useState } from 'react';

import PageLayout from '../../components/layout/page-layout/PageLayout';

const revealKeyframes = `
@keyframes reveal {
  0% {
    mask: linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 150% 0 / 400% no-repeat;
    opacity: 0.2;
  }
  100% {
    mask: linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 0 / 400% no-repeat;
    opacity: 1;
  }
}
`;

export default function ImageClient() {
  const [loaded, setLoaded] = useState(false);
  return (
    <PageLayout>
      <style>{revealKeyframes}</style>
      <PageLayout.Title>Image Tips</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>fade in, aspect ratio</PageLayout.Summary>
      </PageLayout.Details>

      <section>
        <h2 style={{ color: '#343a40', marginBottom: 14 }}>
          Reveal Animation
        </h2>
        <img
          alt="james web image"
          src="https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_star-forming_region_carina_nircam_final-5mb.jpg"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            opacity: loaded ? 1 : 0,
            ...(loaded
              ? { animation: 'reveal 0.4s ease' }
              : {}),
          }}
        />
      </section>
    </PageLayout>
  );
}
