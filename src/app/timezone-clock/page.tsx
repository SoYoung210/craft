import type { Metadata } from 'next';
import TimezoneClockClient from './page.client';

export const metadata: Metadata = {
  title: 'Timezone Clock',
  description:
    'Interactive clock for comparing time between Seoul and San Francisco.',
  openGraph: {
    images: ['/thumbnails/clock-thumbanil-5.webp'],
  },
};

export default function TimezoneClockPage() {
  return <TimezoneClockClient />;
}
