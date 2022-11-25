import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { styled } from '../../../stitches.config';
import { entries } from '../../utils/object';
import { radialGradient } from '../../utils/style/gradient';

import * as styles from './PageLayout.css';
import { backgroundAnimation, backgroundColorMap } from './PageLayout.css';

interface Props extends ComponentPropsWithoutRef<typeof Main> {
  children: ReactNode;
  theme?: 'gradient' | 'normal';
}

export default function PageLayout({
  children,
  theme = 'normal',
  ...props
}: Props) {
  return (
    <Main theme={theme} className={styles.pageStyles} {...props}>
      {children}
    </Main>
  );
}

const Main = styled('main', {
  maxWidth: 760,
  padding: 64,
  minHeight: '100vh',

  display: 'flex',
  flexDirection: 'column',
  gap: '32px',

  position: 'relative',
  margin: '0 auto',

  variants: {
    theme: {
      gradient: {
        '&::before': {
          position: 'absolute',
          content: '',
          width: '100%',
          height: '100%',

          backgroundImage: entries(backgroundColorMap)
            .map(([, { start, end, value }]) => {
              return radialGradient(start, end, [
                `${value} 0`,
                'transparent 50%',
              ]);
            })
            .join(', '),
          backgroundSize: '180%, 200%',
          filter: 'blur(100px) saturate(150%)',
          animation: `${backgroundAnimation} infinite 10s linear`,
          opacity: 0.2,
          zIndex: -1,
        },
      },
      normal: {
        '&::before': {
          display: 'none',
        },
      },
    },
  },
});

const Title = styled('h1', {
  fontSize: 48,
  fontWeight: 700,
  color: '$gray8',
  letterSpacing: '-0.03em',
});

const DetailContent = styled('p', {
  padding: 12,
  lineHeight: 1.5,

  transform: 'scale(0.9)',
  opacity: 0,

  transition: 'opacity 0.1s ease, transform 0.1s ease',
});

const Details = styled('details', {
  display: 'flex',
  flexDirection: 'column',

  marginBottom: 60,
  color: '$gray6',

  '&[open]': {
    [`& ${DetailContent}`]: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
});

const Summary = styled('summary');

PageLayout.Title = Title;
PageLayout.Details = Details;
PageLayout.DetailsContent = DetailContent;
PageLayout.Summary = Summary;
