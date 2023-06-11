import { Video } from '../components/content/floating-video/Video';
import PageLayout from '../components/layout/PageLayout';
import MockVideo from '../images/video/ocean.mp4';

export default function FloatingVideo() {
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
      <Video url={MockVideo} />
      <div style={{ height: '114vh' }}>scrollable content</div>
    </PageLayout>
  );
}
