import { CSSProperties, ReactNode } from 'react';

import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const figureVariants = cva(
  'p-8 rounded-[1rem] [background-size:2rem_2rem] [-webkit-mask-image:radial-gradient(white,black)]',
  {
    variants: {
      theme: {
        dark: '',
        light: '',
      },
    },
    defaultVariants: {
      theme: 'light',
    },
  }
);

const themeStyles: Record<'dark' | 'light', CSSProperties> = {
  light: {
    '--figure-grid-color': 'rgb(244 244 245)',
    '--figure-bg-color': '#fff',
  } as CSSProperties,
  dark: {
    '--figure-grid-color': 'rgba(39 39 42/0.25)',
    '--figure-bg-color': '#18181B',
  } as CSSProperties,
};

interface Props {
  theme?: 'dark' | 'light';
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export default function Figure(props: Props) {
  const { theme = 'light', children, className, style } = props;

  return (
    <div
      className={cn(figureVariants({ theme }), className)}
      style={{
        ...themeStyles[theme],
        backgroundColor: 'var(--figure-bg-color)',
        backgroundImage:
          'linear-gradient(to right,var(--figure-grid-color) 1px,#0000 1px),linear-gradient(to bottom,var(--figure-grid-color) 1px,#0000 1px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
