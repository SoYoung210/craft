import React from 'react';
import type { HeadFC } from 'gatsby';

import * as styles from '../styles/index.css';
import '../styles/global.css';
import { ContentBox } from '../components/ContentBox/ContentBox';

const IndexPage = () => {
  return (
    <main className={styles.pageStyles}>
      <h1 className={styles.headingStyles}>uing</h1>
      <ContentBox title="test" />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
