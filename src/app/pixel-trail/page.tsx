import type { Metadata } from 'next';

import PixelTrailClient from './page.client';

export const metadata: Metadata = {
  title: 'Pixel Trail',
  description: 'WebGL pixel-grid dissolve shader with fluid mouse trail.',
};

export default function PixelTrailPage() {
  return <PixelTrailClient />;
}
