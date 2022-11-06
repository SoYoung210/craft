import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';

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
    colors: {
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
    },
  },
  utils: {
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
  },
});
