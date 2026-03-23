'use client';

import { Video } from '../../components/content/floating-video/Video';
import PageLayout from '../../components/layout/page-layout/PageLayout';

const MockVideo = '/images/video/ocean_960.mp4';
const mockVideoAspectRatio = (960 / 540).toString();

export default function FloatingVideoClient() {
  return (
    <PageLayout>
      <PageLayout.Title>Floating Video</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          Inspired by{' '}
          <a href="https://arc.net/" target="_blank" rel="noreferrer">
            Arc Browser
          </a>
        </PageLayout.Summary>
      </PageLayout.Details>
      <Video
        url={MockVideo}
        aspectRatio={mockVideoAspectRatio}
        poster={undefined as any}
      />
      <div style={{ height: '114vh' }}>scrollable content</div>
    </PageLayout>
  );
}
