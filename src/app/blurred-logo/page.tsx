import type { Metadata } from 'next';
import BlurredLogoClient from './page.client';

export const metadata: Metadata = {
  title: 'Blurred Logo',
  description:
    'A selection of logos on top of a blurred and scaled background based on the given logo.',
  openGraph: {
    images: ['/thumbnails/blurred-logo.png'],
  },
};

export default function BlurredLogoPage() {
  return <BlurredLogoClient />;
}
