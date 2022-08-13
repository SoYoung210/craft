import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
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
    white: '#FFFFFF',
    black: '#000000',
  },
  shadows: {
    small: '0 5px 10px rgba(0,0,0,0.12)',
    medium: ' 0 8px 30px rgba(0,0,0,0.12)',
    large: '0 30px 60px rgba(0,0,0,0.12)',
  },
});
