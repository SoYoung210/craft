import React from 'react';
import type { HeadFC } from 'gatsby';

import '../styles/global.css';
import { ContentBox } from '../components/content-box/ContentBox';
import PageLayout from '../components/layout/PageLayout';

const IndexPage = () => {
  return (
    <PageLayout title="uing">
      <ContentBox title="test" />
    </PageLayout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
