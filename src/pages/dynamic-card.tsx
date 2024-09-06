import { PageProps, graphql } from 'gatsby';

import { styled } from '../../stitches.config';
import DynamicCard from '../components/content/dynamic-card/DynamicCard';
import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';
import Text from '../components/material/Text';

export default function CardPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Dynamic Card</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          Apply rotation and lighting effects based on mouse hover position /
          hologram effect
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          Angle: Math.log2(x, y 좌표 거리), Lightening gradient: #ffffff55,
          #0000000f <br />
          <a
            href="https://codepen.io/nycos62/pen/PoaKZjL"
            target="_blank"
            rel="noreferrer"
          >
            holographic effect reference
          </a>
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <DynamicCard />
      <Caption>
        Card Designed by{' '}
        <Text asChild color="gray6" css={{ textDecoration: 'underline' }}>
          <a href="https://jihoonwrks.me/" target="_blank" rel="noreferrer">
            jihoon-yu
          </a>
        </Text>
      </Caption>
    </PageLayout>
  );
}

const Caption = styled('div', {
  fontFamily: 'monospace',
  color: '$gray5',
  textAlign: 'center',
});

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Dynamic Card"
      description="3D Transform Gradient Card"
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
      absolutePath: { glob: "**/src/images/thumbnails/dynamic-card.png" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 960)
      }
    }
  }
`;
