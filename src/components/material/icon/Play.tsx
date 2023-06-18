import { forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface PlayIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const PlayIcon = forwardRef<SVGSVGElement, PlayIconProps>(
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
        xmlns="http://www.w3.org/2000/svg"
        {...restProps}
        ref={forwardedRef}
        style={{ width: size, height: size, flexShrink: 0, ...style }}
      >
        <path
          d="M8.54076 20.0094C7.87525 20.4372 7 19.9594 7 19.1682V4.38705C7 3.58464 7.89752 3.10902 8.5615 3.55957L19.7473 11.1499C20.3408 11.5526 20.3299 12.4307 19.7266 12.8185L8.54076 20.0094Z"
          fill={color}
          stroke={color}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
