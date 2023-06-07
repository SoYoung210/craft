import { Video } from '../components/content/floating-video/Video';
import PageLayout from '../components/layout/PageLayout';
import MockVideo from '../images/video/ocean.mp4';

export default function StickyVideo() {
  return (
    <PageLayout>
      <PageLayout.Title>Sticky Video</PageLayout.Title>
      <PageLayout.Details></PageLayout.Details>
      <Video url={MockVideo} />
      <div style={{ height: '114vh' }}>scrollable content</div>
    </PageLayout>
  );
}
