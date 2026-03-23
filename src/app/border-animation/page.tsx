import type { Metadata } from 'next';
import BorderAnimationClient from './page.client';

export const metadata: Metadata = {
  title: 'Gradient Border',
  description: 'Gradient Button Border Animation',
  openGraph: {
    images: ['/thumbnails/border-animation.jpg'],
  },
};

export default function BorderAnimationPage() {
  return <BorderAnimationClient />;
}
