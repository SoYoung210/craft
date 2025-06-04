import { graphql, PageProps, Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

import { ContentBox } from '../components/layout/content-box/ContentBox';
import PageLayout from '../components/layout/page-layout/PageLayout';
import ContentList from '../components/layout/ContentList';
import SEO from '../components/layout/SEO';

const IndexPage = () => {
  return (
    <PageLayout theme="gradient">
      <PageLayout.Title>Craft</PageLayout.Title>
      <ContentList className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        <ContentList.Item active>
          <Link to="/timezone-clock">
            <ContentBox title="Timezone Clock">
              <StaticImage
                src="../images/thumbnails/clock-thumbanil-5.webp"
                alt="Timezone Clock"
                placeholder="none"
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
          <Link to="/dynamic-island-toc">
            <ContentBox title="Dynamic Island TOC">
              <StaticImage
                src="../images/thumbnails/dynamic-island-toc.webp"
                alt="Dynamic Island TOC"
                placeholder="none"
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/particle-effect">
            <ContentBox title="Particle Effect">
              <StaticImage
                src="../images/thumbnails/particle-effect.webp"
                alt="Particle Effect"
                placeholder="none"
                style={{
                  maxWidth: 460,
                }}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/radial-menu">
            <ContentBox title="Radial Menu">
              <StaticImage
                src="../images/thumbnails/radial-menu.jpeg"
                alt="Radial Menu with Content"
                placeholder="none"
                style={{
                  height: 250,
                }}
                quality={70}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/dock-menu">
            <ContentBox title="Dock Menu">
              <StaticImage
                src="../images/thumbnails/dock-item.jpeg"
                alt="Oval Dock Menu with Content"
                placeholder="none"
                style={{
                  height: 250,
                }}
                quality={70}
              />
            </ContentBox>
          </Link>
        </ContentList.Item>

        <ContentList.Item>
          <Link to="/switch-tab">
            <ContentBox title="Switch Tab">
              <StaticImage
                src="../images/thumbnails/switch-tab-1.jpg"
                alt="Mac, Arc Style Switch Tab (use Space + Tab)"
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
