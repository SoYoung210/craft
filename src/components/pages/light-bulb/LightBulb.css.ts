import { keyframes, style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../../styles/theme.css';

const swing = keyframes({
  from: {
    transform: 'rotate(3deg)',
  },
  to: {
    transform: 'rotate(-3deg)',
  },
});

export const area = style({
  width: '200px',
  height: '500px',
  animation: `${swing} 1s infinite ease-in-out alternate`,
  transformOrigin: 'top',
});

export const wire = style({
  position: 'relative',
  left: '98px',
  height: '200px',
  width: '4px',
  backgroundColor: vars.color.black,
});

export const fixture = style({
  position: 'relative',
  backgroundColor: vars.color.gray6,
  width: '16px',
  height: '20px',
  left: '92px',
  zIndex: 1,
});

export const strip = style({
  position: 'absolute',
  width: '18px',
  height: '2px',
  right: '-1px',
  backgroundColor: vars.color.gray5,

  top: 4,

  selectors: {
    '&:nth-of-type(2)': {
      top: 7,
    },
    '&:nth-of-type(3)': {
      top: 10,
    },
  },
});

const bulbAnimation = keyframes({
  '0%': {
    backgroundPosition: '10% 0%',
  },
  '50%': {
    backgroundPosition: '91% 100%',
  },
  '100%': {
    backgroundPosition: '10% 0%',
  },
});

const bulbBase = style({
  position: 'relative',
  width: '40px',
  height: '40px',
  left: '80px',
  bottom: '2px',

  borderRadius: '50%',

  outline: 'none',
  border: 'none',
  appearance: 'none',
  cursor: 'pointer',
});
export const bulb = styleVariants({
  dark: [bulbBase, { background: 'hsla(0,0%,45%,.5)' }],
  light: [
    bulbBase,
    {
      background: `linear-gradient(
        90deg,
        rgba(246, 234, 193, 1) 0%,
        rgba(226, 211, 161, 0.85) 60%,
        rgba(133, 115, 58, 1) 100%
      )`,
      boxShadow: `0px 0px 300px 90px rgba(235, 209, 164, 1),
      0px 0px 300px 900px rgba(235, 209, 164, 0.09),
      0px 0px 3000px 20px rgba(235, 209, 164, 1)`,
      animation: `${bulbAnimation} 5s ease infinite`,
    },
  ],
  // selectors: {
  //   '&.off': {
  //     background: 'hsla(0,0%,45%,.5)',
  //   },
  //   '&.on': {
  //     background: `linear-gradient(
  //       90deg,
  //       rgba(246, 234, 193, 1) 0%,
  //       rgba(226, 211, 161, 0.85) 60%,
  //       rgba(133, 115, 58, 1) 100%
  //     )`,
  //     boxShadow: `0px 0px 300px 90px rgba(235, 209, 164, 1),
  //     0px 0px 300px 900px rgba(235, 209, 164, 0.09),
  //     0px 0px 3000px 20px rgba(235, 209, 164, 1)`,
  //     animation: `${bulbAnimation} 5s ease infinite`,
  //   },
  // },
});

export const zig = style({
  position: 'absolute',
  backgroundColor: 'transparent',
  width: '10px',
  height: '5px',
  borderRadius: '5px / 2.5px',
  top: 0,
  left: 15,
  border: 'black solid 1px',

  selectors: {
    '&:nth-of-type(2)': {
      top: 2,
    },
    '&:nth-of-type(3)': {
      top: 4,
    },
  },
});
