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

globalStyle(`___gatsby`, {
  isolation: `isolate`,
});
