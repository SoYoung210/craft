import { StaticImage } from 'gatsby-plugin-image';
import { PageProps, graphql } from 'gatsby';

import ArcLogo from '../images/blurred-logo-asset/arc.svg';
import SlackLogo from '../images/blurred-logo-asset/slack.svg';
import LogoButton from '../components/content/blurred-logo/LogoButton';
import FigmaLogo from '../images/blurred-logo-asset/figma.svg';
import GoogleCalendarLogo from '../images/blurred-logo-asset/google_calendar.svg';
import FirefoxLogo from '../images/blurred-logo-asset/firefox.svg';
import SafariLogo from '../images/blurred-logo-asset/safari.svg';
import { styled } from '../../stitches.config';
import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';

export default function BlurredLogoPage() {
  return (
    <PageLayout css={{ '&&': { maxWidth: 1024 } }}>
      <PageLayout.Title>Blurred Logo</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          로고를 여러 레이어로 겹치고, 각 레이어에 필터 적용
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          <StaticImage
            src="../images/blurred-logo-asset/layer_description.png"
            alt="blurred logo layer description"
            width={322}
            objectFit="contain"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
            }}
          />
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <Root>
        <LogoButton logo={<FigmaLogo />} />
        <LogoButton logo={<SlackLogo />} />
        <LogoButton logo={<FirefoxLogo />} />
        <LogoButton logo={<SafariLogo />} />
        <LogoButton logo={<GoogleCalendarLogo />} />
        <LogoButton logo={<ArcLogo />} />
      </Root>
    </PageLayout>
  );
}

const Root = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 60,
});

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Blurred Logo"
      description="A selection of logos on top of a blurred and scaled background based on the given logo."
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
      absolutePath: { glob: "**/src/images/thumbnails/blurred-logo.png" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
  }
`;
