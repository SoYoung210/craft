import { Video } from '../components/content/sticky-video/Video';
import PageLayout from '../components/layout/PageLayout';

const TEST_URL = 'https://www.youtube.com/watch?v=GTMcaAKXxAY';
export default function StickyVideo() {
  return (
    <PageLayout>
      <PageLayout.Title>Sticky Video</PageLayout.Title>
      <PageLayout.Details></PageLayout.Details>
      <Video url={TEST_URL} />
      <div style={{ height: '114vh' }}>scrollable content</div>
    </PageLayout>
  );
}
