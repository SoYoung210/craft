import '@fontsource-variable/inter';
import '@fontsource/nanum-pen-script';
import './globals.css';

import { JetBrains_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';

import { CrtOverlay } from '../components/CrtOverlay';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: { default: 'craft', template: '%s — craft' },
  description:
    'Build, Collect user interfaces of the future what is exciting and challenging to create.',
  metadataBase: new URL('https://craft.so-so.dev'),
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${jetbrainsMono.variable}`}>
      <body>
        <CrtOverlay />
        {children}
      </body>
      <GoogleAnalytics gaId="G-FB1K3CJYRD" />
      <Analytics />
    </html>
  );
}
