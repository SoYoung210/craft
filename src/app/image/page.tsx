import type { Metadata } from 'next';
import ImageClient from './page.client';

export const metadata: Metadata = {
  title: 'Image Tips',
};

export default function ImagePage() {
  return <ImageClient />;
}
