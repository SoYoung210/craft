import React from 'react';
import type { HeadFC } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';

import '../styles/global.css';
import { ContentBox } from '../components/content-box/ContentBox';
import PageLayout from '../components/layout/PageLayout';
import { styled } from '../../stitches.config';

const IndexPage = () => {
  return (
    <PageLayout theme="gradient">
      <PageLayout.Title>uing</PageLayout.Title>
      <ContentList>
        <ContentItem>
          <Link to="/blurred-logo">
            <ContentBox title="blurred-logo">
              <StaticImage
                src="../images/thumbnails/blurred-logo.png"
                alt="blurred logo content preview"
                objectFit="contain"
                height={250}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentItem>

        <ContentItem>
          <Link to="/3d-card">
            <ContentBox title="3d card">
              <StaticImage
                src="../images/thumbnails/3d-card.png"
                alt="3d card content preview"
                height={250}
                objectFit="contain"
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            </ContentBox>
          </Link>
        </ContentItem>

        <ContentItem>
          <Link to="/light-bulb">
            <ContentBox title="light-bulb">
              <StaticImage
                src="../images/thumbnails/light-bulb.png"
                alt="light bulb content preview"
                objectFit="contain"
                height={250}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#181612',
                }}
                quality={100}
              />
            </ContentBox>
          </Link>
        </ContentItem>
      </ContentList>
    </PageLayout>
  );
};

const ContentList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

const ContentItem = styled('li', {});

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
