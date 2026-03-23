import type { Metadata } from 'next';
import SwitchTabClient from './page.client';

export const metadata: Metadata = {
  title: 'Switch Tab',
  description: 'Mac, Arc Style Switch Tab (use Space + Tab)',
  openGraph: {
    images: ['/thumbnails/switch-tab-1.jpg'],
  },
};

export default function SwitchTabPage() {
  return <SwitchTabClient />;
}
