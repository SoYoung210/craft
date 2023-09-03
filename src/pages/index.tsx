import { graphql, PageProps, Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

import { ContentBox } from '../components/layout/content-box/ContentBox';
import PageLayout from '../components/layout/page-layout/PageLayout';
import ContentList from '../components/layout/ContentList';
import SEO from '../components/layout/SEO';

const IndexPage = () => {
  return (
    <PageLayout theme="gradient">
      <PageLayout.Title>craft</PageLayout.Title>
      <ContentList>
        <ContentList.Item active>
          <Link to="/glow-cursor-list">
            <ContentBox title="Glow Cursor List">
              <StaticImage
                src="../images/thumbnails/glow-cursor.jpg"
                alt="Glow Cursor List content preview"
                placeholder="none"
                objectFit="contain"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
                quality={70}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link to="/floating-video">
            <ContentBox title="floating video">
              <StaticImage
                src="../images/thumbnails/floating-video.jpg"
                alt="Video Player Arc Browser style"
                placeholder="none"
                objectFit="contain"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
                quality={70}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link to="/random-text">
            <ContentBox title="random text">
              <StaticImage
                src="../images/thumbnails/random-text.png"
                alt="Random Text content preview"
                placeholder="blurred"
                objectFit="contain"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link to="/link-preview">
            <ContentBox title="link preview">
              <StaticImage
                src="../images/thumbnails/link_preview.jpg"
                alt="link Preview content preview"
                placeholder="blurred"
                objectFit="contain"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link to="/stacked-toast">
            <ContentBox title="stacked toast">
              <StaticImage
                src="../images/thumbnails/stacked-toast.jpg"
                alt="stacked toast content preview"
                placeholder="blurred"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                  width: '100%',
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/dynamic-card">
            <ContentBox title="dynamic card">
              <StaticImage
                src="../images/thumbnails/dynamic-card.png"
                alt="dynamic card content preview"
                placeholder="blurred"
                objectFit="contain"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: 250,
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/border-animation">
            <ContentBox title="border-animation">
              <StaticImage
                src="../images/thumbnails/border-animation.jpg"
                alt="Button Border Animation Preview Image"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: 250,
                  width: '100%',
                }}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/typing-text">
            <ContentBox title="typing-text">
              <StaticImage
                src="../images/thumbnails/typing-text.png"
                alt="Typing Text Effect Preview Image"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: 250,
                }}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/genie-window">
            <ContentBox title="genie-window">
              <StaticImage
                src="../images/thumbnails/genie-effect.png"
                alt="Modal Interaction with Genie Effect Preview"
                objectFit="contain"
                placeholder="blurred"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/particle-text">
            <ContentBox title="particle-text">
              <StaticImage
                src="../images/thumbnails/particle-text.jpg"
                alt="particle text content preview"
                objectFit="contain"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/blurred-logo">
            <ContentBox title="blurred-logo">
              <StaticImage
                src="../images/thumbnails/blurred-logo.png"
                alt="blurred logo content preview"
                objectFit="contain"
                placeholder="blurred"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/light-bulb">
            <ContentBox title="light-bulb">
              <StaticImage
                src="../images/thumbnails/light-bulb.jpg"
                alt="light bulb content preview"
                placeholder="blurred"
                style={{
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                  width: '100%',
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>
      </ContentList>
    </PageLayout>
  );
};

export default IndexPage;

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="soyoung"
      description="Build, Collect user interfaces of the future what is exciting and challenging to create."
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
      absolutePath: { glob: "**/src/images/thumbnails/index.jpg" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
  }
`;
