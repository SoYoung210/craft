import { useState } from 'react';

import { keyframes, styled } from '../../stitches.config';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function ImageTipsPage() {
  const [loaded, setLoaded] = useState(false);
  return (
    <PageLayout>
      <PageLayout.Title>Image Tips</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>fade in, aspect ratio</PageLayout.Summary>
      </PageLayout.Details>

      <Content>
        <ContentTitle>Reveal Animation</ContentTitle>
        <Image
          alt="james web image"
          src="https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_star-forming_region_carina_nircam_final-5mb.jpg"
          onLoad={() => setLoaded(true)}
          loaded={loaded}
        />
      </Content>
    </PageLayout>
  );
}

const reveal = keyframes({
  '0%': {
    mask: 'linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 150% 0 / 400% no-repeat',
    opacity: 0.2,
  },
  '100%': {
    mask: 'linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 0 / 400% no-repeat',
    opacity: 1,
  },
});
const Content = styled('section', {});
const ContentTitle = styled('h2', {
  color: '$gray8',
  marginBottom: 14,
});

const Image = styled('img', {
  width: '100%',

  opacity: 0,

  variants: {
    loaded: {
      true: {
        opacity: 1,
        animation: `${reveal} 0.4s ease`,
      },
    },
  },
});
