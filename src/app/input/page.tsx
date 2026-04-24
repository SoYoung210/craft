import type { Metadata } from 'next';

import InputClient from './page.client';

export const metadata: Metadata = {
  title: 'Input',
  description: 'Tag selection with morphing Add Occupation input',
};

export default function InputPage() {
  return <InputClient />;
}
