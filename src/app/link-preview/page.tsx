import type { Metadata } from 'next';
import LinkPreviewClient from './page.client';

export const metadata: Metadata = {
  title: 'Link Preview',
  description:
    'preview of the link on hover and focus to maintain attention.',
  openGraph: {
    images: ['/thumbnails/link_preview.jpg'],
  },
};

export default function LinkPreviewPage() {
  return <LinkPreviewClient />;
}
