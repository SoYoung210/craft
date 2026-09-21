import type { Metadata } from 'next';

import BlurRevealClient from './page.client';

export const metadata: Metadata = {
  title: 'Blur Reveal',
  description:
    'Spring-set headline, frosted-glass frame reveal, and a blurred dome-wipe exit',
  openGraph: {
    images: ['/thumbnails/blur-reveal.webp'],
  },
};

export default function BlurRevealPage() {
  return <BlurRevealClient />;
}
