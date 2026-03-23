import type { Metadata } from 'next';
import GlowCursorListClient from './page.client';

export const metadata: Metadata = {
  title: 'Glow Cursor',
  description: 'linear-features style glow cursor list',
  openGraph: {
    images: ['/thumbnails/glow-cursor.jpg'],
  },
};

export default function GlowCursorListPage() {
  return <GlowCursorListClient />;
}
