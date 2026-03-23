import { forwardRef, HTMLAttributes } from 'react';

import { cn } from '../../../utils/cn';
import {
  HEXColor,
  hexToRGBA,
  isHexColor,
  RGBColor,
  rgbToRGBA,
} from '../../../utils/color';
import { getVar } from '../../../utils/css';
import { createContext } from '../../utility/createContext';

import { listGlowItemAttribute, listGlowX, listGlowY } from './constants';

interface ListItemContextValue {
  borderWidth: number;
}
const [ListItemProvider, useListItemContext] =
  createContext<ListItemContextValue>('ListItem');

type ValidColorType = HEXColor | RGBColor;

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  borderWidth?: number;
  gradientColor?: ValidColorType | ValidColorType[];
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (props, ref) => {
    const {
      children,
      borderWidth = 1,
      gradientColor = 'rgb(255,255,255)',
      className,
      style: styleFromProps,
      ...restProps
    } = props;

    const gradientColorSets = Array.isArray(gradientColor)
      ? gradientColor
      : [gradientColor];

    const beforeColor = gradientColorSets.map(color => {
      return toAlphaColor(color, 0.3);
    });
    const alphaColor = gradientColorSets.map(color => {
      return toAlphaColor(color, 0.1);
    });

    return (
      <ListItemProvider borderWidth={borderWidth}>
        <li
          ref={ref}
          {...listGlowItemAttribute}
          className={cn(
            'bg-white/[0.12] h-[280px] relative transition-[background] duration-100 isolate rounded-xl',
            // safari >= 15.4
            '[contain:strict]',
            // shared pseudo-element styles
            'after:rounded-[inherit] after:content-[""] after:h-full after:left-0 after:opacity-0 after:absolute after:top-0 after:transition-opacity after:duration-500 after:w-full after:pointer-events-none',
            'before:rounded-[inherit] before:content-[""] before:h-full before:left-0 before:opacity-0 before:absolute before:top-0 before:transition-opacity before:duration-500 before:w-full before:pointer-events-none',
            className
          )}
          style={{
            ...styleFromProps,
            // @ts-expect-error CSS custom properties
            '--li-before-bg': glowBackground(beforeColor, 900),
            '--li-after-bg': glowBackground(alphaColor, 500),
          }}
          {...restProps}
        >
          <style>{`
            [data-craft-list-glow-item]::before {
              background: var(--li-before-bg, radial-gradient(800px circle at ${getVar(listGlowX)} ${getVar(listGlowY)}, rgba(255,255,255,0.3), transparent 40%));
            }
            [data-craft-list-glow-item]::after {
              background: var(--li-after-bg, radial-gradient(400px circle at ${getVar(listGlowX)} ${getVar(listGlowY)}, rgba(255,255,255,0.1), transparent 40%));
            }
          `}</style>
          {children}
        </li>
      </ListItemProvider>
    );
  }
);

function toAlphaColor(color: ValidColorType, opacity: number) {
  return isHexColor(color)
    ? hexToRGBA(color, opacity)
    : rgbToRGBA(color, opacity);
}

function glowBackground(colors: string[], size: number) {
  return `radial-gradient(
    ${size}px circle at ${getVar(listGlowX)} ${getVar(listGlowY)},
    ${colors.join(',')}, transparent 40%)`;
}

export const ListItemContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { children, style: styleFromProps, className, ...restProps } = props;
  const { borderWidth } = useListItemContext('ListItemContent');

  const style = {
    top: `${borderWidth}px`,
    right: `${borderWidth}px`,
    bottom: `${borderWidth}px`,
    left: `${borderWidth}px`,
    ...styleFromProps,
  };

  return (
    <div
      ref={ref}
      className={cn(
        'absolute rounded-[inherit] bg-[rgb(19,19,21)] flex flex-col justify-center p-6',
        className
      )}
      style={style}
      {...restProps}
    >
      {children}
    </div>
  );
});
