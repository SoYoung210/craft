import type { Metadata } from 'next';
import FloatingVideoClient from './page.client';

export const metadata: Metadata = {
  title: 'Floating Video',
  description: 'Video Player(Arc Browser pip video player style)',
  openGraph: {
    images: ['/thumbnails/floating-video.jpg'],
  },
};

export default function FloatingVideoPage() {
  return <FloatingVideoClient />;
}
