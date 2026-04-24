import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { entries } from '@/utils/object';
import { radialGradient } from '@/utils/style/gradient';

import { backgroundColorMap } from './PageLayout.css';
import { ContentSwitchTab } from './ContentSwitchTab';

const mainVariants = cva(
  'max-w-[760px] p-4 md:p-8 lg:p-16 min-h-screen flex flex-col gap-8 relative mx-auto',
  {
    variants: {
      theme: {
        gradient: '',
        normal: '',
      },
    },
    defaultVariants: {
      theme: 'normal',
    },
  }
);

const gradientBackgroundImage = entries(backgroundColorMap)
  .map(([, { start, end, value }]) => {
    return radialGradient(start, end, [`${value} 0`, 'transparent 50%']);
  })
  .join(', ');

interface Props extends ComponentPropsWithoutRef<'main'> {
  children: ReactNode;
  theme?: 'gradient' | 'normal';
  switchTabDefaultOpen?: boolean;
}

export default function PageLayout({
  children,
  theme = 'normal',
  switchTabDefaultOpen,
  className,
  ...props
}: Props) {
  return (
    <main className={cn(mainVariants({ theme }), className)} {...props}>
      {theme === 'gradient' && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[60%] h-full pointer-events-none animate-[background-rotate_20s_linear_infinite] opacity-20 -z-1"
          style={{
            backgroundImage: gradientBackgroundImage,
            backgroundSize: '180%, 200%',
            filter: 'blur(100px) saturate(150%)',
          }}
        />
      )}
      {children}
      <ContentSwitchTab defaultOpen={switchTabDefaultOpen} />
    </main>
  );
}

function Title({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'text-[40px] font-bold text-gray-8 tracking-[-0.03em]',
        className
      )}
      {...props}
    />
  );
}

function SubTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'text-[20px] font-medium text-gray-8 tracking-[-0.01em] leading-[1.8]',
        className
      )}
      {...props}
    />
  );
}

function DetailContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'p-3 leading-[1.5] scale-90 opacity-0 transition-[opacity,transform] duration-100 ease-linear group-open:opacity-100 group-open:scale-100',
        className
      )}
      {...props}
    />
  );
}

function Details({ className, ...props }: React.ComponentProps<'details'>) {
  return (
    <details
      className={cn(
        'group flex flex-col text-gray-6 focus:outline-none focus-visible:outline-none',
        className
      )}
      {...props}
    />
  );
}

function Summary({ className, ...props }: React.ComponentProps<'summary'>) {
  return (
    <summary
      className={cn('focus:outline-none focus-visible:outline-none', className)}
      {...props}
    />
  );
}

PageLayout.Title = Title;
PageLayout.SubTitle = SubTitle;
PageLayout.Details = Details;
PageLayout.DetailsContent = DetailContent;
PageLayout.Summary = Summary;
