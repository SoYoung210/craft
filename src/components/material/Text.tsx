import { forwardRef, ComponentProps, CSSProperties } from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import type * as Radix from '@radix-ui/react-primitive';
import type * as Stitches from '@stitches/react';

import { PresetColorType, styled } from '../../../stitches.config';
import { LiteralUnion } from '../../utils/type';
import { getColor } from '../../utils/color';

type PrimitiveTextProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
export interface TextProps
  extends Omit<ComponentProps<typeof StyledText>, 'paragraph'>,
    PrimitiveTextProps {
  color: LiteralUnion<PresetColorType, string>;
  size?: string | number;
  weight?: CSSProperties['fontWeight'];
  lineHeight?: CSSProperties['lineHeight'] | 'paragraph';
  /**
   * -webkit-line-clamp property
   * @see https://developer.mozilla.org/ko/docs/Web/CSS/-webkit-line-clamp
   **/
  ellipsis?: boolean | { lineClamp: number };
  monospace?: boolean;
}

type TextElement = React.ElementRef<typeof Primitive.span>;
const Text = forwardRef<TextElement, TextProps>(function Text(
  {
    children,
    color: colorFromProps,
    weight,
    css: cssFromProps,
    size,
    ellipsis,
    lineHeight,
    monospace = false,
    ...props
  },
  forwardedRef
) {
  const color = colorFromProps != null ? getColor(colorFromProps) : undefined;

  return (
    <StyledText
      ref={forwardedRef}
      css={{
        ...cssFromProps,
        color,
        fontSize: size,
        fontWeight: weight,
        lineHeight: lineHeight !== 'paragraph' ? lineHeight : undefined,
        ...getLineClampStyle(ellipsis),
      }}
      paragraph={lineHeight === 'paragraph'}
      monospace={monospace}
      {...props}
    >
      {children}
    </StyledText>
  );
});

function getLineClampStyle(
  ellipsis?: boolean | { lineClamp: number }
): Stitches.CSS | null {
  if (ellipsis === false || ellipsis == null) {
    return null;
  }

  const lineClamp = ellipsis === true ? 1 : ellipsis.lineClamp;

  return {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    lineClamp,
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': lineClamp,
  };
}
const StyledText = styled(Primitive.span, {
  lineHeight: 'inherit',
  variants: {
    inherit: {
      true: {
        fontSize: 'inherit',
        fontWeight: 'inherit',
      },
    },
    paragraph: {
      true: {
        '&&': {
          lineHeight: 1.5,
        },
      },
    },
    monospace: {
      true: {
        fontFeature: 'monospace',
      },
    },
  },
});

export default Text;
