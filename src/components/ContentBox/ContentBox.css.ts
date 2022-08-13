import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const rootStyle = style({
  backgroundColor: vars.color.white,
  boxShadow: vars.shadows.medium,
  overflow: 'hidden',
  borderRadius: '8px',
  height: 300,
});
export const headerStyle = style({
  display: 'flex',
  backgroundColor: vars.color.gray1,
  minHeight: 50,
  alignItems: 'center',
  padding: '0 16px',
  color: vars.color.gray7,
});
