'use client';

import { PhysicsChips } from '../../components/content/input/PhysicsChips';
import PageLayout from '../../components/layout/page-layout/PageLayout';

export default function InputClient() {
  return (
    <PageLayout>
      <PageLayout.Title>Input</PageLayout.Title>
      <PhysicsChips />
    </PageLayout>
  );
}
