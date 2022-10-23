import React, { ReactNode } from 'react';

import { styled } from '../../../stitches.config';

interface Props {
  title: ReactNode;
  children: ReactNode;
}

export function ContentBox({ title, children }: Props) {
  return (
    <Root>
      <Header>
        <Dot />
        <Dot />
        <Dot />
        <TitleBar>{title}</TitleBar>
      </Header>
      {children}
    </Root>
  );
}

const Dot = styled('div', {
  borderRadius: '50%',
  backgroundColor: '#dee2e6',

  width: 8,
  height: 8,

  marginRight: 6,
  transition: 'background-color 0.15s ease',
});

const Root = styled('div', {
  backgroundColor: '$white',
  boxShadow: '$medium',
  overflow: 'hidden',
  borderRadius: '8px',
  height: 300,

  '&:hover': {
    [`${Dot}:nth-child(1)`]: {
      backgroundColor: '#FF5F57',
    },
    [`${Dot}:nth-child(2)`]: {
      backgroundColor: '#FEBC2E',
    },
    [`${Dot}:nth-child(3)`]: {
      backgroundColor: '#28C840',
    },
  },
});

const Header = styled('div', {
  display: 'flex',
  backgroundColor: '$gray1',
  minHeight: 50,
  alignItems: 'center',
  padding: '0 16px',
  color: '$gray7',
});

const TitleBar = styled('div', {
  marginLeft: 8,
  backgroundColor: '$white',
  borderRadius: 4,
  px: 16,
  py: 8,

  flexGrow: 1,
});
