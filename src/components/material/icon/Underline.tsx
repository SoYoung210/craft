import { forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface UnderlineIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const Underline = forwardRef<SVGSVGElement, UnderlineIconProps>(
  (
    { color: rawColor = 'currentColor', size = 24, style, ...restProps },
    forwardedRef
  ) => {
    const color = getColor(rawColor);

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        ref={forwardedRef}
        xmlns="http://www.w3.org/2000/svg"
        {...restProps}
        style={{ width: size, height: size, flexShrink: 0, ...style }}
      >
        <path
          d="M5 14H19"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
