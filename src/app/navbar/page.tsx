import type { Metadata } from 'next';

import NavbarClient from './page.client';

export const metadata: Metadata = {
  title: 'Navbar',
  description:
    'Scroll-shrinking navbar with collapsing wordmark, themed after verstappen.com',
};

export default function NavbarPage() {
  return <NavbarClient />;
}
