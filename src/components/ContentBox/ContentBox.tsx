import { style } from '@vanilla-extract/css';
import React from 'react';

import { headerStyle, rootStyle } from './ContentBox.css';

interface Props {
  title: string;
}

export function ContentBox({ title }: Props) {
  return (
    <div className={rootStyle}>
      <div className={headerStyle}>{title}</div>
      <div></div>
    </div>
  );
}
