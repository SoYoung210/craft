import { forwardRef, CSSProperties, ComponentPropsWithoutRef } from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { LiteralUnion } from '../../utils/type';
import { getColor } from '../../utils/color';
import { cn } from '../../utils/cn';
import { PresetColorType } from '../../utils/colors';

type PrimitiveSpanProps = ComponentPropsWithoutRef<typeof Primitive.span>;
export interface TextProps extends PrimitiveSpanProps {
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
  inherit?: boolean;
}

type TextElement = React.ElementRef<typeof Primitive.span>;
const Text = forwardRef<TextElement, TextProps>(function Text(
  {
    children,
    color: colorFromProps,
    weight,
    className,
    style: styleFromProps,
    size,
    ellipsis,
    lineHeight,
    monospace = false,
    inherit,
    ...props
  },
  forwardedRef
) {
  const color = colorFromProps != null ? getColor(colorFromProps) : undefined;

  const lineClampStyle = getLineClampStyle(ellipsis);

  const style: CSSProperties = {
    ...styleFromProps,
    color,
    fontSize: size,
    fontWeight: weight,
    lineHeight:
      lineHeight === 'paragraph' ? 1.5 : lineHeight ?? 'inherit',
    ...lineClampStyle,
  };

  return (
    <Primitive.span
      ref={forwardedRef}
      className={cn(
        inherit && 'text-[inherit] font-[inherit]',
        monospace && 'tabular-nums',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </Primitive.span>
  );
});

function getLineClampStyle(
  ellipsis?: boolean | { lineClamp: number }
): CSSProperties | null {
  if (ellipsis === false || ellipsis == null) {
    return null;
  }

  const lineClamp = ellipsis === true ? 1 : ellipsis.lineClamp;

  return {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lineClamp,
  };
}

export default Text;
