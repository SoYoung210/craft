import type { Metadata } from 'next';

import ChipSelectClient from './page.client';

export const metadata: Metadata = {
  title: 'Chip Select',
  description: 'Chip selection with physics gravity drop',
};

export default function ChipSelectPage() {
  return <ChipSelectClient />;
}
