import type { Metadata } from 'next';

import RippleShaderClient from './page.client';

export const metadata: Metadata = {
  title: 'Ripple Shader',
  description: 'WebGL image shader with ripple/shine animation.',
  openGraph: {
    images: ['/thumbnails/ripple_og.png'],
  },
};

export default function RippleShaderPage() {
  return <RippleShaderClient />;
}
