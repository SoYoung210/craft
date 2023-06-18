import { graphql, PageProps } from 'gatsby';

import { Video } from '../components/content/floating-video/Video';
import PageLayout from '../components/layout/PageLayout';
import SEO from '../components/layout/SEO';
import MockVideo from '../images/video/ocean_960.mp4';

const mockVideoAspectRatio = (960 / 540).toString();
export default function FloatingVideo(props: PageProps<Queries.PageDataQuery>) {
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
        poster={props.data.poster?.childImageSharp?.gatsbyImageData}
      />
      <div style={{ height: '114vh' }}>scrollable content</div>
    </PageLayout>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Floating Video"
      description="Video Player(Arc Browser pip video player style)"
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query PageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/floating-video.jpg" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
    poster: file(
      absolutePath: { glob: "**/src/images/video/ocean-poster.png" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, placeholder: BLURRED)
      }
    }
  }
`;
