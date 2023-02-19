import { forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface CheckIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const CheckIcon = forwardRef<SVGSVGElement, CheckIconProps>(
  (
    { color: rawColor = 'currentColor', size = 24, style, ...restProps },
    forwardedRef
  ) => {
    const color = getColor(rawColor);

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        {...restProps}
        ref={forwardedRef}
        style={{ width: size, height: size, flexShrink: 0, ...style }}
      >
        <path
          d="M18.3333 5.5L8.24996 15.5833L3.66663 11"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
