import React, { ReactNode } from 'react';

import * as styles from './PageLayout.css';

interface Props {
  children: ReactNode;
  title: ReactNode;
}

export default function PageLayout({ children, title }: Props) {
  return (
    <main className={styles.pageStyles}>
      <h1 className={styles.headingStyles}>{title}</h1>
      {children}
    </main>
  );
}
