import { graphql, PageProps } from 'gatsby';
import { useReducer } from 'react';

import RandomText from '../components/content/random-text/RandomText';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';
import SEO from '../components/layout/SEO';
import Button from '../components/material/Button';
import { RotateLeftIcon } from '../components/material/icon/RotateLeft';

export default function RandomTextPage() {
  const [key, increaseKey] = useReducer(state => state + 1, 0);

  return (
    <PageLayout>
      <PageLayout.Title>Random Text Effect</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>scrabmle</PageLayout.Summary>
        <PageLayout.DetailsContent>
          use defined characters to scramble text
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <Figure
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          position: 'relative',
        }}
      >
        <RandomText
          key={key}
          interval={30}
          style={{ fontSize: 18, fontWeight: 300 }}
        >
          <RandomText.Block>
            Unstyled, Composable Random Text Animation
          </RandomText.Block>
          <RandomText.Block
            style={{ marginLeft: 4, textDecoration: 'underline' }}
          >
            React Component
          </RandomText.Block>
        </RandomText>
        <Button
          aria-label="reload random text animation"
          style={{ position: 'absolute', top: 10, right: 32 }}
          onClick={increaseKey}
        >
          <RotateLeftIcon size={14} />
        </Button>
      </Figure>
    </PageLayout>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Random Text Animation"
      description="scrambled text reveal animation"
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
      absolutePath: { glob: "**/src/images/thumbnails/random-text.png" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
  }
`;
