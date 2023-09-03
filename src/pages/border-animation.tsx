import { PageProps, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

import BorderAnimationButton from '../components/content/border-animation/Button';
import FigureTabs from '../components/layout/FigureTab';
import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';
import Flex from '../components/material/Flex';

export default function BorderAnimation() {
  return (
    <PageLayout>
      <PageLayout.Title>BorderAnimation</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          Border Animation using css{' '}
          <a
            href="https://developer.mozilla.org/ko/docs/Web/CSS/mask"
            target="_blank"
            rel="noreferrer"
          >
            mask
          </a>
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          <ul>
            Reference:{' '}
            <li>
              <a href="https://css-tricks.com/almanac/properties/m/mask-origin/">
                mask-origin
              </a>{' '}
            </li>
            <li>
              <a href="https://css-tricks.com/almanac/properties/m/mask-composite/">
                mask-composite
              </a>{' '}
            </li>
            <li>
              <a href="https://css-tricks.com/mask-compositing-the-crash-course/">
                mask-overall
              </a>{' '}
            </li>
          </ul>
          <div style={{ paddingInlineStart: '1.4rem', marginTop: '1.2rem' }}>
            <StaticImage
              src="../images/border-animation/border-mask.jpg"
              alt="border mask two layers(mask-composite: exclude)"
              width={360}
            />
          </div>
        </PageLayout.DetailsContent>
      </PageLayout.Details>

      <FigureTabs theme="dark" defaultValue="rain">
        <Flex justifyContent="center" alignItems="center">
          <FigureTabs.Content value="gray">
            <BorderAnimationButton
              animationActive={true}
              borderWidth={1}
              activeBorderColor="conic-gradient(#0000 135deg,#ffffff80 180deg,#0000 225deg)"
            >
              Submit...
            </BorderAnimationButton>
          </FigureTabs.Content>
          <FigureTabs.Content value="rainbow">
            <BorderAnimationButton
              animationActive={true}
              borderWidth={1}
              activeBorderColor="conic-gradient(#D56767,#CF8949,#D8D364,#59A46A,#486191,#724A9A)"
            >
              Submit...
            </BorderAnimationButton>
          </FigureTabs.Content>
          <FigureTabs.Content value="blue">
            <BorderAnimationButton
              animationActive={true}
              borderWidth={1}
              activeBorderColor="conic-gradient(#0000 135deg,#1B64DA 180deg,#0000 225deg)"
            >
              Submit...
            </BorderAnimationButton>
          </FigureTabs.Content>
          <FigureTabs.Content value="rain">
            <BorderAnimationButton
              animationActive={true}
              borderWidth={1}
              activeBorderColor="conic-gradient(#593B9F, #583A9F, #5169B8, #43D7EF , #42DEF3 , #71ADC5 , #928BA5 , #CC705F , #874C60, #63343B, #593B9F , #583A9F )"
            >
              Submit...
            </BorderAnimationButton>
          </FigureTabs.Content>
        </Flex>
        <FigureTabs.List css={{ justifyContent: 'center' }}>
          <FigureTabs.Trigger value="gray">Gray</FigureTabs.Trigger>
          <FigureTabs.Trigger value="blue">Blue</FigureTabs.Trigger>
          <FigureTabs.Trigger value="rainbow">Rainbow</FigureTabs.Trigger>
          <FigureTabs.Trigger value="rain">Rain</FigureTabs.Trigger>
        </FigureTabs.List>
      </FigureTabs>
    </PageLayout>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Gradient Border"
      description="Gradient Button Border Animation"
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
      absolutePath: { glob: "**/src/images/thumbnails/border-animation.jpg" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
  }
`;
