import type { Metadata } from 'next';
import IndexClient from './page.client';

export const metadata: Metadata = {
  title: 'soyoung — craft',
  description:
    'Build, Collect user interfaces of the future what is exciting and challenging to create.',
  openGraph: {
    images: ['/thumbnails/index.jpg'],
  },
};

export default function IndexPage() {
  return <IndexClient />;
}
