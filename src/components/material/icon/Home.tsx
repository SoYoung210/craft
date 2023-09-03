import { forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface HomeIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const HomeIcon = forwardRef<SVGSVGElement, HomeIconProps>(
  (
    { color: rawColor = 'currentColor', size = 24, style, ...restProps },
    forwardedRef
  ) => {
    const color = getColor(rawColor);

    return (
      <svg
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        style={{ width: size, height: size, flexShrink: 0, ...style }}
        ref={forwardedRef}
        {...restProps}
        x="246"
        y="246"
        alignmentBaseline="middle"
        fill="none"
      >
        <path
          d="M2.75 7v6.25a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1V7m1 1L8 1.75 1.75 8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
