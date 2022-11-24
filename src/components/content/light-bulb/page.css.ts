import { createVar, style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../../styles/theme.css';

const mainLayout = style({
  padding: 64,
  paddingTop: '12rem',
  minHeight: '100vh',
  maxWidth: '42rem',
  margin: '0 auto',
});

export const textColorFromVars = createVar();
export const textColorToVars = createVar();
export const main = style({
  padding: 64,
  paddingTop: '12rem',
  minHeight: '100vh',
  maxWidth: '42rem',
  margin: '0 auto',

  vars: {
    [textColorFromVars]: vars.color.gray7,
    [textColorToVars]: vars.color.gray7,
  },
});

export const mainTheme = styleVariants({
  dark: [
    mainLayout,
    {
      vars: {
        [textColorFromVars]: vars.color.gray7,
        [textColorToVars]: vars.color.gray7,
      },
    },
  ],
  light: [
    mainLayout,
    {
      vars: {
        [textColorFromVars]: 'hsla(55,97%,88%,.8)',
        [textColorToVars]: 'rgba(253,224,71,.3)',
      },
    },
  ],
});

export const contentContainer = style({
  padding: '1rem',
  gap: '2rem',
  display: 'flex',
  flexDirection: 'column',
});

export const root = style({
  backgroundColor: 'rgb(5,5,5)',

  minHeight: '100vh',
});

export const bulbContainer = style({
  position: 'absolute',
  left: '12rem',
});

export const textColorStyle = style({
  color: 'transparent',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',

  backgroundImage: `linear-gradient(to bottom, ${textColorFromVars},${textColorToVars})`,
});
