import type { Metadata } from 'next';
import DynamicIslandTOCClient from './page.client';

export const metadata: Metadata = {
  title: 'Dynamic Island TOC',
  description: 'March 2025',
  openGraph: {
    images: ['/thumbnails/dynamic-island-toc.webp'],
  },
};

export default function DynamicIslandTOCPage() {
  return <DynamicIslandTOCClient />;
}
