'use client';

import { PhysicsChips } from '../../components/content/input/PhysicsChips';
import PageLayout from '../../components/layout/page-layout/PageLayout';

export default function ChipSelectClient() {
  return (
    <PageLayout className="max-w-[1080px]">
      <PageLayout.Title>Chip Select</PageLayout.Title>
      <PhysicsChips />
    </PageLayout>
  );
}
