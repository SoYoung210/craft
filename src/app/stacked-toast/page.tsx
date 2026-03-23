import type { Metadata } from 'next';
import StackedToastClient from './page.client';

export const metadata: Metadata = {
  title: 'Stacked Toast',
  description: 'macos style toast',
  openGraph: {
    images: ['/thumbnails/stacked-toast_2x.png'],
  },
};

export default function StackedToastPage() {
  return <StackedToastClient />;
}
