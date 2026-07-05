'use client';

import MasonryGallery from '../../components/content/media-preview/MasonryGallery';

export default function MediaPreviewClient() {
  return (
    <main className="min-h-screen bg-[#101010] px-4 py-8 min-[1200px]:px-8">
      <div className="mx-auto max-w-[1440px]">
        <MasonryGallery />
      </div>
    </main>
  );
}
