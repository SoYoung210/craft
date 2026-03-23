import type { Metadata } from 'next';
import ConfettiClient from './page.client';

export const metadata: Metadata = {
  title: 'Confetti Examples',
};

export default function ConfettiPage() {
  return <ConfettiClient />;
}
