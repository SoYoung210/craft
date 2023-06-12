import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';
import { CSSProperties } from '@vanilla-extract/css';

export const colors = {
  gray0: '#f8f9fa',
  gray1: '#f4f5f6',
  gray2: '#e9ecef',
  gray3: '#dee2e6',
  gray4: '#ced4da',
  gray5: '#adb5bd',
  gray6: '#868e96',
  gray7: '#495057',
  gray8: '#343a40',
  gray9: '#212529',
  gray10: '#171717',
  white: '#FFFFFF',
  black: '#000000',
  gold0: '#fffcf2',
  gold1: '#ffeebd',
  gold2: '#ffd454',
  gold3: '#fab300',
  gold4: '#b57700',
  gold5: '#704300',
  white088: 'rgba(255, 255, 255, 0.88)',
  white080: 'rgba(255, 255, 255, 0.8)',
  white072: 'rgba(255, 255, 255, 0.72)',
  white064: 'rgba(255, 255, 255, 0.64)',
  white056: 'rgba(255, 255, 255, 0.56)',
  white048: 'rgba(255, 255, 255, 0.48)',
  white040: 'rgba(255, 255, 255, 0.4)',
  white032: 'rgba(255, 255, 255, 0.32)',
  white028: 'rgba(255, 255, 255, 0.28)',
  white024: 'rgba(255, 255, 255, 0.24)',
  white020: 'rgba(255, 255, 255, 0.2)',
  white016: 'rgba(255, 255, 255, 0.16)',
  white012: 'rgba(255, 255, 255, 0.12)',
  white010: 'rgba(255, 255, 255, 0.1)',
  white008: 'rgba(255, 255, 255, 0.08)',
  white006: 'rgba(255, 255, 255, 0.06)',
  white004: 'rgba(255, 255, 255, 0.04)',
  white003: 'rgba(255, 255, 255, 0.03)',
  white096: 'rgba(255, 255, 255, 0.96)',
  white001: 'rgba(255, 255, 255, 0.01)',
  white002: 'rgba(255, 255, 255, 0.02)',
} as const;

const interactivityIntensity = {
  medium: {
    hover: 0.1,
    active: 0.15,
  },
  strong: {
    hover: 0.15,
    active: 0.2,
  },
};

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
  reset,
} = createStitches({
  theme: {
    shadows: {
      small: '0 5px 10px rgba(0,0,0,0.12)',
      medium: ' 0 8px 30px rgba(0,0,0,0.12)',
      large: '0 30px 60px rgba(0,0,0,0.12)',
    },
    colors,
  },
  utils: {
    size: (value: string | number) => ({
      width: value,
      height: value,
    }),
    bc: (value: Stitches.PropertyValue<'backgroundColor'>) => ({
      backgroundColor: value,
    }),
    br: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderRadius: value,
    }),
    mx: (value: string | number) => ({ marginLeft: value, marginRight: value }),
    my: (value: string | number) => ({ marginTop: value, marginBottom: value }),
    px: (value: string | number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    interactivity: (value: 'medium' | 'strong') => ({
      position: 'relative',

      '&::before': {
        position: 'absolute',
        content: '""',
        inset: 0,
        backgroundColor: colors.gray9,

        opacity: 0,
        borderRadius: 'inherit',
      },

      '&:hover': {
        '&::before': {
          opacity: interactivityIntensity[value].hover,
        },
      },

      '&:active': {
        '&::before': {
          opacity: interactivityIntensity[value].active,
        },
      },
    }),

    resetButton: (display: CSSProperties['display']) => ({
      display,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
      overflow: 'hidden',

      margin: '0',
      padding: '0',

      outline: '0',
      border: '0 solid transparent',
      background: 'transparent',
      cursor: 'pointer',

      fontFamily: 'inherit',
      fontWeight: '600',
      '-webkit-font-smoothing': 'antialiased',

      '&:hover,&:focus': {
        textDecoration: 'none',
      },

      '&:focus': {
        outline: 'none',
      },
    }),
  },
});

export const ease = {
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
};

export type PresetColorType = keyof typeof colors;
export type StitchesCssType = Stitches.CSS<typeof config>;
