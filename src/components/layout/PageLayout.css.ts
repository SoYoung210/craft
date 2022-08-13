import { keyframes, style } from '@vanilla-extract/css';

import { entries } from '../../utils/object';
import { radialGradient } from '../../utils/style/gradient';

export const backgroundAnimation = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '80% 100%' },
  '100%': { backgroundPosition: '0% 50%' },
});

export const backgroundColorMap = {
  blue: {
    start: '50%',
    end: '37%',
    value: '#3a8bfd',
  },
  purple: {
    start: '97%',
    end: '21%',
    value: '#9772fe',
  },
  red: {
    start: '52%',
    end: '99%',
    value: '#fd3a4e',
  },
  green: {
    start: '10%',
    end: '29%',
    value: '#5afc7d',
  },
  beige: {
    start: '97%',
    end: '96%',
    value: '#e4c795',
  },
  cosmicBlue: {
    start: '33%',
    end: '50%',
    value: '#8ca8e8',
  },
  pink: {
    start: '79%',
    end: '53%',
    value: '#eea5ba',
  },
};

export const pageStyles = style({
  maxWidth: 760,
  padding: 64,
  minHeight: '100vh',

  display: 'flex',
  flexDirection: 'column',
  gap: '32px',

  position: 'relative',
  margin: '0 auto',

  '::before': {
    position: 'absolute',
    content: '',
    width: '100%',
    height: '100%',

    backgroundImage: entries(backgroundColorMap)
      .map(([, { start, end, value }]) => {
        return radialGradient(start, end, [`${value} 0`, 'transparent 50%']);
      })
      .join(', '),
    backgroundSize: '180%, 200%',
    filter: 'blur(100px) saturate(150%)',
    animation: `${backgroundAnimation} infinite 10s linear`,
    opacity: 0.2,
    zIndex: -1,
  },
});

export const headingStyles = style({
  fontSize: 48,
  fontWeight: 700,
  color: '#000',
  letterSpacing: '-0.03em',
});
