import type { Metadata } from 'next';

import OtpInputClient from './page.client';

export const metadata: Metadata = {
  title: 'OTP Input',
  description: 'One-time code input with merge, wave, and error states',
};

export default function OtpInputPage() {
  return <OtpInputClient />;
}
