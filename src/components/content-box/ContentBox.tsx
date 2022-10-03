import React, { ReactNode } from 'react';

import { dotStyle, headerStyle, rootStyle } from './ContentBox.css';

interface Props {
  title: ReactNode;
}

export function ContentBox({ title }: Props) {
  return (
    <div className={rootStyle}>
      <div className={headerStyle}>
        <div className={dotStyle} />
        <div className={dotStyle} />
        <div className={dotStyle} />
        {title}
      </div>
    </div>
  );
}
