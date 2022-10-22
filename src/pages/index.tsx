import React from 'react';
import type { HeadFC } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

import '../styles/global.css';
import { ContentBox } from '../components/content-box/ContentBox';
import PageLayout from '../components/layout/PageLayout';
import { styled } from '../../stitches.config';

const IndexPage = () => {
  return (
    <PageLayout title="uing">
      <ContentList>
        <ContentItem>
          <ContentBox title="3d card">
            <StaticImage
              src="../images/3d-card.png"
              alt="3d card content preview"
              height={250}
              objectFit="contain"
              style={{ display: 'flex', justifyContent: 'center' }}
            />
          </ContentBox>
        </ContentItem>

        <ContentItem>
          <ContentBox title="light-bulb">
            <StaticImage
              src="../images/light-bulb.png"
              alt="light bulb content preview"
              height={250}
              objectFit="contain"
              style={{ display: 'flex', justifyContent: 'center' }}
            />
          </ContentBox>
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
