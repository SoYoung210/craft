import { Root, List, Trigger, Content, TabsProps } from '@radix-ui/react-tabs';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import { cn } from '@/utils/cn';
import { createContext } from '../utility/createContext';

import Figure from './Figure';

type Theme = 'dark' | 'light';
interface FigureTabsContextValue {
  theme: Theme;
}
const [FigureTabsProvider, useFigureTabsContext] =
  createContext<FigureTabsContextValue>('BorderAnimation');

type TabsElement = ElementRef<typeof Root>;
export interface FigureTabsProps extends TabsProps {
  theme: Theme;
}
const FigureTabsImpl = forwardRef<TabsElement, FigureTabsProps>(
  ({ className, ...props }, ref) => {
    const { theme, children, ...tabRootProps } = props;

    return (
      <FigureTabsProvider theme={theme}>
        <Figure theme={theme}>
          <Root
            ref={ref}
            className={cn(
              'grid grid-rows-[1fr_max-content] min-h-[36rem]',
              className
            )}
            {...tabRootProps}
          >
            {children}
          </Root>
        </Figure>
      </FigureTabsProvider>
    );
  }
);

type TabsListElement = ElementRef<typeof List>;
export type FigureTabsListProps = ComponentPropsWithoutRef<typeof List> & {
  className?: string;
};
const FigureTabsList = forwardRef<TabsListElement, FigureTabsListProps>(
  ({ className, ...props }, ref) => {
    return <List ref={ref} className={cn('flex', className)} {...props} />;
  }
);

type TabsTriggerElement = ElementRef<typeof Trigger>;
export type FigureTabsTriggerProps = ComponentPropsWithoutRef<typeof Trigger> & {
  className?: string;
};
const FigureTabsTrigger = forwardRef<
  TabsTriggerElement,
  FigureTabsTriggerProps
>(({ className, ...props }, ref) => {
  useFigureTabsContext('FigureTabs.Trigger');
  return (
    <Trigger
      ref={ref}
      className={cn(
        'text-gray-5 px-4 py-1 rounded-full bg-transparent leading-[1.5] cursor-pointer',
        '[&+&]:ml-1',
        'hover:text-gray-3',
        'data-[state=active]:text-gray-0 data-[state=active]:bg-gray-9',
        'transition-[color,background-color] duration-150 ease-in-out',
        className
      )}
      {...props}
    />
  );
});

const FigureTabs = Object.assign({}, FigureTabsImpl, {
  List: FigureTabsList,
  Trigger: FigureTabsTrigger,
  Content,
});

export default FigureTabs;
