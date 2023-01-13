import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { keyframes, styled } from '../../../stitches.config';
import { entries } from '../../utils/object';
import { radialGradient } from '../../utils/style/gradient';

import { backgroundColorMap } from './PageLayout.css';

interface Props extends ComponentPropsWithoutRef<typeof Main> {
  children: ReactNode;
  theme?: 'gradient' | 'normal';
}

//https://web.dev/rendering-performance/
// https://stackoverflow.com/questions/35906196/improve-css3-background-position-animations-performance
const backgroundAnimation = keyframes({
  '0%': { transform: 'translateX(-50%) rotate(0deg)' },
  '50%': { transform: 'translateX(-50%) rotate(270deg)' },
  '100%': { transform: 'translateX(-50%) rotate(0deg)' },
});

export default function PageLayout({
  children,
  theme = 'normal',
  ...props
}: Props) {
  return (
    <Main {...props} theme={theme}>
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
          position: 'fixed',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          content: '',
          width: '60%',
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
          animation: `${backgroundAnimation} infinite 20s linear`,
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

const SubTitle = styled('h2', {
  fontSize: 36,
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
PageLayout.SubTitle = SubTitle;
PageLayout.Details = Details;
PageLayout.DetailsContent = DetailContent;
PageLayout.Summary = Summary;
