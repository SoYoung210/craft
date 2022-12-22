import { globalStyle } from '@vanilla-extract/css';

globalStyle(`*`, {
  boxSizing: `border-box`,
  margin: 0,
  WebkitFontSmoothing: 'antialiased',
});

globalStyle(`html, body`, {
  height: `100%`,
  fontSize: `14px`,
  fontFamily: `"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif`,
});

globalStyle('a', {
  textDecoration: 'none',
});

globalStyle('ul, ol', {
  paddingInlineStart: '1.4rem',
});

globalStyle('button', {
  border: 0,
  padding: 0,
});

globalStyle(`___gatsby`, {
  isolation: `isolate`,
});
