import { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';
import { If } from '../../utility/If';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  children: ReactNode;
  dots?: boolean;
}

export function ContentBox({
  title,
  children,
  dots = true,
  className,
  ...restProps
}: Props) {
  return (
    <div
      className={cn(
        'group/contentbox flex flex-col bg-white shadow-md overflow-hidden rounded-lg h-[300px]',
        className
      )}
      {...restProps}
    >
      <div className="flex bg-gray-1 min-h-[50px] items-center px-4 text-gray-7">
        <If condition={dots}>
          <div className="rounded-full bg-[#dee2e6] w-2 h-2 mr-1.5 transition-colors duration-150 ease-linear group-hover/contentbox:bg-[#FF5F57]" />
          <div className="rounded-full bg-[#dee2e6] w-2 h-2 mr-1.5 transition-colors duration-150 ease-linear group-hover/contentbox:bg-[#FEBC2E]" />
          <div className="rounded-full bg-[#dee2e6] w-2 h-2 mr-1.5 transition-colors duration-150 ease-linear group-hover/contentbox:bg-[#28C840]" />
        </If>
        <div className="ml-2 bg-white rounded px-4 py-2 grow">{title}</div>
      </div>
      <div className="h-[calc(100%-50px)] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
