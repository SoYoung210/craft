import { Primitive } from '@radix-ui/react-primitive';
import { forwardRef, HTMLAttributes } from 'react';

import { styled } from '../../../../stitches.config';
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
  gradientColor?: ValidColorType | [ValidColorType, ValidColorType];
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (props, ref) => {
    const {
      children,
      borderWidth = 1,
      gradientColor = 'rgb(255,255,255)',
      ...restProps
    } = props;
    const [glowColor1, glowColor2] = getGlowColor(
      Array.isArray(gradientColor)
        ? gradientColor
        : [gradientColor, gradientColor]
    );

    return (
      <ListItemProvider borderWidth={borderWidth}>
        <Li
          ref={ref}
          {...listGlowItemAttribute}
          css={{
            '&::before': {
              background: glowBackground(glowColor1),
            },
            '&::after': {
              background: glowBackground(glowColor2),
            },
          }}
          {...restProps}
        >
          {children}
        </Li>
      </ListItemProvider>
    );
  }
);

function getGlowColor(color: [ValidColorType, ValidColorType]) {
  const [color1, color2] = color;

  const alphaColor1 = isHexColor(color1)
    ? hexToRGBA(color1, 0.3)
    : rgbToRGBA(color1, 0.3);

  const alphaColor2 = isHexColor(color2)
    ? hexToRGBA(color2, 0.1)
    : rgbToRGBA(color2, 0.1);

  return [alphaColor1, alphaColor2];
}

function glowBackground(color: string) {
  return `radial-gradient(
    400px circle at ${getVar(listGlowX)} ${getVar(listGlowY)},
    ${color}, transparent 40%)`;
}

const Li = styled('li', {
  background: 'rgba(255, 255, 255, 0.12)',
  width: '200px',
  height: 280,
  aspectRatio: '4 / 3',
  position: 'relative',
  transition: 'background 0.1s',
  isolation: 'isolate',
  borderRadius: '12px',
  // safari >= 15.4 🥹
  contain: 'strict',

  '&:hover': {
    '&::after, &::before': {
      opacity: 1,
    },
  },

  '&::after, &::before': {
    borderRadius: 'inherit',
    content: '""',
    height: '100%',
    left: '0px',
    opacity: '0',
    position: 'absolute',
    top: '0px',
    transition: 'opacity 500ms',
    width: '100%',
  },

  '&::after': {
    background: `radial-gradient(
      400px circle at ${getVar(listGlowX)} ${getVar(listGlowY)},
      rgba(255,255,255,0.1), transparent 40%)`, // zIndex: 1,
  },

  '&::before': {
    background: `radial-gradient(
      800px circle at ${getVar(listGlowX)} ${getVar(listGlowY)},
      rgba(255,255,255,0.3), transparent 40%)`,
  },
});

export const ListItemContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { children, style: styleFromProps, ...restProps } = props;
  const { borderWidth } = useListItemContext('ListItemContent');

  const style = {
    top: `${borderWidth}px`,
    right: `${borderWidth}px`,
    bottom: `${borderWidth}px`,
    left: `${borderWidth}px`,
    ...styleFromProps,
  };

  return (
    <PrimitiveDiv ref={ref} style={style} {...restProps}>
      {children}
    </PrimitiveDiv>
  );
});

const PrimitiveDiv = styled(Primitive.div, {
  position: 'absolute',
  borderRadius: 'inherit',
  backgroundColor: 'rgb(19, 19, 21)',
});
