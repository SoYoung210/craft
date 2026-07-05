import type { Metadata } from 'next';

import MediaPreviewClient from './page.client';

export const metadata: Metadata = {
  title: 'Media Preview',
  description:
    'Masonry gallery with top strip navigation and fullscreen preview',
};

export default function MediaPreviewPage() {
  return <MediaPreviewClient />;
}
