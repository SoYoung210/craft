import { Root, List, Trigger, Content, TabsProps } from '@radix-ui/react-tabs';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import { styled } from '../../../stitches.config';
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
  (props, ref) => {
    const { theme, children, ...tabRootProps } = props;

    return (
      <FigureTabsProvider theme={theme}>
        <Figure theme={theme}>
          <StyledRoot ref={ref} {...tabRootProps}>
            {children}
          </StyledRoot>
        </Figure>
      </FigureTabsProvider>
    );
  }
);

type TabsListElement = ElementRef<typeof List>;
export type FigureTabsListProps = ComponentPropsWithoutRef<typeof StyledList>;
const FigureTabsList = forwardRef<TabsListElement, FigureTabsListProps>(
  (props, ref) => {
    return <StyledList ref={ref} {...props} />;
  }
);

type TabsTriggerElement = ElementRef<typeof Trigger>;
export type FigureTabsTriggerProps = ComponentPropsWithoutRef<
  typeof StyledTrigger
>;
const FigureTabsTrigger = forwardRef<
  TabsTriggerElement,
  FigureTabsTriggerProps
>((props, ref) => {
  useFigureTabsContext('FigureTabs.Trigger');
  return <StyledTrigger ref={ref} {...props} />;
});

const FigureTabs = Object.assign({}, FigureTabsImpl, {
  List: FigureTabsList,
  Trigger: FigureTabsTrigger,
  Content,
});

const StyledRoot = styled(Root, {
  display: 'grid',
  gridTemplateRows: '1fr max-content',
  minHeight: '36rem',
});

const StyledList = styled(List, {
  display: 'flex',
});

const StyledTrigger = styled(Trigger, {
  color: '$gray5',
  px: 16,
  py: 4,
  br: 9999,
  backgroundColor: 'transparent',
  lineHeight: 1.5,
  cursor: 'pointer',

  '& + &': {
    marginLeft: 4,
  },

  '&:hover': {
    color: '$gray3',
  },

  [`&[data-state='active']`]: {
    color: '$gray0',
    backgroundColor: '$gray9',
  },

  transitionProperty: 'color, background-color',
  transitionDuration: '0.15s',
  transitionTimingFunction: 'ease-in-out',
});
export default FigureTabs;
