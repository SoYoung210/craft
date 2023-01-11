import { ReactNode } from 'react';

import { styled } from '../../../stitches.config';

interface Props {
  theme?: 'dark' | 'light';
  children: ReactNode;
}
export default function Figure(props: Props) {
  const { theme, children } = props;
  return <Root theme={theme}>{children}</Root>;
}

const Root = styled('div', {
  $$gridColor: 'rgb(244 244 245)',
  $$bgColor: '#fff',

  backgroundColor: '$$bgColor',
  backgroundImage:
    'linear-gradient(to right,$$gridColor 1px,#0000 1px),linear-gradient(to bottom,$$gridColor 1px,#0000 1px)',
  '-webkit-mask-image': 'radial-gradient(white,black)',
  backgroundSize: '2rem 2rem',

  padding: '2rem',
  borderRadius: '1rem',

  variants: {
    theme: {
      dark: {
        $$gridColor: 'rgba(39 39 42/0.25)',
        $$bgColor: '#18181B',
      },
      light: {
        // $$gridColor: 'rgb(244 244 245)',
      },
    },
  },
});
