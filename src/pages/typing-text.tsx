import { graphql, PageProps } from 'gatsby';

import { css } from '../../stitches.config';
import TypingText from '../components/content/type-text/TypingText';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';

export default function TypingTextPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Text Typing Effect (w. Highlight)</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>gsap timeline</PageLayout.Summary>
      </PageLayout.Details>
      <Figure
        theme="dark"
        className={css({
          position: 'relative',
          fontSize: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 600,
        })()}
      >
        <TypingText
          highlightColor="#8490FF"
          style={{
            marginLeft: '6%',
          }}
        >
          youtube.com
          <TypingText.Highlight>/@feconfkorea</TypingText.Highlight>
        </TypingText>
      </Figure>
    </PageLayout>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Typing Text"
      description="Typing Text Effect"
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    >
      <link
        href="https://fonts.googleapis.com/css?family=Red+Hat+Display:400,700&display=swap"
        rel="stylesheet"
      />
    </SEO>
  );
};

export const query = graphql`
  query PageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/typing-text.png" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
  }
`;
