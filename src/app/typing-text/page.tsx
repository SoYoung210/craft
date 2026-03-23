import type { Metadata } from 'next';
import TypingTextClient from './page.client';

export const metadata: Metadata = {
  title: 'Typing Text',
  description: 'Typing Text Effect',
  openGraph: {
    images: ['/thumbnails/typing-text.png'],
  },
};

export default function TypingTextPage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css?family=Red+Hat+Display:400,700&display=swap"
        rel="stylesheet"
      />
      <TypingTextClient />
    </>
  );
}
