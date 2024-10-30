import { globalCss } from '../../stitches.config';

export const globalStyles = globalCss({
  '*': {
    boxSizing: `border-box`,
    margin: 0,
    WebkitFontSmoothing: 'antialiased',
  },
  '*::selection': {
    background: '#95a5ac40',
  },
  'html, body': {
    height: `100%`,
    fontSize: `14px`,
    fontFamily: `"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif`,
    fontFeatureSettings: `"liga" 1, "calt" 1`,
    '@supports (font-variation-settings: normal)': {
      fontFamily: `"Inter Variable", sans-serif`,
    },
  },
  a: {
    textDecoration: 'none',
  },
  'ul, ol': {
    paddingInlineStart: '1.4rem',
  },
  button: {
    border: 0,
    padding: 0,
  },

  '@font-face': {
    fontFamily: 'Nanum Pen Script',
    fontDisplay: 'block',
  },
});
