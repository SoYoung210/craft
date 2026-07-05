'use client';

import { Navbar } from '../../components/content/navbar/Navbar';
import PageLayout from '../../components/layout/page-layout/PageLayout';

function PlaceholderSection({
  id,
  title,
  blocks,
}: {
  id: string;
  title: string;
  blocks: number;
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4">
      <h2 className="text-[20px] font-medium text-gray-8 tracking-[-0.01em]">
        {title}
      </h2>
      {Array.from({ length: blocks }, (_, i) => (
        <div key={i} className="h-56 rounded-xl bg-gray-1" />
      ))}
    </section>
  );
}

export default function NavbarClient() {
  return (
    <>
      <Navbar />
      <PageLayout className="max-w-[1080px] pt-28 md:pt-32 lg:pt-36">
        <PageLayout.Title>Navbar</PageLayout.Title>
        <PageLayout.SubTitle>
          Scroll down to see the bar shrink and the wordmark collapse.
        </PageLayout.SubTitle>
        <PlaceholderSection id="introduction" title="Introduction" blocks={3} />
        <PlaceholderSection id="faq" title="FAQ" blocks={3} />
      </PageLayout>
    </>
  );
}
